import React from "react";
import SideNavigation from "./dashboard/SideNavigation";
import InfoCards from "./dashboard/InfoCards";
import MonthlyTrendsChart from "./dashboard/MonthlyTrendsChart";
import TransactionsTable from "./dashboard/TransactionsTable";

function Home() {
  return (
    <div className="w-screen h-screen flex" dir="rtl">
      <SideNavigation />

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <div className="space-y-6 max-w-7xl mx-auto">
          <InfoCards />
          <MonthlyTrendsChart />
          <TransactionsTable />
        </div>
      </main>
    </div>
  );
}

export default Home;
