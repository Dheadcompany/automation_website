-- Create only what is used in your lab.py script and Supabase types

-- ✅ Create vas_reports table
CREATE TABLE public.vas_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name text NOT NULL,
  status text NOT NULL,
  msisdn text NOT NULL,
  timestamp text NOT NULL,
  click_id text NOT NULL,
  airtime_before text NOT NULL,
  airtime_after text NOT NULL,
  video_url text
);

-- ✅ Optional: Enable Row Level Security (disabled during development)
-- ALTER TABLE public.vas_reports ENABLE ROW LEVEL SECURITY;

-- ✅ Optional: Indexes for performance (useful when filtering or sorting)
-- CREATE INDEX idx_vas_reports_status ON public.vas_reports(status);
-- CREATE INDEX idx_vas_reports_timestamp ON public.vas_reports(timestamp);
-- CREATE INDEX idx_vas_reports_msisdn ON public.vas_reports(msisdn);
