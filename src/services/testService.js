// Test Service
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const testService = {
  // Create new test (Admin only)
  createTest: async (testData, adminId) => {
    try {
      const docRef = await addDoc(collection(db, 'tests'), {
        ...testData,
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalAttempts: 0,
        averageScore: 0,
      });

      // Initialize test questions collection
      if (testData.questions && testData.questions.length > 0) {
        const questionsRef = collection(db, 'tests', docRef.id, 'questions');
        for (let i = 0; i < testData.questions.length; i++) {
          await addDoc(questionsRef, {
            ...testData.questions[i],
            questionNumber: i + 1,
          });
        }
      }

      return { success: true, testId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all tests
  getAllTests: async () => {
    try {
      const q = query(collection(db, 'tests'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const tests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, tests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get test by ID
  getTestById: async (testId) => {
    try {
      const docSnap = await getDoc(doc(db, 'tests', testId));
      if (docSnap.exists()) {
        return { success: true, test: { id: docSnap.id, ...docSnap.data() } };
      }
      return { success: false, error: 'Test not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get tests by course ID
  getTestsByCourse: async (courseId) => {
    try {
      const q = query(
        collection(db, 'tests'),
        where('courseId', '==', courseId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const tests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, tests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get test questions
  getTestQuestions: async (testId) => {
    try {
      const snapshot = await getDocs(collection(db, 'tests', testId, 'questions'));
      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, questions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Submit test answers and calculate score
  submitTest: async (studentId, testId, answers) => {
    try {
      // Get test details
      const testSnap = await getDoc(doc(db, 'tests', testId));
      if (!testSnap.exists()) {
        return { success: false, error: 'Test not found' };
      }

      const testData = testSnap.data();

      // Get questions
      const questionsSnapshot = await getDocs(collection(db, 'tests', testId, 'questions'));
      const questions = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate score
      let correctAnswers = 0;
      const questionsWithResults = questions.map(question => {
        const studentAnswer = answers[question.id];
        const isCorrect = studentAnswer === question.correctAnswer;
        if (isCorrect) correctAnswers++;

        return {
          questionId: question.id,
          studentAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
        };
      });

      const score = (correctAnswers / questions.length) * 100;
      const totalMarks = questions.length;

      // Save test result
      const resultRef = doc(db, 'testResults', studentId, 'tests', testId);
      await setDoc(resultRef, {
        testId,
        studentId,
        completedAt: new Date(),
        score: Math.round(score),
        totalMarks,
        correctAnswers,
        answers: questionsWithResults,
        duration: testData.duration || 0,
      });

      // Update student progress
      const progressRef = doc(db, 'courseProgress', studentId);
      if (testData.courseId) {
        try {
          await updateDoc(progressRef, {
            [`courses.${testData.courseId}.testsCompleted`]: increment(1),
          });
        } catch (err) {
          // Document might not exist yet
        }
      }

      // Update test statistics
      const newAttempts = (testData.totalAttempts || 0) + 1;
      const newAverageScore =
        ((testData.averageScore || 0) * (newAttempts - 1) + score) / newAttempts;

      await updateDoc(doc(db, 'tests', testId), {
        totalAttempts: newAttempts,
        averageScore: Math.round(newAverageScore),
      });

      return {
        success: true,
        result: {
          score: Math.round(score),
          totalMarks,
          correctAnswers,
          incorrectAnswers: totalMarks - correctAnswers,
          percentage: Math.round(score),
          answers: questionsWithResults,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get test results for student
  getStudentTestResults: async (studentId, testId) => {
    try {
      const docSnap = await getDoc(doc(db, 'testResults', studentId, 'tests', testId));
      if (docSnap.exists()) {
        return { success: true, result: { id: docSnap.id, ...docSnap.data() } };
      }
      return { success: true, result: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update test
  updateTest: async (testId, updates) => {
    try {
      await updateDoc(doc(db, 'tests', testId), {
        ...updates,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete test
  deleteTest: async (testId) => {
    try {
      await deleteDoc(doc(db, 'tests', testId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};