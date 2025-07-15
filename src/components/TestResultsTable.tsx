
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, RefreshCw } from "lucide-react";

interface TestResult {
  id: string;
  timestamp: string;
  operator: string;
  testType: string;
  service: string;
  status: "passed" | "failed" | "warning";
  responseTime: number;
  errorMessage?: string;
  requestId: string;
}

interface TestResultsTableProps {
  filters: {
    operator: string;
    testType: string;
    status: string;
    dateRange: string;
  };
}

export const TestResultsTable = ({ filters }: TestResultsTableProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in real implementation, this would come from your API
  const mockResults: TestResult[] = [
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      operator: "MTN",
      testType: "SMS",
      service: "Premium SMS",
      status: "passed",
      responseTime: 1200,
      requestId: "REQ001"
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:29:18",
      operator: "Airtel",
      testType: "USSD",
      service: "Balance Check",
      status: "failed",
      responseTime: 3500,
      errorMessage: "Connection timeout",
      requestId: "REQ002"
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:28:45",
      operator: "Glo",
      testType: "WAP",
      service: "Content Download",
      status: "warning",
      responseTime: 2100,
      requestId: "REQ003"
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:27:12",
      operator: "9mobile",
      testType: "IVR",
      service: "Voice Service",
      status: "passed",
      responseTime: 900,
      requestId: "REQ004"
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:26:33",
      operator: "MTN",
      testType: "MMS",
      service: "Multimedia Message",
      status: "passed",
      responseTime: 1800,
      requestId: "REQ005"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Passed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getOperatorColor = (operator: string) => {
    switch (operator.toLowerCase()) {
      case "mtn":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "airtel":
        return "bg-red-100 text-red-800 border-red-200";
      case "glo":
        return "bg-green-100 text-green-800 border-green-200";
      case "9mobile":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="text-lg font-semibold">Recent Test Results</CardTitle>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="mt-2 sm:mt-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockResults.map((result) => (
                <TableRow key={result.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {result.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge className={getOperatorColor(result.operator)}>
                      {result.operator}
                    </Badge>
                  </TableCell>
                  <TableCell>{result.testType}</TableCell>
                  <TableCell>{result.service}</TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                  <TableCell>
                    <span className={result.responseTime > 2000 ? "text-red-600" : "text-green-600"}>
                      {result.responseTime}ms
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {result.requestId}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
