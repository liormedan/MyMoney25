import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ScaleIcon,
  WalletIcon,
} from "lucide-react";
import { useTransactionStore } from "@/lib/store";
import { Transaction } from "@/types/models";

interface InfoCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const InfoCard = ({
  title = "כותרת",
  value = "₪0",
  icon = <WalletIcon className="h-4 w-4" />,
  trend = { value: "0%", isPositive: true },
}: InfoCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-right">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-right">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground text-right flex items-center justify-end gap-1">
            {trend.isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const calculateTrends = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = now.getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthTransactions = transactions.filter(
    (t) =>
      new Date(t.date).getMonth() === currentMonth &&
      new Date(t.date).getFullYear() === currentYear,
  );

  const lastMonthTransactions = transactions.filter(
    (t) =>
      new Date(t.date).getMonth() === lastMonth &&
      new Date(t.date).getFullYear() === lastMonthYear,
  );

  const currentIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const lastIncome = lastMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const lastExpenses = lastMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeTrend = lastIncome
    ? ((currentIncome - lastIncome) / lastIncome) * 100
    : 0;
  const expensesTrend = lastExpenses
    ? ((currentExpenses - lastExpenses) / lastExpenses) * 100
    : 0;
  const balanceTrend =
    lastIncome - lastExpenses
      ? ((currentIncome - currentExpenses - (lastIncome - lastExpenses)) /
          Math.abs(lastIncome - lastExpenses)) *
        100
      : 0;

  return {
    currentIncome,
    currentExpenses,
    currentBalance: currentIncome - currentExpenses,
    incomeTrend,
    expensesTrend,
    balanceTrend,
  };
};

const InfoCards = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const {
    currentIncome,
    currentExpenses,
    currentBalance,
    incomeTrend,
    expensesTrend,
    balanceTrend,
  } = calculateTrends(transactions);

  const cards = [
    {
      title: "סך הכנסות",
      value: `₪${currentIncome.toLocaleString()}`,
      icon: <ArrowUpIcon className="h-4 w-4 text-green-500" />,
      trend: {
        value: `${Math.abs(incomeTrend).toFixed(1)}%`,
        isPositive: incomeTrend >= 0,
      },
    },
    {
      title: "סך הוצאות",
      value: `₪${currentExpenses.toLocaleString()}`,
      icon: <ArrowDownIcon className="h-4 w-4 text-red-500" />,
      trend: {
        value: `${Math.abs(expensesTrend).toFixed(1)}%`,
        isPositive: expensesTrend <= 0,
      },
    },
    {
      title: "יתרה נוכחית",
      value: `₪${currentBalance.toLocaleString()}`,
      icon: <WalletIcon className="h-4 w-4" />,
      trend: {
        value: `${Math.abs(balanceTrend).toFixed(1)}%`,
        isPositive: balanceTrend >= 0,
      },
    },
    {
      title: "השוואה לתקציב",
      value: "85%",
      icon: <ScaleIcon className="h-4 w-4" />,
      trend: { value: "2%", isPositive: true },
    },
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default InfoCards;
