import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, FileSpreadsheet, FileCsv, FileJson } from "lucide-react";
import TransactionsTable from "../dashboard/TransactionsTable";
import SideNavigation from "../dashboard/SideNavigation";

const TransactionsPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    // Here you would handle the file upload
    console.log("Files to process:", files);
  };

  return (
    <div className="w-screen h-screen flex" dir="rtl">
      <SideNavigation
        onNavigate={(path) => navigate(path)}
        selectedPath="/transactions"
      />

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">תנועות</h1>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">טבלת תנועות</TabsTrigger>
              <TabsTrigger value="import">ייבוא תנועות</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <Card className="p-6">
                <TransactionsTable />
              </Card>
            </TabsContent>

            <TabsContent value="import">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                    <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
                      <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-medium">קובץ Excel</h3>
                      <p className="text-sm text-gray-500">.xlsx, .xls</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
                      <FileCsv className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-medium">קובץ CSV</h3>
                      <p className="text-sm text-gray-500">.csv</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
                      <FileJson className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                      <h3 className="font-medium">קובץ JSON</h3>
                      <p className="text-sm text-gray-500">.json</p>
                    </div>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <FileUp className="w-8 h-8 mx-auto mb-4 text-gray-400" />
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
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TransactionsPage;
