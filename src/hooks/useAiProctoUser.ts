
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface AiProctoUser {
  id: string;
  user_id: string;
  technical_skills?: string;
  experience?: string;
  target_job_description?: string;
  cv_file_name?: string;
  cv_file_url?: string;
  created_at: string;
  updated_at: string;
}

interface CreateUserData {
  technical_skills?: string;
  experience?: string;
  target_job_description?: string;
  cv_file_name?: string;
  cv_file_url?: string;
}

export const useAiProctoUser = (userId?: string) => {
  const [user, setUser] = useState<AiProctoUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (targetUserId?: string) => {
    const userIdToFetch = targetUserId || userId;
    if (!userIdToFetch) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('ai_procto_user')
        .select('*')
        .eq('user_id', userIdToFetch)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User not found, this is not necessarily an error
          setUser(null);
          return null;
        } else {
          throw error;
        }
      } else {
        setUser(data);
        return data;
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the current authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('User must be authenticated');
      }

      console.log('Creating user with data:', userData);
      
      // First try to fetch existing user
      const existingUser = await fetchUser(authUser.id);
      if (existingUser) {
        console.log('User already exists:', existingUser);
        setUser(existingUser);
        return existingUser;
      }
      
      const userDataForInsert = { 
        ...userData, 
        user_id: authUser.id
      };
      
      console.log('Sending to Supabase:', userDataForInsert);
      
      const { data, error } = await supabase
        .from('ai_procto_user')
        .insert(userDataForInsert)
        .select()
        .single();
      
      if (error) {
        // Handle duplicate key error gracefully
        if (error.code === '23505') {
          console.log('User already exists, fetching existing user');
          const existingUser = await fetchUser(authUser.id);
          if (existingUser) {
            setUser(existingUser);
            return existingUser;
          }
        }
        
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('User created successfully:', data);
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

  const updateUser = async (updateData: Partial<CreateUserData>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the current authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('ai_procto_user')
        .update(updateData)
        .eq('user_id', authUser.id)
        .select()
        .single();

      if (error) throw error;
      
      setUser(data);
      return data;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    fetchUser,
    createUser,
    updateUser,
    refetch: () => userId && fetchUser(userId)
  };
};
