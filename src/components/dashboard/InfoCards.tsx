import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ScaleIcon,
  WalletIcon,
} from "lucide-react";

interface InfoCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const InfoCard = ({
  title = "כותרת",
  value = "₪0",
  icon = <WalletIcon className="h-4 w-4" />,
  trend = { value: "0%", isPositive: true },
}: InfoCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-right">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-right">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground text-right flex items-center justify-end gap-1">
            {trend.isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface InfoCardsProps {
  cards?: {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: {
      value: string;
      isPositive: boolean;
    };
  }[];
}

const InfoCards = ({ cards }: InfoCardsProps) => {
  const defaultCards = [
    {
      title: "סך הכנסות",
      value: "₪15,000",
      icon: <ArrowUpIcon className="h-4 w-4 text-green-500" />,
      trend: { value: "12%", isPositive: true },
    },
    {
      title: "סך הוצאות",
      value: "₪8,500",
      icon: <ArrowDownIcon className="h-4 w-4 text-red-500" />,
      trend: { value: "8%", isPositive: false },
    },
    {
      title: "יתרה נוכחית",
      value: "₪6,500",
      icon: <WalletIcon className="h-4 w-4" />,
      trend: { value: "4%", isPositive: true },
    },
    {
      title: "השוואה לתקציב",
      value: "85%",
      icon: <ScaleIcon className="h-4 w-4" />,
      trend: { value: "2%", isPositive: true },
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayCards.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default InfoCards;
