
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, RefreshCw } from "lucide-react";
import { useTestResults } from "@/hooks/useTestResults";

interface TestResultsTableProps {
  filters: {
    operator: string;
    testType: string;
    status: string;
    dateRange: string;
  };
}

export const TestResultsTable = ({ filters }: TestResultsTableProps) => {
  const { testResults, isLoading, refetch } = useTestResults(filters);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No test results found. Run some tests to see data here.</p>
          </div>
        ) : (
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
                {testResults.map((result) => (
                  <TableRow key={result.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {formatTimestamp(result.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getOperatorColor(result.operator)}>
                        {result.operator}
                      </Badge>
                    </TableCell>
                    <TableCell>{result.test_type}</TableCell>
                    <TableCell>{result.service}</TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell>
                      <span className={result.response_time > 2000 ? "text-red-600" : "text-green-600"}>
                        {result.response_time}ms
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {result.request_id}
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
        )}
      </CardContent>
    </Card>
  );
};
