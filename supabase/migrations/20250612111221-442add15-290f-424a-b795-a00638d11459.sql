
-- Remove the existing foreign key constraint
ALTER TABLE public.ai_procto_user 
DROP CONSTRAINT ai_procto_user_user_id_fkey;

-- Add new foreign key constraint to reference auth.users directly
ALTER TABLE public.ai_procto_user 
ADD CONSTRAINT ai_procto_user_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
