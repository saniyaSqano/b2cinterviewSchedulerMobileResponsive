
-- Create the new ai_procto_user table with proper foreign key relationships
CREATE TABLE public.ai_procto_user (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  technical_skills TEXT,
  experience TEXT,
  target_job_description TEXT,
  cv_file_name TEXT,
  cv_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one record per user
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.ai_procto_user ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own procto data" 
  ON public.ai_procto_user 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own procto data" 
  ON public.ai_procto_user 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own procto data" 
  ON public.ai_procto_user 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own procto data" 
  ON public.ai_procto_user 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_ai_procto_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_procto_user_updated_at
  BEFORE UPDATE ON public.ai_procto_user
  FOR EACH ROW EXECUTE FUNCTION public.update_ai_procto_user_updated_at();
