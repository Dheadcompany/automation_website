
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type TestResult = Tables<'vas_reports'>;

interface Filters {
  operator: string;
  testType: string;
  status: string;
  dateRange: string;
}

export const useTestResults = (filters: Filters) => {
  const { data: testResults, isLoading, error, refetch } = useQuery({
    queryKey: ['test-results', filters],
    queryFn: async () => {
      console.log('Filters used:', filters);
      let query = supabase
        .from('vas_reports')
        .select('*')
        .order('timestamp', { ascending: false });

      // Apply filters with proper type casting
      if (filters.operator) {
        // Filter by operator if operator is part of test_name
        query = query.ilike('test_name', `%${filters.operator}%`);
      }
      if (filters.testType) {
        // Filter by testType if testType is part of test_name
        query = query.ilike('test_name', `%${filters.testType}%`);
      }
      if (filters.status) {
        // Accept 'PASSED' from UI and match 'PASS' in DB (case-insensitive)
        const normalizedStatus = filters.status.trim().toLowerCase();
        if (normalizedStatus === 'passed') {
          query = query.ilike('status', '%pass%');
        } else if (normalizedStatus === 'failed') {
          query = query.ilike('status', '%fail%');
        } else if (normalizedStatus === 'warning') {
          query = query.ilike('status', '%warn%');
        } else {
          query = query.ilike('status', `%${filters.status}%`);
        }
      }
      if (filters.dateRange) {
        const now = new Date();
        let startDate: Date;
        
        switch (filters.dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'yesterday':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            query = query.lt('timestamp', new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString());
            break;
          case 'last7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'last30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        if (filters.dateRange !== 'yesterday') {
          query = query.gte('timestamp', startDate.toISOString());
        }
      }

      const { data, error } = await query;
      if (data) {
        const uniqueStatuses = Array.from(new Set(data.map((row: any) => row.status)));
        console.log('Unique status values in vas_reports:', uniqueStatuses);
      }
      console.log('Results returned:', data);
      
      if (error) throw error;
      return data as TestResult[];
    },
  });

  return {
    testResults: testResults || [],
    isLoading,
    error,
    refetch,
  };
};
