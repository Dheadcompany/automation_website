
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
      let query = supabase
        .from('vas_reports')
        .select('*')
        .order('timestamp', { ascending: false });

      // Apply filters with proper type casting
      if (filters.operator) {
        query = query.eq('operator', filters.operator as 'MTN' | 'Airtel' | 'Glo' | '9mobile');
      }
      if (filters.testType) {
        query = query.eq('test_type', filters.testType as 'SMS' | 'USSD' | 'WAP' | 'IVR' | 'MMS');
      }
      if (filters.status) {
        query = query.eq('status', filters.status as 'passed' | 'failed' | 'warning');
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
