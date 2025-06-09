
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface AiProctoUser {
  user_id: number;
  email: string;
  full_name?: string;
  phone_number?: string;
  skills?: string;
  cv_file_name?: string;
  cv_file_url?: string;
  job_description?: string;
  policies_accepted: boolean;
  created_at: string;
}

interface CreateUserData {
  email: string;
  full_name?: string;
  phone_number?: string;
  skills?: string;
  cv_file_name?: string;
  cv_file_url?: string;
  job_description?: string;
  policies_accepted?: boolean;
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
        .from('ai_procto_user')
        .select('*')
        .eq('email', userEmail)
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
      console.log('Creating user with data:', userData);
      
      // First try to fetch existing user
      const existingUser = await fetchUser(userData.email);
      if (existingUser) {
        console.log('User already exists:', existingUser);
        setUser(existingUser);
        return existingUser;
      }
      
      const userDataForInsert = { 
        ...userData, 
        policies_accepted: userData.policies_accepted ?? true
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
          const existingUser = await fetchUser(userData.email);
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

  const updateUser = async (userEmail: string, updateData: Partial<CreateUserData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('ai_procto_user')
        .update(updateData)
        .eq('email', userEmail)
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
    updateUser,
    refetch: () => email && fetchUser(email)
  };
};
