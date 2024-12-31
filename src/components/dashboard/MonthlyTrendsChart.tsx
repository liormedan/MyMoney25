import React from "react";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTransactionStore } from "@/lib/store";
import { Transaction } from "@/types/models";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const getMonthlyData = (transactions: Transaction[]) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(now.getMonth() - (5 - i));
    return d;
  });

  const monthlyData = months.map((month) => {
    const monthTransactions = transactions.filter(
      (t) =>
        new Date(t.date).getMonth() === month.getMonth() &&
        new Date(t.date).getFullYear() === month.getFullYear(),
    );

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { month, income, expenses };
  });

  return monthlyData;
};

const MonthlyTrendsChart = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const monthlyData = getMonthlyData(transactions);

  const data = {
    labels: monthlyData.map((d) =>
      d.month.toLocaleDateString("he-IL", { month: "short" }),
    ),
    datasets: [
      {
        label: "הכנסות",
        data: monthlyData.map((d) => d.income),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.4,
      },
      {
        label: "הוצאות",
        data: monthlyData.map((d) => d.expenses),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    direction: "rtl" as const,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        rtl: true,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "השוואת הכנסות והוצאות חודשיות",
        align: "start" as const,
        font: {
          size: 16,
        },
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
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="w-full h-[300px] p-4 bg-white">
      <div className="w-full h-full">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};

export default MonthlyTrendsChart;
