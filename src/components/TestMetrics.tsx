
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, Activity } from "lucide-react";

export const TestMetrics = () => {
  const metrics = [
    {
      title: "Total Tests",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Activity,
      description: "Last 24 hours"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      description: "Current success rate"
    },
    {
      title: "Failed Tests",
      value: "72",
      change: "-15%",
      trend: "down",
      icon: XCircle,
      description: "Reduced failures"
    },
    {
      title: "Avg Response Time",
      value: "1.2s",
      change: "-0.3s",
      trend: "down",
      icon: Clock,
      description: "Performance improved"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        const trendColor = metric.trend === "up" ? "text-green-600" : "text-red-600";
        const bgColor = metric.trend === "up" ? "bg-green-50" : "bg-red-50";
        
        return (
          <Card key={index} className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className="bg-green-100 p-2 rounded-lg">
                <Icon className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={`${bgColor} ${trendColor} border-0`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {metric.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
