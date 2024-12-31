import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import type { UserProfile, Transaction } from "@/types/models";

// Profile Services
export const profileServices = {
  async get(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  },

  async create(profile: {
    id: string;
    email: string;
    name: string;
  }): Promise<UserProfile> {
    try {
      const docRef = doc(db, "profiles", profile.id);
      const newProfile = {
        ...profile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      await setDoc(docRef, newProfile);
      return { ...newProfile };
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  async update(
    userId: string,
    profile: Partial<UserProfile>,
  ): Promise<UserProfile> {
    try {
      const docRef = doc(db, "profiles", userId);
      const updatedProfile = {
        ...profile,
        updatedAt: Timestamp.now(),
      };
      await setDoc(docRef, updatedProfile, { merge: true });
      const docSnap = await getDoc(docRef);
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};

// Transaction Services
export const transactionServices = {
  async getAll(userId: string): Promise<Transaction[]> {
    try {
      const transactionsRef = collection(db, `profiles/${userId}/transactions`);
      const q = query(transactionsRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Transaction;
      });
    } catch (error) {
      console.error("Error getting transactions:", error);
      return [];
    }
  },

  async create(
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Transaction> {
    try {
      const { userId } = transaction;
      const transactionsRef = collection(db, `profiles/${userId}/transactions`);
      const docRef = await addDoc(transactionsRef, {
        ...transaction,
        date: Timestamp.fromDate(new Date(transaction.date)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const newDoc = await getDoc(docRef);
      const data = newDoc.data()!;

      return {
        id: docRef.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  async update(
    userId: string,
    transactionId: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    try {
      const docRef = doc(db, `profiles/${userId}/transactions`, transactionId);
      const updatedData = {
        ...transaction,
        date: transaction.date
          ? Timestamp.fromDate(new Date(transaction.date))
          : undefined,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updatedData);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data()!;
      return {
        id: docSnap.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Transaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  async delete(userId: string, transactionId: string): Promise<void> {
    try {
      await deleteDoc(
        doc(db, `profiles/${userId}/transactions`, transactionId),
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },
};
