
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface AiProctoUser {
  id: number;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  self_practice_report?: string;
  ai_proctor_report?: string;
  assessment_report?: string;
  pitch_perfect_report?: string;
  policies_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export const useAiProctoUser = (email?: string) => {
  const [user, setUser] = useState<AiProctoUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (userEmail: string) => {
    if (!userEmail) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('ai_procto_users')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User not found, this is not necessarily an error
          setUser(null);
        } else {
          throw error;
        }
      } else {
        setUser(data);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Partial<AiProctoUser>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('ai_procto_users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      
      setUser(data);
      return data;
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserReport = async (
    userEmail: string, 
    reportType: 'self_practice_report' | 'ai_proctor_report' | 'assessment_report' | 'pitch_perfect_report',
    reportUrl: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('ai_procto_users')
        .update({ [reportType]: reportUrl, updated_at: new Date().toISOString() })
        .eq('email', userEmail)
        .select()
        .single();

      if (error) throw error;
      
      setUser(data);
      return data;
    } catch (err) {
      console.error('Error updating user report:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchUser(email);
    }
  }, [email]);

  return {
    user,
    loading,
    error,
    fetchUser,
    createUser,
    updateUserReport,
    refetch: () => email && fetchUser(email)
  };
};
