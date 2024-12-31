import * as z from "zod";
import { TransactionCategory } from "@/types/models";

// Transaction Form Validation Schema
export const transactionFormSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1, { message: "חובה להזין סכום" }),
  description: z.string().min(2, { message: "חובה להזין תיאור" }),
  category: z.enum(
    [
      "salary",
      "food",
      "housing",
      "transportation",
      "entertainment",
      "shopping",
      "utilities",
      "healthcare",
      "education",
      "other",
    ] as const,
    {
      required_error: "חובה לבחור קטגוריה",
    },
  ),
  date: z.date({
    required_error: "חובה לבחור תאריך",
  }),
});

// Credit Card Form Validation Schema
export const creditCardFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "מספר כרטיס חייב להכיל 16 ספרות" })
    .max(16)
    .regex(/^\d+$/, { message: "מספר כרטיס חייב להכיל ספרות בלבד" }),
  expiryMonth: z
    .string()
    .min(1)
    .max(2)
    .regex(/^(0?[1-9]|1[0-2])$/, { message: "חודש לא תקין" }),
  expiryYear: z.string().length(2).regex(/^\d+$/, { message: "שנה לא תקינה" }),
  cvv: z.string().length(3).regex(/^\d+$/, { message: "CVV לא תקין" }),
});

// Profile Form Validation Schema
export const profileFormSchema = z.object({
  name: z.string().min(2, { message: "חובה להזין שם" }),
  email: z.string().email({ message: "אימייל לא תקין" }),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,}$/, { message: "מספר טלפון לא תקין" })
    .optional(),
  address: z
    .string()
    .min(5, { message: "כתובת חייבת להכיל לפחות 5 תווים" })
    .optional(),
});

// Budget Settings Validation Schema
export const budgetSettingsSchema = z.object({
  monthlyBudget: z
    .number()
    .min(0, { message: "התקציב החודשי חייב להיות חיובי" }),
  categoryBudgets: z.array(
    z.object({
      category: z.enum([
        "salary",
        "food",
        "housing",
        "transportation",
        "entertainment",
        "shopping",
        "utilities",
        "healthcare",
        "education",
        "other",
      ] as const),
      amount: z.number().min(0, { message: "התקציב חייב להיות חיובי" }),
    }),
  ),
});

// Notification Preferences Validation Schema
export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  notificationTypes: z.array(
    z.enum(["overBudget", "newTransaction", "monthlyReport", "paymentDue"]),
  ),
});
