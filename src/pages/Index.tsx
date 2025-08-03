import React, { useState } from "react";
import ExportButtons from "../components/ExportButtons";
import TestResultsTable from "../components/TestResultsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestMetrics } from "@/components/TestMetrics";
import { FilterPanel } from "@/components/FilterPanel";
import { AuthDialog } from "@/components/AuthDialog";
import {
  Shield,
  Signal,
  Database,
  Download,
  Filter,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [filters, setFilters] = useState({
    operator: "",
    testType: "",
    status: "",
    dateRange: "",
  });
  const [selectedRow, setSelectedRow] = useState(null);

  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-green-100">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
                  <Signal className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 hidden sm:block">
                    VAS Testing Report Portal
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    VDL Technologies Value Added Services
                  </p>
                  <h1 className="text-lg font-bold text-gray-900 sm:hidden">
                    VAS Portal
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-start">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Live Testing
                </Badge>
                <Button
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-6 sm:py-8 md:py-12 px-3 sm:px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Professional VAS Testing & Reporting
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-2">
              Monitor, analyze, and report on Value Added Services with
              real-time insights.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center py-4 md:py-6">
                  <div className="bg-green-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Database className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg">
                    Real-time Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 md:pb-6">
                  <p className="text-sm md:text-base text-gray-600">
                    Live test results from automated Python scripts
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center py-4 md:py-6">
                  <div className="bg-green-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg">
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 md:pb-6">
                  <p className="text-sm md:text-base text-gray-600">
                    Comprehensive reporting and visualization
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center py-4 md:py-6">
                  <div className="bg-green-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Filter className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg">
                    Advanced Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 md:pb-6">
                  <p className="text-sm md:text-base text-gray-600">
                    Filter by operator, test type, and status
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center py-4 md:py-6">
                  <div className="bg-green-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Download className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg">
                    Export Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 md:pb-6">
                  <p className="text-sm md:text-base text-gray-600">
                    PDF and CSV export for reporting
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => setIsAuthOpen(true)}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Get Started
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-4 sm:py-6 md:py-8 px-3 sm:px-4">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2 sm:mb-3 md:mb-4">
              <div className="bg-green-600 p-1 sm:p-1.5 md:p-2 rounded-lg">
                <Signal className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-sm sm:text-base md:text-lg font-semibold">
                VAS Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">
              VDL Technologies
            </p>
          </div>
        </footer>

        <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
              <div className="bg-green-600 p-2 rounded-lg">
                <Signal className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 hidden md:block">
                  VAS Testing Report Portal
                </h1>
                <h1 className="text-xl font-bold text-gray-900 md:hidden">
                  VAS Report Portal
                </h1>
                <p className="text-sm text-gray-600">Welcome, {user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Live Testing
              </Badge>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Section */}
      <section className="py-6 md:py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 mb-6 md:mb-8">
            <div className="text-center lg:text-left w-full lg:w-auto">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Test Results Dashboard
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Monitor your VAS testing results in real-time
              </p>
            </div>
            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
              <ExportButtons selectedResult={selectedRow} />
            </div>
          </div>

          {/* Metrics */}
          <TestMetrics />

          {/* Filters */}
          <div className="mb-6">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Results Table */}
          <TestResultsTable filters={filters} selectedRow={selectedRow} setSelectedRow={setSelectedRow} />
        </div>
      </section>
    </div>
  );
};

export default Index;
