// Progress Service
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const progressService = {
  // Initialize student progress
  initializeProgress: async (studentId) => {
    try {
      const progressRef = doc(db, 'courseProgress', studentId);
      await setDoc(progressRef, {
        userId: studentId,
        courses: {},
        totalCoursesEnrolled: 0,
        totalTestsCompleted: 0,
        overallScore: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get student progress
  getStudentProgress: async (studentId) => {
    try {
      const docSnap = await getDoc(doc(db, 'courseProgress', studentId));
      if (docSnap.exists()) {
        return { success: true, progress: { id: docSnap.id, ...docSnap.data() } };
      }
      return { success: true, progress: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update course progress
  updateCourseProgress: async (studentId, courseId, updates) => {
    try {
      const progressRef = doc(db, 'courseProgress', studentId);
      await updateDoc(progressRef, {
        [`courses.${courseId}`]: {
          ...updates,
          lastAccessedAt: new Date(),
        },
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Calculate course completion percentage
  calculateCompletionPercentage: async (studentId, courseId) => {
    try {
      // Get course details
      const courseSnap = await getDoc(doc(db, 'courses', courseId));
      if (!courseSnap.exists()) {
        return { success: false, error: 'Course not found' };
      }

      // Get tests for course
      const testsQuery = query(
        collection(db, 'tests'),
        where('courseId', '==', courseId)
      );
      const testsSnapshot = await getDocs(testsQuery);
      const totalTests = testsSnapshot.size;

      // Get materials for course
      const materialsQuery = query(
        collection(db, 'studyMaterials'),
        where('courseId', '==', courseId)
      );
      const materialsSnapshot = await getDocs(materialsQuery);
      const totalMaterials = materialsSnapshot.size;

      // Get student results
      const resultsSnapshot = await getDocs(
        collection(db, 'testResults', studentId, 'tests')
      );
      let completedTests = 0;
      resultsSnapshot.forEach(doc => {
        const testId = doc.id;
        if (testsSnapshot.docs.some(t => t.id === testId)) {
          completedTests++;
        }
      });

      // Get material access
      const accessSnap = await getDoc(doc(db, 'materialAccess', studentId));
      let accessedMaterials = 0;
      if (accessSnap.exists() && accessSnap.data().materials) {
        const materials = accessSnap.data().materials;
        materialsSnapshot.docs.forEach(mat => {
          if (materials[mat.id]) {
            accessedMaterials++;
          }
        });
      }

      // Calculate percentage
      const totalItems = totalTests + totalMaterials;
      const completedItems = completedTests + accessedMaterials;
      const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

      return {
        success: true,
        data: {
          completionPercentage: Math.round(percentage),
          completedTests,
          totalTests,
          accessedMaterials,
          totalMaterials,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get student statistics
  getStudentStatistics: async (studentId) => {
    try {
      const progressSnap = await getDoc(doc(db, 'courseProgress', studentId));

      if (!progressSnap.exists()) {
        return {
          success: true,
          statistics: {
            totalCoursesEnrolled: 0,
            totalTestsCompleted: 0,
            averageScore: 0,
            lastActivity: null,
          },
        };
      }

      const progressData = progressSnap.data();
      const courses = progressData.courses || {};

      // Calculate statistics
      let totalTestsCompleted = 0;
      let totalScore = 0;
      let testCount = 0;

      for (const courseId of Object.keys(courses)) {
        const courseProgress = courses[courseId];
        totalTestsCompleted += courseProgress.testsCompleted || 0;

        if (courseProgress.averageScore) {
          totalScore += courseProgress.averageScore;
          testCount++;
        }
      }

      const averageScore = testCount > 0 ? Math.round(totalScore / testCount) : 0;

      return {
        success: true,
        statistics: {
          totalCoursesEnrolled: Object.keys(courses).length,
          totalTestsCompleted,
          averageScore,
          lastActivity: progressData.updatedAt,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get admin dashboard analytics
  getAdminAnalytics: async (adminId) => {
    try {
      // Get courses created by admin
      const coursesQuery = query(
        collection(db, 'courses'),
        where('createdBy', '==', adminId)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const totalCourses = coursesSnapshot.size;
      let totalEnrolledStudents = 0;

      coursesSnapshot.forEach(doc => {
        totalEnrolledStudents += doc.data().enrolledStudents || 0;
      });

      // Get tests created by admin
      const testsQuery = query(
        collection(db, 'tests'),
        where('createdBy', '==', adminId)
      );
      const testsSnapshot = await getDocs(testsQuery);
      const totalTests = testsSnapshot.size;

      // Get materials uploaded by admin
      const materialsQuery = query(
        collection(db, 'studyMaterials'),
        where('uploadedBy', '==', adminId)
      );
      const materialsSnapshot = await getDocs(materialsQuery);
      const totalMaterials = materialsSnapshot.size;

      return {
        success: true,
        analytics: {
          totalCourses,
          totalEnrolledStudents,
          totalTests,
          totalMaterials,
          totalItems: totalCourses + totalTests + totalMaterials,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};