import React, { useEffect } from "react";
import InfoCards from "./dashboard/InfoCards";
import MonthlyTrendsChart from "./dashboard/MonthlyTrendsChart";
import TransactionsTable from "./dashboard/TransactionsTable";
import { useAuthStore, useTransactionStore } from "@/lib/store";

function Home() {
  const user = useAuthStore((state) => state.user);
  const fetchTransactions = useTransactionStore(
    (state) => state.fetchTransactions,
  );
  const isLoading = useTransactionStore((state) => state.isLoading);

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        await fetchTransactions(user.id);
      }
    };
    loadData();
  }, [user?.id, fetchTransactions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>טוען נתונים...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InfoCards />
      <MonthlyTrendsChart />
      <TransactionsTable />
    </div>
  );
}

export default Home;
