
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ExportButtons = () => {
  const { toast } = useToast();

  const exportToPDF = () => {
    // Mock PDF export - in real implementation, you'd generate actual PDF
    toast({
      title: "PDF Export Started",
      description: "Your test report is being generated...",
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Your VAS testing report has been downloaded.",
      });
    }, 2000);
  };

  const exportToCSV = () => {
    // Mock CSV export - in real implementation, you'd generate actual CSV
    const csvContent = `Timestamp,Operator,Test Type,Service,Status,Response Time,Request ID
2024-01-15 14:30:25,MTN,SMS,Premium SMS,passed,1200,REQ001
2024-01-15 14:29:18,Airtel,USSD,Balance Check,failed,3500,REQ002
2024-01-15 14:28:45,Glo,WAP,Content Download,warning,2100,REQ003
2024-01-15 14:27:12,9mobile,IVR,Voice Service,passed,900,REQ004
2024-01-15 14:26:33,MTN,MMS,Multimedia Message,passed,1800,REQ005`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vas_test_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "CSV Downloaded",
      description: "Your test data has been exported to CSV.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV}>
          <Table className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
