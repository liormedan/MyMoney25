import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  Bell,
  Shield,
} from "lucide-react";
import SideNavigation from "../dashboard/SideNavigation";
import { AddCreditCardDialog } from "./AddCreditCardDialog";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const handleAddCard = (data: any) => {
    console.log("New card:", data);
    // Here you would handle adding the new card
  };

  return (
    <div className="w-screen h-screen flex" dir="rtl">
      <SideNavigation
        onNavigate={(path) => navigate(path)}
        selectedPath="/profile"
      />

      <AddCreditCardDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
        onSubmit={handleAddCard}
      />

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">העדפות</TabsTrigger>
              <TabsTrigger value="payment">אמצעי תשלום</TabsTrigger>
              <TabsTrigger value="personal">פרטים אישיים</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="p-6">
                <div className="flex flex-col items-center text-center space-y-6">
                  <User className="w-16 h-16 text-gray-400" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">פרטים אישיים</h2>
                    <p className="text-sm text-muted-foreground">
                      ערוך את הפרטים האישיים שלך
                    </p>
                  </div>
                  <div className="w-full max-w-sm space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">שם</Label>
                      <Input id="name" placeholder="הזן את שמך" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">אימייל</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="הזן את האימייל שלך"
                      />
                    </div>
                    <div className="flex justify-center mt-6">
                      <Button className="bg-[#1e1e1e] text-white hover:bg-[#1e1e1e]/90">
                        שמור שינויים
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">
                        כרטיסי אשראי שמורים
                      </h3>
                    </div>
                    <Button
                      onClick={() => setIsAddCardOpen(true)}
                      className="bg-[#1e1e1e] text-white hover:bg-[#1e1e1e]/90"
                    >
                      הוספת כרטיס
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium">ויזה ****1234</p>
                          <p className="text-sm text-muted-foreground">
                            תוקף: 12/25
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        הסר
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">התראות</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">
                          התראות במייל
                        </Label>
                        <Button variant="outline" size="sm">
                          ערוך
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notifications">התראות SMS</Label>
                        <Button variant="outline" size="sm">
                          ערוך
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">אבטחה</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">סיסמה</Label>
                        <Button variant="outline" size="sm">
                          שנה סיסמה
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="2fa">אימות דו-שלבי</Label>
                        <Button variant="outline" size="sm">
                          הפעל
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
