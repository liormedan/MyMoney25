// User Profile Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: TransactionCategory;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionCategory =
  | "salary"
  | "food"
  | "housing"
  | "transportation"
  | "entertainment"
  | "shopping"
  | "utilities"
  | "healthcare"
  | "education"
  | "other";

// Credit Card Types
export interface CreditCard {
  id: string;
  userId: string;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Budget Settings Types
export interface BudgetSettings {
  id: string;
  userId: string;
  monthlyBudget: number;
  categoryBudgets: CategoryBudget[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryBudget {
  category: TransactionCategory;
  amount: number;
}

// Notification Preferences Types
export interface NotificationPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationTypes: NotificationType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type NotificationType =
  | "overBudget"
  | "newTransaction"
  | "monthlyReport"
  | "paymentDue";

// Form Types
export interface TransactionFormData {
  type: "income" | "expense";
  amount: string;
  description: string;
  category: TransactionCategory;
  date: Date;
}

export interface CreditCardFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}
