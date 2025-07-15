
-- Create enum for test statuses
CREATE TYPE public.test_status AS ENUM ('passed', 'failed', 'warning');

-- Create enum for test types
CREATE TYPE public.test_type AS ENUM ('SMS', 'USSD', 'WAP', 'IVR', 'MMS');

-- Create enum for operators
CREATE TYPE public.operator_type AS ENUM ('MTN', 'Airtel', 'Glo', '9mobile');

-- Create test_results table to store VAS test data
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  operator operator_type NOT NULL,
  test_type test_type NOT NULL,
  service TEXT NOT NULL,
  status test_status NOT NULL,
  response_time INTEGER NOT NULL, -- in milliseconds
  error_message TEXT,
  request_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test_sessions table to group related tests
CREATE TABLE public.test_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_name TEXT NOT NULL,
  description TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_tests INTEGER DEFAULT 0,
  passed_tests INTEGER DEFAULT 0,
  failed_tests INTEGER DEFAULT 0,
  warning_tests INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add session reference to test_results
ALTER TABLE public.test_results 
ADD COLUMN session_id UUID REFERENCES public.test_sessions(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for test_results
CREATE POLICY "Users can view their own test results" 
  ON public.test_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results" 
  ON public.test_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results" 
  ON public.test_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test results" 
  ON public.test_results 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for test_sessions
CREATE POLICY "Users can view their own test sessions" 
  ON public.test_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test sessions" 
  ON public.test_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test sessions" 
  ON public.test_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test sessions" 
  ON public.test_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update test session statistics
CREATE OR REPLACE FUNCTION update_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.test_sessions 
    SET 
      total_tests = total_tests + 1,
      passed_tests = CASE WHEN NEW.status = 'passed' THEN passed_tests + 1 ELSE passed_tests END,
      failed_tests = CASE WHEN NEW.status = 'failed' THEN failed_tests + 1 ELSE failed_tests END,
      warning_tests = CASE WHEN NEW.status = 'warning' THEN warning_tests + 1 ELSE warning_tests END
    WHERE id = NEW.session_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update session statistics
CREATE TRIGGER update_session_stats_trigger
  AFTER INSERT ON public.test_results
  FOR EACH ROW EXECUTE FUNCTION update_session_stats();

-- Create indexes for better performance
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX idx_test_results_timestamp ON public.test_results(timestamp);
CREATE INDEX idx_test_results_operator ON public.test_results(operator);
CREATE INDEX idx_test_results_status ON public.test_results(status);
CREATE INDEX idx_test_results_session_id ON public.test_results(session_id);
CREATE INDEX idx_test_sessions_user_id ON public.test_sessions(user_id);
