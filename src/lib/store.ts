import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import type { UserProfile, Transaction } from "@/types/models";
import { transactionServices, profileServices } from "./services";

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateTransaction: (
    userId: string,
    id: string,
    transaction: Partial<Transaction>,
  ) => Promise<void>;
  deleteTransaction: (userId: string, id: string) => Promise<void>;
}

// Auth Store
export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user) => set({ isAuthenticated: !!user, user }),
      logout: async () => {
        await signOut(auth);
        set({ isAuthenticated: false, user: null });
      },
      signInWithEmail: async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const profile = await profileServices.get(result.user.uid);
        set({ isAuthenticated: true, user: profile });
      },
      signInWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        let profile = await profileServices.get(result.user.uid);

        if (!profile) {
          profile = await profileServices.create({
            id: result.user.uid,
            email: result.user.email!,
            name: result.user.displayName || "",
          });
        }

        set({ isAuthenticated: true, user: profile });
      },
      signUpWithEmail: async (email, password, name) => {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await profileServices.create({
          id: result.user.uid,
          email,
          name,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

// Transaction Store
export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,
  fetchTransactions: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await transactionServices.getAll(userId);
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const newTransaction = await transactionServices.create(transaction);
      set((state) => ({
        transactions: [...state.transactions, newTransaction],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  updateTransaction: async (userId, id, transaction) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTransaction = await transactionServices.update(
        userId,
        id,
        transaction,
      );
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? updatedTransaction : t,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  deleteTransaction: async (userId, id) => {
    set({ isLoading: true, error: null });
    try {
      await transactionServices.delete(userId, id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
