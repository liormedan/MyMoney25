import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  ListOrdered,
  Settings,
  PlusCircle,
  LogOut,
  FileCheck,
} from "lucide-react";
import { NewTransactionDialog } from "./NewTransactionDialog";

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface SideNavigationProps {
  items?: NavigationItem[];
  onNavigate?: (href: string) => void;
  selectedPath?: string;
}

const defaultItems: NavigationItem[] = [
  {
    icon: <LayoutDashboard className="ml-2" />,
    label: "סקירה כללית",
    href: "/dashboard",
  },
  {
    icon: <FileText className="ml-2" />,
    label: "דוחות",
    href: "/reports",
  },
  {
    icon: <ListOrdered className="ml-2" />,
    label: "תנועות",
    href: "/transactions",
  },
  {
    icon: <FileCheck className="ml-2" />,
    label: "התחייבויות",
    href: "/obligations",
  },
  {
    icon: <Settings className="ml-2" />,
    label: "הגדרות",
    href: "/settings",
  },
];

const SideNavigation: React.FC<SideNavigationProps> = ({
  items = defaultItems,
  onNavigate = () => {},
  selectedPath = "/dashboard",
}) => {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

  const handleNewTransaction = (data: any) => {
    console.log("New transaction:", data);
    // Here you would typically handle the new transaction data
  };

  return (
    <div className="h-full w-[280px] bg-background border-l">
      <div className="flex flex-col h-full">
        <NewTransactionDialog
          open={isNewTransactionOpen}
          onOpenChange={setIsNewTransactionOpen}
          onSubmit={handleNewTransaction}
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-right mb-6">ניהול תקציב</h2>
          <Button
            className="w-full justify-end gap-2 mb-6"
            onClick={() => setIsNewTransactionOpen(true)}
          >
            <span>הוספת תנועה חדשה</span>
            <PlusCircle className="ml-2" />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-4">
            {items.map((item) => (
              <Button
                key={item.href}
                variant={selectedPath === item.href ? "secondary" : "ghost"}
                className="w-full justify-end gap-2 h-12"
                onClick={() => onNavigate(item.href)}
              >
                <span>{item.label}</span>
                {item.icon}
              </Button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-6 border-t">
          <Button
            variant="ghost"
            className="w-full justify-end gap-2"
            onClick={() => onNavigate("/logout")}
          >
            <span>התנתק</span>
            <LogOut className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
