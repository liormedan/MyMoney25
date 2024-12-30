import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, FileCheck, Upload, Plus } from "lucide-react";
import SideNavigation from "../dashboard/SideNavigation";
import { AddCheckDialog } from "./AddCheckDialog";
import { AddChargeDialog } from "./AddChargeDialog";
import { cn } from "@/lib/utils";

interface Check {
  id: string;
  number: string;
  amount: number;
  dueDate: string;
  recipient: string;
}

interface CreditCharge {
  id: string;
  description: string;
  amount: number;
  date: string;
  payments: number;
  remainingPayments: number;
}

const defaultChecks: Check[] = [
  {
    id: "1",
    number: "1234",
    amount: 2500,
    dueDate: "2024-02-15",
    recipient: "שכירות",
  },
  {
    id: "2",
    number: "1235",
    amount: 1800,
    dueDate: "2024-03-01",
    recipient: "ביטוח",
  },
];

const defaultCreditCharges: CreditCharge[] = [
  {
    id: "1",
    description: "מכשיר חשמלי",
    amount: 3000,
    date: "2024-01-15",
    payments: 6,
    remainingPayments: 4,
  },
  {
    id: "2",
    description: "ריהוט",
    amount: 5000,
    date: "2024-01-20",
    payments: 12,
    remainingPayments: 10,
  },
];

const ObligationsPage = () => {
  const navigate = useNavigate();
  const [isAddCheckOpen, setIsAddCheckOpen] = useState(false);
  const [isAddChargeOpen, setIsAddChargeOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [checks, setChecks] = useState<Check[]>(defaultChecks);
  const [creditCharges, setCreditCharges] =
    useState<CreditCharge[]>(defaultCreditCharges);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    // Here you would handle the file upload
    console.log("Files to process:", files);
  };

  const handleAddCheck = (data: any) => {
    const newCheck: Check = {
      id: (checks.length + 1).toString(),
      number: data.number,
      amount: parseFloat(data.amount),
      dueDate: data.dueDate.toISOString().split("T")[0],
      recipient: data.recipient,
    };
    setChecks([...checks, newCheck]);
  };

  const handleAddCharge = (data: any) => {
    const newCharge: CreditCharge = {
      id: (creditCharges.length + 1).toString(),
      description: data.description,
      amount: parseFloat(data.amount),
      date: data.date.toISOString().split("T")[0],
      payments: parseInt(data.payments),
      remainingPayments: parseInt(data.payments),
    };
    setCreditCharges([...creditCharges, newCharge]);
  };

  const totalFuturePayments = creditCharges.reduce((acc, charge) => {
    return acc + (charge.amount * charge.remainingPayments) / charge.payments;
  }, 0);

  const totalRemainingPayments = creditCharges.reduce((acc, charge) => {
    return acc + charge.remainingPayments;
  }, 0);

  return (
    <div className="w-screen h-screen flex" dir="rtl">
      <SideNavigation
        onNavigate={(path) => navigate(path)}
        selectedPath="/obligations"
      />

      <AddCheckDialog
        open={isAddCheckOpen}
        onOpenChange={setIsAddCheckOpen}
        onSubmit={handleAddCheck}
      />

      <AddChargeDialog
        open={isAddChargeOpen}
        onOpenChange={setIsAddChargeOpen}
        onSubmit={handleAddCharge}
      />

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">התחייבויות</h1>
          </div>

          <Tabs defaultValue="checks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="checks">צ'קים</TabsTrigger>
              <TabsTrigger value="credit">כרטיסי אשראי</TabsTrigger>
            </TabsList>

            <TabsContent value="checks">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      <h2 className="text-xl font-semibold">צ'קים דחויים</h2>
                    </div>
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => setIsAddCheckOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      הוספת צ'ק
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">מספר צ'ק</TableHead>
                          <TableHead className="text-right">סכום</TableHead>
                          <TableHead className="text-right">
                            תאריך פירעון
                          </TableHead>
                          <TableHead className="text-right">למוטב</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {checks.map((check) => (
                          <TableRow key={check.id}>
                            <TableCell>{check.number}</TableCell>
                            <TableCell>
                              ₪{check.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(check.dueDate).toLocaleDateString(
                                "he-IL",
                              )}
                            </TableCell>
                            <TableCell>{check.recipient}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-gray-300",
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                    <Label htmlFor="file-upload" className="block mb-2">
                      גרור קובץ לכאן או
                      <Button
                        variant="link"
                        className="px-1"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        לחץ לבחירה
                      </Button>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls,.csv,.json"
                      onChange={(e) =>
                        e.target.files && handleFiles(e.target.files)
                      }
                    />
                    <p className="text-sm text-gray-500">
                      תומך בקבצי Excel, CSV ו-JSON
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="credit">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <h2 className="text-xl font-semibold">חיובים בתשלומים</h2>
                    </div>
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => setIsAddChargeOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      הוספת חיוב
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">תיאור</TableHead>
                          <TableHead className="text-right">
                            סכום כולל
                          </TableHead>
                          <TableHead className="text-right">
                            תאריך חיוב
                          </TableHead>
                          <TableHead className="text-right">תשלומים</TableHead>
                          <TableHead className="text-right">נותרו</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {creditCharges.map((charge) => (
                          <TableRow key={charge.id}>
                            <TableCell>{charge.description}</TableCell>
                            <TableCell>
                              ₪{charge.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(charge.date).toLocaleDateString(
                                "he-IL",
                              )}
                            </TableCell>
                            <TableCell>{charge.payments}</TableCell>
                            <TableCell>{charge.remainingPayments}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-blue-900">
                          סך חיובים עתידיים
                        </h3>
                        <p className="text-sm text-blue-700 mt-1">
                          סה"כ התחייבויות בכרטיסי אשראי
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-900">
                          ₪{totalFuturePayments.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700">
                          ב-{totalRemainingPayments} תשלומים
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ObligationsPage;
