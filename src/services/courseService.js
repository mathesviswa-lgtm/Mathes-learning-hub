// Course Service
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

export const courseService = {
  // Create new course (Admin only)
  createCourse: async (courseData, adminId) => {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...courseData,
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
        enrolledStudents: 0,
      });
      return { success: true, courseId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all courses
  getAllCourses: async () => {
    try {
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, courses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    try {
      const docSnap = await getDoc(doc(db, 'courses', courseId));
      if (docSnap.exists()) {
        return { success: true, course: { id: docSnap.id, ...docSnap.data() } };
      }
      return { success: false, error: 'Course not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get courses by admin ID
  getCoursesByAdmin: async (adminId) => {
    try {
      const q = query(
        collection(db, 'courses'),
        where('createdBy', '==', adminId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, courses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update course
  updateCourse: async (courseId, updates) => {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        ...updates,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Enroll student in course
  enrollStudentInCourse: async (studentId, courseId) => {
    try {
      const progressRef = doc(db, 'courseProgress', studentId);
      const enrollmentData = {
        enrolledAt: new Date(),
        completionPercentage: 0,
        lastAccessedAt: new Date(),
        testsCompleted: 0,
        averageScore: 0,
      };

      // Try to update existing document
      try {
        await updateDoc(progressRef, {
          [`courses.${courseId}`]: enrollmentData,
        });
      } catch (err) {
        // If document doesn't exist, create it
        await setDoc(progressRef, {
          userId: studentId,
          courses: {
            [courseId]: enrollmentData,
          },
        });
      }

      // Update enrolledStudents count
      const courseSnap = await getDoc(doc(db, 'courses', courseId));
      if (courseSnap.exists()) {
        const enrolledStudents = (courseSnap.data().enrolledStudents || 0) + 1;
        await updateDoc(doc(db, 'courses', courseId), { enrolledStudents });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get enrolled courses for student
  getEnrolledCourses: async (studentId) => {
    try {
      const docSnap = await getDoc(doc(db, 'courseProgress', studentId));
      if (docSnap.exists()) {
        const courseIds = Object.keys(docSnap.data().courses || {});
        const courses = [];

        for (const courseId of courseIds) {
          const courseSnap = await getDoc(doc(db, 'courses', courseId));
          if (courseSnap.exists()) {
            courses.push({
              id: courseId,
              ...courseSnap.data(),
              progress: docSnap.data().courses[courseId],
            });
          }
        }

        return { success: true, courses };
      }
      return { success: true, courses: [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};