import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useTransactionStore, useAuthStore } from "@/lib/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const ReportsPage = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const fetchTransactions = useTransactionStore(
    (state) => state.fetchTransactions,
  );
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchTransactions(user.id);
    }
  }, [user, fetchTransactions]);

  const calculateCategoryData = () => {
    const categoryTotals = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

    const categories = Object.keys(categoryTotals);
    return {
      labels: categories.map((cat) => {
        switch (cat) {
          case "food":
            return "מזון";
          case "housing":
            return "דיור";
          case "transportation":
            return "תחבורה";
          case "entertainment":
            return "בילויים";
          case "shopping":
            return "קניות";
          case "utilities":
            return "חשבונות";
          case "healthcare":
            return "בריאות";
          case "education":
            return "חינוך";
          default:
            return "אחר";
        }
      }),
      data: categories.map((cat) => categoryTotals[cat]),
    };
  };

  const calculateMonthlyData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();

    const monthlyTotals = last6Months.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return (
          transDate.getMonth() === month.getMonth() &&
          transDate.getFullYear() === month.getFullYear()
        );
      });

      return {
        month,
        income: monthTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0),
        expenses: monthTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0),
      };
    });

    return monthlyTotals;
  };

  const categoryData = calculateCategoryData();
  const monthlyData = calculateMonthlyData();

  const doughnutData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: monthlyData.map((d) =>
      d.month.toLocaleDateString("he-IL", { month: "short" }),
    ),
    datasets: [
      {
        label: "הכנסות",
        data: monthlyData.map((d) => d.income),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "הוצאות",
        data: monthlyData.map((d) => d.expenses),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        rtl: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        position: "right" as const,
        ticks: {
          callback: (value: number) => `₪${value.toLocaleString()}`,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left" as const,
        rtl: true,
      },
    },
  };

  const currentMonthData = monthlyData[monthlyData.length - 1];
  const previousMonthData = monthlyData[monthlyData.length - 2];

  const calculatePercentageChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">דוחות</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            ייצוא לאקסל
          </Button>
          <DatePickerWithRange />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">
            התפלגות הוצאות לפי קטגוריה
          </h2>
          <div className="h-[300px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">סיכום חודשי</h2>
          <div className="h-[300px]">
            <Bar data={barData} options={options} />
          </div>
        </Card>

        <Card className="p-6 bg-white md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">נתונים מסכמים</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h3 className="text-lg font-medium text-green-700 mb-2">
                סה"כ הכנסות
              </h3>
              <p className="text-2xl font-bold text-green-800">
                ₪{currentMonthData?.income.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {calculatePercentageChange(
                  currentMonthData?.income || 0,
                  previousMonthData?.income || 0,
                ).toFixed(1)}
                % מהחודש הקודם
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h3 className="text-lg font-medium text-red-700 mb-2">
                סה"כ הוצאות
              </h3>
              <p className="text-2xl font-bold text-red-800">
                ₪{currentMonthData?.expenses.toLocaleString()}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {calculatePercentageChange(
                  currentMonthData?.expenses || 0,
                  previousMonthData?.expenses || 0,
                ).toFixed(1)}
                % מהחודש הקודם
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-medium text-blue-700 mb-2">יתרה</h3>
              <p className="text-2xl font-bold text-blue-800">
                ₪
                {(
                  (currentMonthData?.income || 0) -
                  (currentMonthData?.expenses || 0)
                ).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {calculatePercentageChange(
                  (currentMonthData?.income || 0) -
                    (currentMonthData?.expenses || 0),
                  (previousMonthData?.income || 0) -
                    (previousMonthData?.expenses || 0),
                ).toFixed(1)}
                % מהחודש הקודם
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
