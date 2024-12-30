import React from "react";
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

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

interface TransactionsTableProps {
  transactions?: Transaction[];
  onFilterChange?: (category: string) => void;
  onSearch?: (term: string) => void;
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
}

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    description: "משכורת חודשית",
    category: "הכנסה",
    amount: 12000,
    type: "income",
  },
  {
    id: "2",
    date: "2024-01-16",
    description: "קניות בסופר",
    category: "מזון",
    amount: 500,
    type: "expense",
  },
  {
    id: "3",
    date: "2024-01-17",
    description: "תשלום שכירות",
    category: "דיור",
    amount: 4000,
    type: "expense",
  },
];

const TransactionsTable = ({
  transactions = defaultTransactions,
  onFilterChange = () => {},
  onSearch = () => {},
  onDateRangeChange = () => {},
}: TransactionsTableProps) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
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
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <DatePickerWithRange onChange={onDateRangeChange} />
            <Select onValueChange={onFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="סינון לפי קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                <SelectItem value="income">הכנסות</SelectItem>
                <SelectItem value="food">מזון</SelectItem>
                <SelectItem value="housing">דיור</SelectItem>
                <SelectItem value="transportation">תחבורה</SelectItem>
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
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString("he-IL")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
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
