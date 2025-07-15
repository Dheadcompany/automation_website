
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTestMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['test-metrics'],
    queryFn: async () => {
      // Get test results from last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: recentTests, error } = await supabase
        .from('test_results')
        .select('status, response_time')
        .gte('timestamp', yesterday);

      if (error) throw error;

      const totalTests = recentTests?.length || 0;
      const passedTests = recentTests?.filter(t => t.status === 'passed').length || 0;
      const failedTests = recentTests?.filter(t => t.status === 'failed').length || 0;
      const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : "0.0";
      
      const avgResponseTime = recentTests && recentTests.length > 0 
        ? (recentTests.reduce((sum, test) => sum + test.response_time, 0) / recentTests.length / 1000).toFixed(1)
        : "0.0";

      return {
        totalTests: totalTests.toString(),
        successRate: `${successRate}%`,
        failedTests: failedTests.toString(),
        avgResponseTime: `${avgResponseTime}s`,
      };
    },
  });

  return {
    metrics: metrics || {
      totalTests: "0",
      successRate: "0.0%",
      failedTests: "0",
      avgResponseTime: "0.0s",
    },
    isLoading,
  };
};
