import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideNavigation from "../dashboard/SideNavigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-screen h-screen flex" dir="rtl">
      <SideNavigation onNavigate={navigate} selectedPath={location.pathname} />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
