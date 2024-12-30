import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import SideNavigation from "../dashboard/SideNavigation";

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex" dir="rtl">
      <SideNavigation
        onNavigate={(path) => navigate(path)}
        selectedPath="/settings"
      />

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">הגדרות</h1>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">פרופיל</TabsTrigger>
              <TabsTrigger value="budget">תקציב</TabsTrigger>
              <TabsTrigger value="notifications">התראות</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center">
                    <User className="w-12 h-12 mb-2" />
                    <h3 className="font-medium text-lg">פרטים אישיים</h3>
                    <p className="text-sm text-muted-foreground">
                      עדכן את הפרטים האישיים שלך
                    </p>
                  </div>
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="grid gap-2">
                      <Label htmlFor="name">שם</Label>
                      <Input id="name" placeholder="הזן את שמך" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">אימייל</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="הזן את האימייל שלך"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline">ביטול</Button>
                    <Button>שמור שינויים</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="budget">
              <Card className="p-6">
                <div className="text-center">
                  <p>הגדרות תקציב</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="p-6">
                <div className="text-center">
                  <p>הגדרות התראות</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
