// Material Service
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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';

export const materialService = {
  // Create study material (Admin only)
  createMaterial: async (materialData, adminId, file) => {
    try {
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `materials/${materialData.courseId}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      // Create Firestore document
      const docRef = await addDoc(collection(db, 'studyMaterials'), {
        ...materialData,
        fileUrl: downloadURL,
        filePath: fileRef.fullPath,
        uploadedBy: adminId,
        fileSize: file.size,
        fileName: file.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        downloadCount: 0,
      });

      return { success: true, materialId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all materials
  getAllMaterials: async () => {
    try {
      const q = query(collection(db, 'studyMaterials'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, materials };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get materials by course
  getMaterialsByCourse: async (courseId) => {
    try {
      const q = query(
        collection(db, 'studyMaterials'),
        where('courseId', '==', courseId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, materials };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get material by ID
  getMaterialById: async (materialId) => {
    try {
      const docSnap = await getDoc(doc(db, 'studyMaterials', materialId));
      if (docSnap.exists()) {
        return { success: true, material: { id: docSnap.id, ...docSnap.data() } };
      }
      return { success: false, error: 'Material not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Track material access
  trackMaterialAccess: async (studentId, materialId) => {
    try {
      const accessRef = doc(db, 'materialAccess', studentId);
      try {
        await updateDoc(accessRef, {
          [`materials.${materialId}`]: {
            materialId,
            accessedAt: new Date(),
            status: 'read',
          },
        });
      } catch (err) {
        // Create document if it doesn't exist
        await setDoc(accessRef, {
          userId: studentId,
          materials: {
            [materialId]: {
              materialId,
              accessedAt: new Date(),
              status: 'read',
            },
          },
        });
      }

      // Increment download count
      await updateDoc(doc(db, 'studyMaterials', materialId), {
        downloadCount: increment(1),
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update material
  updateMaterial: async (materialId, updates) => {
    try {
      await updateDoc(doc(db, 'studyMaterials', materialId), {
        ...updates,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete material
  deleteMaterial: async (materialId) => {
    try {
      const docSnap = await getDoc(doc(db, 'studyMaterials', materialId));
      if (docSnap.exists() && docSnap.data().filePath) {
        // Delete file from storage
        await deleteObject(ref(storage, docSnap.data().filePath));
      }

      // Delete Firestore document
      await deleteDoc(doc(db, 'studyMaterials', materialId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get materials by admin
  getMaterialsByAdmin: async (adminId) => {
    try {
      const q = query(
        collection(db, 'studyMaterials'),
        where('uploadedBy', '==', adminId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, materials };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};