import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { ArrowUpIcon, ArrowDownIcon, SearchIcon, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { useTransactionStore } from "@/lib/store";
import { Transaction, TransactionCategory } from "@/types/models";

interface TransactionsTableProps {
  onFilterChange?: (category: TransactionCategory | "all") => void;
  onSearch?: (term: string) => void;
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
}

const CATEGORIES: { value: TransactionCategory | "all"; label: string }[] = [
  { value: "all", label: "הכל" },
  { value: "salary", label: "משכורת" },
  { value: "food", label: "מזון" },
  { value: "housing", label: "דיור" },
  { value: "transportation", label: "תחבורה" },
  { value: "entertainment", label: "בילויים" },
  { value: "shopping", label: "קניות" },
  { value: "utilities", label: "חשבונות" },
  { value: "healthcare", label: "בריאות" },
  { value: "education", label: "חינוך" },
  { value: "other", label: "אחר" },
];

const TransactionsTable = ({
  onFilterChange = () => {},
  onSearch = () => {},
  onDateRangeChange = () => {},
}: TransactionsTableProps) => {
  const transactions = useTransactionStore((state) => state.transactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(transactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    TransactionCategory | "all"
  >("all");

  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedCategory]);

  const exportToExcel = () => {
    const data = filteredTransactions.map((t) => ({
      תאריך: new Date(t.date).toLocaleDateString("he-IL"),
      תיאור: t.description,
      קטגוריה: CATEGORIES.find((c) => c.value === t.category)?.label,
      סכום: t.amount,
      סוג: t.type === "income" ? "הכנסה" : "הוצאה",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  return (
    <Card className="p-6 bg-white w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">תנועות אחרונות</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={exportToExcel}
            >
              <FileDown className="h-4 w-4" />
              ייצוא לאקסל
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[200px] max-w-xs">
            <div className="relative">
              <SearchIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש תנועות"
                className="pl-4 pr-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  onSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <DatePickerWithRange onChange={onDateRangeChange} />
            <Select
              value={selectedCategory}
              onValueChange={(value: TransactionCategory | "all") => {
                setSelectedCategory(value);
                onFilterChange(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="סינון לפי קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">תיאור</TableHead>
                <TableHead className="text-right">קטגוריה</TableHead>
                <TableHead className="text-right">סכום</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString("he-IL")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {
                      CATEGORIES.find((c) => c.value === transaction.category)
                        ?.label
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === "income" ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                      )}
                      ₪{transaction.amount.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default TransactionsTable;
