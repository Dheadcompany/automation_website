import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, RefreshCw } from "lucide-react";
import { useTestResults } from "@/hooks/useTestResults";
import ExportButtons from "./ExportButtons";

interface TestResultsTableProps {
  filters: {
    operator: string;
    testType: string;
    status: string;
    dateRange: string;
  };
  selectedRow: any | null;
  setSelectedRow: (row: any | null) => void;
}

export const TestResultsTable = ({ filters, selectedRow, setSelectedRow }: TestResultsTableProps) => {
  const { testResults, isLoading, refetch } = useTestResults(filters);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const handleSendReport = async (
    report: any,
    format: string,
    email: string,
    channel: 'email' | 'slack'
  ) => {
    setSending(true);
    setSendStatus("");
    // Map snake_case fields to camelCase for backend compatibility
    const reportToSend = {
      ...report,
      testName: report.test_name || report.testName,
      clickId: report.click_id || report.clickId,
      airtimeBefore: report.airtime_before || report.airtimeBefore,
      airtimeAfter: report.airtime_after || report.airtimeAfter,
      videoRecording: report.video_url || report.videoRecording,
      timestamp: report.timestamp ? new Date(report.timestamp).toISOString() : new Date().toISOString(),
    };
    try {
      const response = await fetch("http://localhost:5000/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: reportToSend, format, email, channel }),
      });
      const data = await response.json();
      if (data.success) setSendStatus("Report sent!");
      else setSendStatus("Failed: " + data.error);
    } catch (err: any) {
      setSendStatus("Failed: " + err.message);
    }
    setSending(false);
  };

  const sortedResults = [...testResults].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  useEffect(() => {
    if (selectedRow && !testResults.find((row) => row.id === selectedRow.id)) {
      setSelectedRow(null);
    }
  }, [testResults, selectedRow, setSelectedRow]);

  const getStatusBadge = (status: string) => {
    switch (status.trim().toLowerCase()) {
      case "passed":
      case "pass":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800">
            Passed
          </Badge>
        );
      case "failed":
      case "fail":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800">
            Failed
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800">
            Warning
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getOperatorColor = (operator: string) => {
    if (!operator) return "bg-gray-100 text-gray-800 border-gray-200";
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
          <CardTitle className="text-lg font-semibold">
            Recent Test Results
          </CardTitle>
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
          <CardTitle className="text-lg font-semibold">
            Recent Test Results
          </CardTitle>
          <div className="flex gap-2 items-center">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="mt-2 sm:mt-0"
            >
              <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </Button>
            <ExportButtons selectedResult={selectedRow} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sendStatus && (
          <div className="mb-2 text-sm text-green-600">{sendStatus}</div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              {/* Add your table headers here, e.g.: */}
              <TableHead>Date/Time</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Test Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResults.map((row) => {
              // Use test_name for Test Type
              const testType = row.test_name || "";
              // Infer operator from test_name if not directly present
              let operator = row.operator;
              if (!operator && testType) {
                if (/mtn/i.test(testType)) operator = "MTN";
                else if (/airtel/i.test(testType)) operator = "AIRTEL";
                else if (/glo/i.test(testType)) operator = "GLO";
                else if (/9mobile/i.test(testType)) operator = "9MOBILE";
                else operator = "";
              }
              return (
                <TableRow
                  key={row.id}
                  className={selectedRow && selectedRow.id === row.id ? "bg-green-200 border-2 border-green-600" : "cursor-pointer hover:bg-gray-100"}
                  onClick={() => setSelectedRow(row)}
                  style={{ userSelect: "none" }}
                >
                  <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
                  <TableCell>
                    {operator ? (
                      <span className={`px-2 py-1 rounded ${getOperatorColor(operator)}`}>{operator}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{testType || <span className="text-gray-400">N/A</span>}</TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {row.video_url ? (
                        <a
                          href={row.video_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded text-white bg-blue-600 transition-colors duration-200 shadow hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-sm"
                          onClick={e => e.stopPropagation()}
                        >
                          Download video
                        </a>
                      ) : (
                        <span className="text-gray-400">No Video</span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-700 bg-white hover:bg-blue-600 hover:text-white hover:shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        disabled={sending}
                        onClick={e => {
                          e.stopPropagation();
                          handleSendReport(row, "pdf", "", "email"); // No email needed
                        }}
                      >
                        Send Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-700 bg-white hover:bg-blue-600 hover:text-white hover:shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        disabled={sending}
                        onClick={e => {
                          e.stopPropagation();
                          handleSendReport(row, "pdf", row.slack, "slack");
                        }}
                      >
                        Send Slack
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TestResultsTable;
