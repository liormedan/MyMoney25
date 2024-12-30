import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import SideNavigation from "../dashboard/SideNavigation";
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
  const navigate = useNavigate();

  const categoryData = {
    labels: ["מזון", "דיור", "תחבורה", "בילויים", "קניות", "אחר"],
    datasets: [
      {
        data: [3000, 4500, 1200, 2000, 1800, 1000],
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

  const monthlyData = {
    labels: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני"],
    datasets: [
      {
        label: "הכנסות",
        data: [12000, 13000, 12500, 13500, 14000, 13800],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "הוצאות",
        data: [10000, 11000, 9500, 10500, 11000, 10800],
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

  return (
    <div className="w-screen h-screen flex" dir="rtl">
      <SideNavigation
        onNavigate={(path) => navigate(path)}
        selectedPath="/reports"
      />

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
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
                <Doughnut data={categoryData} options={doughnutOptions} />
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4">סיכום חודשי</h2>
              <div className="h-[300px]">
                <Bar data={monthlyData} options={options} />
              </div>
            </Card>

            <Card className="p-6 bg-white md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">נתונים מסכמים</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <h3 className="text-lg font-medium text-green-700 mb-2">
                    סה"כ הכנסות
                  </h3>
                  <p className="text-2xl font-bold text-green-800">₪79,800</p>
                  <p className="text-sm text-green-600 mt-1">
                    +12% מהחודש הקודם
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <h3 className="text-lg font-medium text-red-700 mb-2">
                    סה"כ הוצאות
                  </h3>
                  <p className="text-2xl font-bold text-red-800">₪62,800</p>
                  <p className="text-sm text-red-600 mt-1">+8% מהחודש הקודם</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">
                    יתרה
                  </h3>
                  <p className="text-2xl font-bold text-blue-800">₪17,000</p>
                  <p className="text-sm text-blue-600 mt-1">
                    +25% מהחודש הקודם
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
