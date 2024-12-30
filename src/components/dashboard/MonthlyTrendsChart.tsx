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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface MonthlyTrendsChartProps {
  data?: {
    months: string[];
    income: number[];
    expenses: number[];
  };
}

const defaultData = {
  months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני"],
  income: [4500, 5200, 4800, 5100, 5400, 5800],
  expenses: [3800, 4100, 3900, 4300, 4200, 4600],
};

const MonthlyTrendsChart = ({
  data = defaultData,
}: MonthlyTrendsChartProps) => {
  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: "הכנסות",
        data: data.income,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.4,
      },
      {
        label: "הוצאות",
        data: data.expenses,
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
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default MonthlyTrendsChart;
