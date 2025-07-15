
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestResultsTable } from "@/components/TestResultsTable";
import { TestMetrics } from "@/components/TestMetrics";
import { ExportButtons } from "@/components/ExportButtons";
import { FilterPanel } from "@/components/FilterPanel";
import { AuthDialog } from "@/components/AuthDialog";
import { Shield, Signal, Database, Download, Filter, BarChart3 } from "lucide-react";

const Index = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [filters, setFilters] = useState({
    operator: "",
    testType: "",
    status: "",
    dateRange: ""
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Signal className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VAS Testing Portal</h1>
                <p className="text-sm text-gray-600">Nigerian Telecom Value Added Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Live Testing
              </Badge>
              <Button onClick={() => setIsAuthOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Shield className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional VAS Testing & Reporting
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive testing platform for Nigerian telecom operators. 
            Monitor, analyze, and report on Value Added Services with real-time insights.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Real-time Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Live test results from automated Python scripts</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Comprehensive reporting and data visualization</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Filter className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Filter by operator, test type, status, and date</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Export Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">PDF and CSV export for professional reporting</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Test Results Dashboard</h3>
              <p className="text-gray-600">Monitor your VAS testing results in real-time</p>
            </div>
            <ExportButtons />
          </div>

          {/* Metrics */}
          <TestMetrics />

          {/* Filters */}
          <div className="mb-6">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Results Table */}
          <TestResultsTable filters={filters} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-green-600 p-2 rounded-lg">
              <Signal className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">VAS Testing Portal</span>
          </div>
          <p className="text-gray-400">
            Professional Nigerian Telecom VAS Testing & Reporting Platform
          </p>
        </div>
      </footer>

      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  );
};

export default Index;
