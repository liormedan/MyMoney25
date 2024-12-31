import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  ListOrdered,
  Settings,
  PlusCircle,
  User,
  LogOut,
  FileCheck,
} from "lucide-react";
import { NewTransactionDialog } from "./NewTransactionDialog";
import { useAuthStore, useTransactionStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  {
    icon: <User className="ml-2" />,
    label: "אזור אישי",
    href: "/profile",
  },
];

const SideNavigation: React.FC<SideNavigationProps> = ({
  items = defaultItems,
  onNavigate = () => {},
  selectedPath = "/dashboard",
}) => {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const handleNewTransaction = async (data: any) => {
    if (!user) return;

    try {
      await addTransaction({
        ...data,
        date: new Date(data.date),
        userId: user.id,
        amount: parseFloat(data.amount),
      });
      setIsNewTransactionOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-full w-[280px] bg-background border-l flex flex-col">
      <div className="flex-1">
        <NewTransactionDialog
          open={isNewTransactionOpen}
          onOpenChange={setIsNewTransactionOpen}
          onSubmit={handleNewTransaction}
        />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">ניהול תקציב</h2>
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
      </div>

      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 h-12">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {getInitials(user?.name || "משתמש")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem onClick={() => onNavigate("/profile")}>
              פרופיל
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate("/settings")}>
              הגדרות
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>התנתק</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SideNavigation;
