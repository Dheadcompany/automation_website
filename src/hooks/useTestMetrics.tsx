
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

type TestReport = Tables<'vas_reports'>;

const normalizeStatus = (status: string | null): string => {
  if (!status) return 'UNKNOWN';
  const normalized = status.trim().toUpperCase();
  if (normalized === 'PASS' || normalized === 'PASSED') return 'PASS';
  if (normalized === 'FAIL' || normalized === 'FAILED') return 'FAIL';
  return 'UNKNOWN';
};

export const useTestMetrics = () => {
  const { user, session, loading } = useAuth();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['test-metrics', user?.id],
    queryFn: async () => {
      if (loading) {
        console.log('Auth state is still loading');
        return {
          totalTests: '0',
          passedTests: '0',
          failedTests: '0'
        };
      }

      if (!session) {
        console.log('No active session');
        return {
          totalTests: '0',
          passedTests: '0',
          failedTests: '0'
        };
      }

      if (!user) {
        console.log('No authenticated user');
        return {
          totalTests: '0',
          passedTests: '0',
          failedTests: '0'
        };
      }

      try {
        console.log('Attempting to fetch metrics with session:', {
          userId: user.id,
          email: user.email,
          role: session.user.role
        });

        // First try a simple query to check access
        const { data: testAccess, error: accessError } = await supabase
          .from('vas_reports')
          .select('id')
          .limit(1);

        if (accessError) {
          console.error('Access check failed:', {
            message: accessError.message,
            code: accessError.code,
            details: accessError.details,
            hint: accessError.hint
          });
          return {
            totalTests: '0',
            passedTests: '0',
            failedTests: '0'
          };
        }

        console.log('Access check passed, fetching metrics data');

        // Now fetch the actual metrics data
        const { data, error } = await supabase
          .from('vas_reports')
          .select('status');

        if (error) {
          console.error('Failed to fetch metrics:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          return {
            totalTests: '0',
            passedTests: '0',
            failedTests: '0'
          };
        }

        if (!data || data.length === 0) {
          console.log('No test data found');
          return {
            totalTests: '0',
            passedTests: '0',
            failedTests: '0'
          };
        }

        // Process and normalize status values
        const processedData = data.map(test => ({
          ...test,
          normalizedStatus: normalizeStatus(test.status)
        }));

        // Log status distribution
        const statusCounts = processedData.reduce((acc: Record<string, number>, test) => {
          acc[test.normalizedStatus] = (acc[test.normalizedStatus] || 0) + 1;
          return acc;
        }, {});

        console.log('Status distribution:', {
          raw: data.slice(0, 5).map(t => t.status),
          normalized: statusCounts
        });

        const totalTests = processedData.length;
        const passedTests = processedData.filter(
          (test) => test.normalizedStatus === 'PASS'
        ).length;
        const failedTests = processedData.filter(
          (test) => test.normalizedStatus === 'FAIL'
        ).length;

        console.log('Calculated metrics:', {
          total: totalTests,
          passed: passedTests,
          failed: failedTests,
          unknown: totalTests - (passedTests + failedTests)
        });

        return {
          totalTests: totalTests.toString(),
          passedTests: passedTests.toString(),
          failedTests: failedTests.toString(),
        };
      } catch (err) {
        console.error('Unexpected error in metrics calculation:', err);
        return {
          totalTests: '0',
          passedTests: '0',
          failedTests: '0'
        };
      }
    },
    enabled: !loading && !!session && !!user,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  return {
    metrics: metrics || {
      totalTests: '0',
      passedTests: '0',
      failedTests: '0',
    },
    isLoading,
  };
};
