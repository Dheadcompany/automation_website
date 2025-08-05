import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, X } from "lucide-react";

interface FilterPanelProps {
  filters: {
    operator: string;
    testType: string;
    status: string;
    dateRange: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      operator: "",
      testType: "",
      status: "",
      dateRange: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <Card className="border-green-200">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-4 flex-1">
            <Select
              value={filters.operator}
              onValueChange={(value) => updateFilter("operator", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN">Mtn</SelectItem>
                <SelectItem value="Airtel">Airtel</SelectItem>
                <SelectItem value="Glo">Glo</SelectItem>
                <SelectItem value="9mobile">9mobile</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.testType}
              onValueChange={(value) => updateFilter("testType", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Test Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="USSD">USSD</SelectItem>
                <SelectItem value="URL">URL</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(value) => updateFilter("dateRange", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
