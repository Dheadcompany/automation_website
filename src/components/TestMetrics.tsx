
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, XCircle } from "lucide-react";
import { useTestMetrics } from "@/hooks/useTestMetrics";
import { useState, useEffect } from "react";

export const TestMetrics = () => {
  const { metrics, isLoading } = useTestMetrics();

  const metricsData = [
    {
      title: "Total Tests",
      value: metrics.totalTests,
      icon: Activity,
      color: "blue"
    },
    {
      title: "Passed Tests",
      value: metrics.passedTests,
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Failed Tests",
      value: metrics.failedTests,
      icon: XCircle,
      color: "red"
    }
  ];

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  useEffect(() => {
    if (!isLoading) setHasLoadedOnce(true);
  }, [isLoading]);

  const getColorClasses = (color: string) => {
    const classes = {
      blue: {
        border: 'border-l-blue-500',
        bg: 'bg-blue-100',
        text: 'text-blue-600'
      },
      green: {
        border: 'border-l-green-500',
        bg: 'bg-green-100',
        text: 'text-green-600'
      },
      red: {
        border: 'border-l-red-500',
        bg: 'bg-red-100',
        text: 'text-red-600'
      }
    };
    return classes[color as keyof typeof classes];
  };

  if (isLoading && !hasLoadedOnce) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="border-l-4 border-l-gray-300 animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metricsData.map((metric, idx) => {
        const Icon = metric.icon;
        const colors = getColorClasses(metric.color);
        return (
          <Card 
            key={idx} 
            className={`border-l-4 ${colors.border} transition-all duration-200 hover:shadow-lg`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`${colors.bg} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${colors.text}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              {isLoading && (
                <div className="text-xs text-gray-500">Updating...</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
