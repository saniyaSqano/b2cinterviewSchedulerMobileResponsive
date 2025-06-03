export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advertisements: {
        Row: {
          advertisement_url: string | null
          click_count: number
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string
          impression_count: number
          media_type: string | null
          orientation: string
          start_date: string
          status: string
          target_screen: string
          title: string
          updated_at: string | null
        }
        Insert: {
          advertisement_url?: string | null
          click_count?: number
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url: string
          impression_count?: number
          media_type?: string | null
          orientation: string
          start_date: string
          status?: string
          target_screen: string
          title: string
          updated_at?: string | null
        }
        Update: {
          advertisement_url?: string | null
          click_count?: number
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string
          impression_count?: number
          media_type?: string | null
          orientation?: string
          start_date?: string
          status?: string
          target_screen?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_procto_users: {
        Row: {
          ai_proctor_report: string | null
          assessment_report: string | null
          created_at: string
          email: string
          first_name: string | null
          id: number
          last_name: string | null
          password_hash: string
          pitch_perfect_report: string | null
          policies_accepted: boolean
          self_practice_report: string | null
          updated_at: string
        }
        Insert: {
          ai_proctor_report?: string | null
          assessment_report?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          password_hash: string
          pitch_perfect_report?: string | null
          policies_accepted?: boolean
          self_practice_report?: string | null
          updated_at?: string
        }
        Update: {
          ai_proctor_report?: string | null
          assessment_report?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          password_hash?: string
          pitch_perfect_report?: string | null
          policies_accepted?: boolean
          self_practice_report?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      applied_jobs: {
        Row: {
          applied_date: string | null
          company_name: string | null
          company_url: string | null
          created_at: string
          id: string
          job_id: string | null
          job_title: string | null
          job_type: string | null
          location: string | null
          status: string | null
          updated_at: string
          user_id: string | null
          work_type: string | null
        }
        Insert: {
          applied_date?: string | null
          company_name?: string | null
          company_url?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          job_title?: string | null
          job_type?: string | null
          location?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          work_type?: string | null
        }
        Update: {
          applied_date?: string | null
          company_name?: string | null
          company_url?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          job_title?: string | null
          job_type?: string | null
          location?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          work_type?: string | null
        }
        Relationships: []
      }
      billing_records: {
        Row: {
          amount: number
          billing_date: string
          created_at: string
          id: string
          invoice_url: string | null
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          billing_date?: string
          created_at?: string
          id?: string
          invoice_url?: string | null
          status: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          billing_date?: string
          created_at?: string
          id?: string
          invoice_url?: string | null
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_records_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      call_signaling: {
        Row: {
          call_id: string
          created_at: string | null
          data: Json
          id: string
          sender_id: string
        }
        Insert: {
          call_id: string
          created_at?: string | null
          data: Json
          id?: string
          sender_id: string
        }
        Update: {
          call_id?: string
          created_at?: string | null
          data?: Json
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_signaling_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          call_type: string
          caller_id: string
          conversation_id: string
          created_at: string
          duration: number | null
          ended_at: string | null
          id: string
          receiver_id: string
          started_at: string
          status: string
        }
        Insert: {
          call_type: string
          caller_id: string
          conversation_id: string
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          id?: string
          receiver_id: string
          started_at?: string
          status: string
        }
        Update: {
          call_type?: string
          caller_id?: string
          conversation_id?: string
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          id?: string
          receiver_id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          created_at: string
          documents: Json | null
          email: string
          id: string
          job_id: string | null
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          requirement_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          documents?: Json | null
          email: string
          id?: string
          job_id?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          requirement_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          documents?: Json | null
          email?: string
          id?: string
          job_id?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          requirement_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      chatbot_access: {
        Row: {
          access_type: string
          access_value: string
          chatbot_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          access_type: string
          access_value: string
          chatbot_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          access_type?: string
          access_value?: string
          chatbot_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_access_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbot_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_capabilities: {
        Row: {
          capability: string
          chatbot_id: string | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          capability: string
          chatbot_id?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          capability?: string
          chatbot_id?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_capabilities_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbot_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_configs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          accepted: boolean | null
          connected_user_id: string
          connection_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          accepted?: boolean | null
          connected_user_id: string
          connection_id?: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          accepted?: boolean | null
          connected_user_id?: string
          connection_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_performance: {
        Row: {
          comments: number
          content_id: string
          likes: number
          title: string
          views: number
        }
        Insert: {
          comments?: number
          content_id?: string
          likes?: number
          title: string
          views?: number
        }
        Update: {
          comments?: number
          content_id?: string
          likes?: number
          title?: string
          views?: number
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_id: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_last_message_id_fkey"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_id: string
          created_at: string | null
          duration: string | null
          enrolled_on: string | null
          id: string
          is_completed: boolean | null
          level: string | null
          overview: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          duration?: string | null
          enrolled_on?: string | null
          id?: string
          is_completed?: boolean | null
          level?: string | null
          overview?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          duration?: string | null
          enrolled_on?: string | null
          id?: string
          is_completed?: boolean | null
          level?: string | null
          overview?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          _id: string
          createdat: string
          documentname: string
          documenttype: string
          filesize: number | null
          fileurl: string
          updatedat: string
          userid: number
        }
        Insert: {
          _id?: string
          createdat?: string
          documentname: string
          documenttype: string
          filesize?: number | null
          fileurl: string
          updatedat?: string
          userid: number
        }
        Update: {
          _id?: string
          createdat?: string
          documentname?: string
          documenttype?: string
          filesize?: number | null
          fileurl?: string
          updatedat?: string
          userid?: number
        }
        Relationships: []
      }
      engagement_metrics: {
        Row: {
          metric: string
          value: number
        }
        Insert: {
          metric: string
          value?: number
        }
        Update: {
          metric?: string
          value?: number
        }
        Relationships: []
      }
      feature_role_access: {
        Row: {
          access_level: string
          created_at: string
          feature_id: string
          id: string
          role_id: string
        }
        Insert: {
          access_level: string
          created_at?: string
          feature_id: string
          id?: string
          role_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          feature_id?: string
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_role_access_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_role_access_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      flashcard: {
        Row: {
          attempted_on: string | null
          course_id: string | null
          created_at: string | null
          hints_taken: number | null
          id: string
          time_spent: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attempted_on?: string | null
          course_id?: string | null
          created_at?: string | null
          hints_taken?: number | null
          id?: string
          time_spent?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attempted_on?: string | null
          course_id?: string | null
          created_at?: string | null
          hints_taken?: number | null
          id?: string
          time_spent?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      interview_interviewers: {
        Row: {
          created_at: string
          id: string
          interview_id: string | null
          interviewer_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interview_id?: string | null
          interviewer_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interview_id?: string | null
          interviewer_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_interviewers_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "scheduled_interviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_interviewers_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "interviewers"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_users: {
        Row: {
          availability: string | null
          avatar_url: string | null
          company: string | null
          created_at: string | null
          department: string | null
          documents: string[] | null
          education: string | null
          email: string
          experience: string | null
          expertise: string | null
          id: string
          interviews_completed: number | null
          name: string
          phone: string | null
          position: string | null
          preferredrole: string | null
          rating: number | null
          role: string
          skills: string[] | null
          status: string | null
          upcoming_interviews: number | null
          updated_at: string | null
        }
        Insert: {
          availability?: string | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          department?: string | null
          documents?: string[] | null
          education?: string | null
          email: string
          experience?: string | null
          expertise?: string | null
          id?: string
          interviews_completed?: number | null
          name: string
          phone?: string | null
          position?: string | null
          preferredrole?: string | null
          rating?: number | null
          role: string
          skills?: string[] | null
          status?: string | null
          upcoming_interviews?: number | null
          updated_at?: string | null
        }
        Update: {
          availability?: string | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          department?: string | null
          documents?: string[] | null
          education?: string | null
          email?: string
          experience?: string | null
          expertise?: string | null
          id?: string
          interviews_completed?: number | null
          name?: string
          phone?: string | null
          position?: string | null
          preferredrole?: string | null
          rating?: number | null
          role?: string
          skills?: string[] | null
          status?: string | null
          upcoming_interviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      interviewers: {
        Row: {
          available: boolean | null
          created_at: string
          department: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string
          department: string
          email: string
          id?: string
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          created_at?: string
          department?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_api_configs: {
        Row: {
          api_key: string | null
          api_url: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_fetched_at: string | null
          name: string
          refresh_interval_hours: number | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          api_url: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_fetched_at?: string | null
          name: string
          refresh_interval_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          api_url?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_fetched_at?: string | null
          name?: string
          refresh_interval_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      job_requirements: {
        Row: {
          category: string | null
          company: string
          created_at: string
          department: string | null
          description: string | null
          experience_level: string | null
          id: string
          location: string | null
          posted_date: string | null
          relocation_assistance: boolean | null
          remote_option: boolean | null
          requirement_id: string
          salary: string | null
          skills: Json | null
          title: string
          type: string | null
          updated_at: string
          visa_sponsorship: boolean | null
        }
        Insert: {
          category?: string | null
          company: string
          created_at?: string
          department?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          location?: string | null
          posted_date?: string | null
          relocation_assistance?: boolean | null
          remote_option?: boolean | null
          requirement_id: string
          salary?: string | null
          skills?: Json | null
          title: string
          type?: string | null
          updated_at?: string
          visa_sponsorship?: boolean | null
        }
        Update: {
          category?: string | null
          company?: string
          created_at?: string
          department?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          location?: string | null
          posted_date?: string | null
          relocation_assistance?: boolean | null
          remote_option?: boolean | null
          requirement_id?: string
          salary?: string | null
          skills?: Json | null
          title?: string
          type?: string | null
          updated_at?: string
          visa_sponsorship?: boolean | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          category: string | null
          company: string
          country: string | null
          created_at: string
          currency: string | null
          department: string | null
          description: string | null
          experience_level: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          posted_date: string | null
          relocation_assistance: boolean | null
          remote_option: boolean | null
          salary: string | null
          skills: Json | null
          title: string
          type: string | null
          updated_at: string
          visa_sponsorship: boolean | null
        }
        Insert: {
          category?: string | null
          company: string
          country?: string | null
          created_at?: string
          currency?: string | null
          department?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          posted_date?: string | null
          relocation_assistance?: boolean | null
          remote_option?: boolean | null
          salary?: string | null
          skills?: Json | null
          title: string
          type?: string | null
          updated_at?: string
          visa_sponsorship?: boolean | null
        }
        Update: {
          category?: string | null
          company?: string
          country?: string | null
          created_at?: string
          currency?: string | null
          department?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          posted_date?: string | null
          relocation_assistance?: boolean | null
          remote_option?: boolean | null
          salary?: string | null
          skills?: Json | null
          title?: string
          type?: string | null
          updated_at?: string
          visa_sponsorship?: boolean | null
        }
        Relationships: []
      }
      jobs_settings: {
        Row: {
          feature_enabled: boolean | null
          id: string
          job_applications_enabled: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          feature_enabled?: boolean | null
          id?: string
          job_applications_enabled?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          feature_enabled?: boolean | null
          id?: string
          job_applications_enabled?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          complexity: string | null
          content_format: string | null
          created_at: string
          description: string | null
          domains: Json | null
          id: string
          learning_pace: string | null
          skill_level: string | null
          title: string
          updated_at: string
          user_id: number | null
        }
        Insert: {
          complexity?: string | null
          content_format?: string | null
          created_at?: string
          description?: string | null
          domains?: Json | null
          id?: string
          learning_pace?: string | null
          skill_level?: string | null
          title: string
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          complexity?: string | null
          content_format?: string | null
          created_at?: string
          description?: string | null
          domains?: Json | null
          id?: string
          learning_pace?: string | null
          skill_level?: string | null
          title?: string
          updated_at?: string
          user_id?: number | null
        }
        Relationships: []
      }
      learning_users_data: {
        Row: {
          created_at: string | null
          dob: string | null
          education: string | null
          is_onboarded: boolean | null
          segment: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dob?: string | null
          education?: string | null
          is_onboarded?: boolean | null
          segment?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dob?: string | null
          education?: string | null
          is_onboarded?: boolean | null
          segment?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_users_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          call_id: string | null
          call_type: string | null
          content: string
          conversation_id: string
          created_at: string | null
          deleted_at: string | null
          deleted_for: string | null
          edited_at: string | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          message_type: string | null
          read: boolean | null
          receiver_id: string
          sender_id: string
          status: string
          user_id: string
        }
        Insert: {
          call_id?: string | null
          call_type?: string | null
          content: string
          conversation_id: string
          created_at?: string | null
          deleted_at?: string | null
          deleted_for?: string | null
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_type?: string | null
          read?: boolean | null
          receiver_id: string
          sender_id: string
          status?: string
          user_id: string
        }
        Update: {
          call_id?: string | null
          call_type?: string | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          deleted_at?: string | null
          deleted_for?: string | null
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_type?: string | null
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_questions: {
        Row: {
          category: string | null
          created_at: string
          id: string
          order_index: number | null
          question: string
          segment_id: string
          suggestions: string[]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          order_index?: number | null
          question: string
          segment_id: string
          suggestions: string[]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          order_index?: number | null
          question?: string
          segment_id?: string
          suggestions?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_questions_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_features: {
        Row: {
          created_at: string
          feature_text: string
          id: string
          is_included: boolean | null
          plan_id: string
        }
        Insert: {
          created_at?: string
          feature_text: string
          id?: string
          is_included?: boolean | null
          plan_id: string
        }
        Update: {
          created_at?: string
          feature_text?: string
          id?: string
          is_included?: boolean | null
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_usage_limits: {
        Row: {
          created_at: string
          id: string
          limit_value: number
          metric_name: string
          plan_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          limit_value: number
          metric_name: string
          plan_id: string
        }
        Update: {
          created_at?: string
          id?: string
          limit_value?: number
          metric_name?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_usage_limits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_history: {
        Row: {
          createdat: string
          id: string
          iscreated: boolean
          ispublished: boolean
          portfolioid: string
          updatedat: string
          userid: number
        }
        Insert: {
          createdat?: string
          id?: string
          iscreated?: boolean
          ispublished?: boolean
          portfolioid: string
          updatedat?: string
          userid: number
        }
        Update: {
          createdat?: string
          id?: string
          iscreated?: boolean
          ispublished?: boolean
          portfolioid?: string
          updatedat?: string
          userid?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_history_portfolioid_fkey"
            columns: ["portfolioid"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_publications: {
        Row: {
          created_at: string
          id: string
          portfolio_url: string | null
          published_portfolio_id: string | null
          published_portfolio_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          portfolio_url?: string | null
          published_portfolio_id?: string | null
          published_portfolio_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          portfolio_url?: string | null
          published_portfolio_id?: string | null
          published_portfolio_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_publications_published_portfolio_id_fkey"
            columns: ["published_portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_publications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portfolios: {
        Row: {
          category: string | null
          created_at: string
          designedby: string | null
          id: string
          ispremium: boolean | null
          likes: string[] | null
          name: string | null
          previewimage: string | null
          price: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          designedby?: string | null
          id?: string
          ispremium?: boolean | null
          likes?: string[] | null
          name?: string | null
          previewimage?: string | null
          price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          designedby?: string | null
          id?: string
          ispremium?: boolean | null
          likes?: string[] | null
          name?: string | null
          previewimage?: string | null
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          location: string | null
          media_urls: string[] | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          location?: string | null
          media_urls?: string[] | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          location?: string | null
          media_urls?: string[] | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          designation: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          createdat: string
          description: string | null
          end_date: string | null
          id: string
          link: string | null
          start_date: string | null
          technologies_used: string[] | null
          title: string
          updatedat: string
          user_id: string | null
        }
        Insert: {
          createdat?: string
          description?: string | null
          end_date?: string | null
          id?: string
          link?: string | null
          start_date?: string | null
          technologies_used?: string[] | null
          title: string
          updatedat?: string
          user_id?: string | null
        }
        Update: {
          createdat?: string
          description?: string | null
          end_date?: string | null
          id?: string
          link?: string | null
          start_date?: string | null
          technologies_used?: string[] | null
          title?: string
          updatedat?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reels: {
        Row: {
          created_at: string
          id: string
          storage_path: string | null
          thumbnail_path: string | null
          title: string | null
          updated_at: string
          user_id: number
          video_url: string | null
          views: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          storage_path?: string | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string
          user_id: number
          video_url?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          storage_path?: string | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string
          user_id?: number
          video_url?: string | null
          views?: number | null
        }
        Relationships: []
      }
      resume_settings: {
        Row: {
          feature_enabled: boolean | null
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          feature_enabled?: boolean | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          feature_enabled?: boolean | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      resume_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_visible: boolean | null
          name: string
          price: number | null
          template_type: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible?: boolean | null
          name: string
          price?: number | null
          template_type: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible?: boolean | null
          name?: string
          price?: number | null
          template_type?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string
          id: string
          resource: string
          role_id: string
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string
          id?: string
          resource: string
          role_id: string
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string
          id?: string
          resource?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_trial_policies: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          policy_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          policy_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          policy_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_trial_policies_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "trial_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_trial_policies_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string
          id: string
          job_id: string
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          updated_at?: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_saved_jobs_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_interviews: {
        Row: {
          buffer_after: boolean | null
          buffer_before: boolean | null
          candidate_id: string | null
          created_at: string
          email_reminders: boolean | null
          id: string
          interview_type: string
          job_id: string | null
          job_opening: string
          notes: string | null
          requirement_id: string | null
          scheduled_time: string
          slack_channel: string | null
          slack_notification: boolean | null
          sms_reminders: boolean | null
          status: string | null
          sync_calendar: boolean | null
          updated_at: string
        }
        Insert: {
          buffer_after?: boolean | null
          buffer_before?: boolean | null
          candidate_id?: string | null
          created_at?: string
          email_reminders?: boolean | null
          id?: string
          interview_type: string
          job_id?: string | null
          job_opening: string
          notes?: string | null
          requirement_id?: string | null
          scheduled_time: string
          slack_channel?: string | null
          slack_notification?: boolean | null
          sms_reminders?: boolean | null
          status?: string | null
          sync_calendar?: boolean | null
          updated_at?: string
        }
        Update: {
          buffer_after?: boolean | null
          buffer_before?: boolean | null
          candidate_id?: string | null
          created_at?: string
          email_reminders?: boolean | null
          id?: string
          interview_type?: string
          job_id?: string | null
          job_opening?: string
          notes?: string | null
          requirement_id?: string | null
          scheduled_time?: string
          slack_channel?: string | null
          slack_notification?: boolean | null
          sms_reminders?: boolean | null
          status?: string | null
          sync_calendar?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          segment_id: string | null
          segment_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          segment_id?: string | null
          segment_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          segment_id?: string | null
          segment_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shares: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_features: {
        Row: {
          created_at: string
          description: string | null
          feature_name: string
          id: string
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_name: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_name?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          created_at: string
          description: string | null
          id: string
          is_popular: boolean | null
          name: string
          price: number
          trial_days: number | null
          updated_at: string
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          description?: string | null
          id?: string
          is_popular?: boolean | null
          name: string
          price: number
          trial_days?: number | null
          updated_at?: string
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          description?: string | null
          id?: string
          is_popular?: boolean | null
          name?: string
          price?: number
          trial_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          last_billing_date: string | null
          plan_id: string
          start_date: string
          status: string
          trial_end_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          last_billing_date?: string | null
          plan_id: string
          start_date?: string
          status: string
          trial_end_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          last_billing_date?: string | null
          plan_id?: string
          start_date?: string
          status?: string
          trial_end_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          created_at: string
          description: string | null
          id: number
          status: string
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: number
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: number
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      template_history: {
        Row: {
          createdat: string
          id: string
          isdownloaded: boolean
          isdraft: boolean
          templateid: string
          updatedat: string
          userid: number
        }
        Insert: {
          createdat?: string
          id?: string
          isdownloaded?: boolean
          isdraft?: boolean
          templateid: string
          updatedat?: string
          userid: number
        }
        Update: {
          createdat?: string
          id?: string
          isdownloaded?: boolean
          isdraft?: boolean
          templateid?: string
          updatedat?: string
          userid?: number
        }
        Relationships: [
          {
            foreignKeyName: "template_history_templateid_fkey"
            columns: ["templateid"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          created_at: string
          hasGraphics: boolean | null
          id: string
          isPremium: boolean | null
          layout: string | null
          likes: string[] | null
          preview_url: string | null
          price: number | null
          professional: string | null
          rating: number | null
          requiresProfileImage: boolean | null
          tags: string | null
          template_description: string | null
          template_name: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          hasGraphics?: boolean | null
          id?: string
          isPremium?: boolean | null
          layout?: string | null
          likes?: string[] | null
          preview_url?: string | null
          price?: number | null
          professional?: string | null
          rating?: number | null
          requiresProfileImage?: boolean | null
          tags?: string | null
          template_description?: string | null
          template_name?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          hasGraphics?: boolean | null
          id?: string
          isPremium?: boolean | null
          layout?: string | null
          likes?: string[] | null
          preview_url?: string | null
          price?: number | null
          professional?: string | null
          rating?: number | null
          requiresProfileImage?: boolean | null
          tags?: string | null
          template_description?: string | null
          template_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      test_results: {
        Row: {
          attempted_on: string | null
          correct_answers: number | null
          course_id: string | null
          created_at: string | null
          hints_taken: number | null
          id: string
          incorrect_answers: number | null
          score: number | null
          skipped_questions: number | null
          time_taken: string | null
          total_questions: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attempted_on?: string | null
          correct_answers?: number | null
          course_id?: string | null
          created_at?: string | null
          hints_taken?: number | null
          id?: string
          incorrect_answers?: number | null
          score?: number | null
          skipped_questions?: number | null
          time_taken?: string | null
          total_questions?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attempted_on?: string | null
          correct_answers?: number | null
          course_id?: string | null
          created_at?: string | null
          hints_taken?: number | null
          id?: string
          incorrect_answers?: number | null
          score?: number | null
          skipped_questions?: number | null
          time_taken?: string | null
          total_questions?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ticket_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          priority_level: Database["public"]["Enums"]["ticket_priority"]
          sla_response_time: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          priority_level?: Database["public"]["Enums"]["ticket_priority"]
          sla_response_time?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          priority_level?: Database["public"]["Enums"]["ticket_priority"]
          sla_response_time?: number
          updated_at?: string
        }
        Relationships: []
      }
      ticket_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_agent: boolean
          ticket_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_agent?: boolean
          ticket_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_agent?: boolean
          ticket_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          category: string
          comments: Json | null
          created_at: string
          description: string
          id: string
          priority: string
          requester_email: string
          requester_id: string
          requester_name: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          comments?: Json | null
          created_at?: string
          description: string
          id?: string
          priority?: string
          requester_email: string
          requester_id: string
          requester_name: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          comments?: Json | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          requester_email?: string
          requester_id?: string
          requester_name?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      traffic_data: {
        Row: {
          date: string
          visits: number
        }
        Insert: {
          date: string
          visits?: number
        }
        Update: {
          date?: string
          visits?: number
        }
        Relationships: []
      }
      trial_policies: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          feature_limitations: Json | null
          id: string
          is_active: boolean | null
          max_extensions: number | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number
          feature_limitations?: Json | null
          id?: string
          is_active?: boolean | null
          max_extensions?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          feature_limitations?: Json | null
          id?: string
          is_active?: boolean | null
          max_extensions?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      usage_metrics: {
        Row: {
          alert_enabled: boolean | null
          created_at: string
          current_usage: number | null
          id: string
          limit_value: number
          metric_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_enabled?: boolean | null
          created_at?: string
          current_usage?: number | null
          id?: string
          limit_value: number
          metric_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_enabled?: boolean | null
          created_at?: string
          current_usage?: number | null
          id?: string
          limit_value?: number
          metric_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_certification: {
        Row: {
          certification_id: string | null
          certification_name: string | null
          certification_url: string | null
          created_at: string | null
          date_obtained: string | null
          expiration_date: string | null
          id: string
          issuing_authority: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          certification_id?: string | null
          certification_name?: string | null
          certification_url?: string | null
          created_at?: string | null
          date_obtained?: string | null
          expiration_date?: string | null
          id?: string
          issuing_authority?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          certification_id?: string | null
          certification_name?: string | null
          certification_url?: string | null
          created_at?: string | null
          date_obtained?: string | null
          expiration_date?: string | null
          id?: string
          issuing_authority?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_education: {
        Row: {
          created_at: string | null
          degree_title: string | null
          description: string | null
          end_date: string | null
          id: string
          institution_name: string | null
          location: string | null
          start_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          degree_title?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          institution_name?: string | null
          location?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          degree_title?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          institution_name?: string | null
          location?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_engagement_summary: {
        Row: {
          engagement_score: number | null
          id: string
          last_active: string | null
          most_used_feature: string | null
          most_viewed_page: string | null
          total_page_views: number | null
          total_purchases: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          engagement_score?: number | null
          id?: string
          last_active?: string | null
          most_used_feature?: string | null
          most_viewed_page?: string | null
          total_page_views?: number | null
          total_purchases?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          engagement_score?: number | null
          id?: string
          last_active?: string | null
          most_used_feature?: string | null
          most_viewed_page?: string | null
          total_page_views?: number | null
          total_purchases?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_experince: {
        Row: {
          company_name: string | null
          created_at: string | null
          current_job: boolean | null
          description: string | null
          end_date: string | null
          id: string
          job_title: string | null
          location: string | null
          start_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          current_job?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          job_title?: string | null
          location?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          current_job?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          job_title?: string | null
          location?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_feature_usage: {
        Row: {
          action_type: string
          feature_name: string
          id: string
          item_id: string | null
          item_type: string | null
          metadata: Json | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          feature_name: string
          id?: string
          item_id?: string | null
          item_type?: string | null
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          feature_name?: string
          id?: string
          item_id?: string | null
          item_type?: string | null
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_feature_usage_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_journey_analytics: {
        Row: {
          action_type: string | null
          additional_data: Json | null
          created_at: string
          feature_name: string | null
          id: string
          page_name: string | null
          session_id: string | null
          time_spent: number | null
          timestamp: string
          updated_at: string
          user_id: number
        }
        Insert: {
          action_type?: string | null
          additional_data?: Json | null
          created_at?: string
          feature_name?: string | null
          id?: string
          page_name?: string | null
          session_id?: string | null
          time_spent?: number | null
          timestamp?: string
          updated_at?: string
          user_id: number
        }
        Update: {
          action_type?: string | null
          additional_data?: Json | null
          created_at?: string
          feature_name?: string | null
          id?: string
          page_name?: string | null
          session_id?: string | null
          time_spent?: number | null
          timestamp?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      user_language: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          proficiency: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          proficiency?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          proficiency?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_links: {
        Row: {
          created_at: string
          link_id: number
          link_label: string | null
          link_url: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          link_id?: number
          link_label?: string | null
          link_url: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          link_id?: number
          link_label?: string | null
          link_url?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_page_views: {
        Row: {
          anonymous_id: string | null
          id: string
          page_name: string
          page_path: string
          section_name: string | null
          session_id: string | null
          time_spent: number | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          id?: string
          page_name: string
          page_path: string
          section_name?: string | null
          session_id?: string | null
          time_spent?: number | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          id?: string
          page_name?: string
          page_path?: string
          section_name?: string | null
          session_id?: string | null
          time_spent?: number | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_page_views_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_project: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          project_role: string | null
          project_title: string | null
          project_url: string | null
          start_date: string | null
          technology_used: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          project_role?: string | null
          project_title?: string | null
          project_url?: string | null
          start_date?: string | null
          technology_used?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          project_role?: string | null
          project_title?: string | null
          project_url?: string | null
          start_date?: string | null
          technology_used?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          amount: number
          currency: string
          id: string
          metadata: Json | null
          payment_method: string | null
          plan_id: string
          plan_name: string
          related_to: string | null
          status: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          amount: number
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          plan_id: string
          plan_name: string
          related_to?: string | null
          status: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          plan_id?: string
          plan_name?: string
          related_to?: string | null
          status?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          appearance: Json
          created_at: string
          id: string
          localization: Json
          notifications: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          appearance?: Json
          created_at?: string
          id?: string
          localization?: Json
          notifications?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          appearance?: Json
          created_at?: string
          id?: string
          localization?: Json
          notifications?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string | null
          id: string
          skills: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_status: {
        Row: {
          is_online: boolean | null
          last_seen: string | null
          user_id: string
        }
        Insert: {
          is_online?: boolean | null
          last_seen?: string | null
          user_id: string
        }
        Update: {
          is_online?: boolean | null
          last_seen?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_trials: {
        Row: {
          created_at: string
          end_date: string
          extensions_used: number | null
          id: string
          policy_id: string
          start_date: string
          status: string
          updated_at: string
          usage_metrics: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          extensions_used?: number | null
          id?: string
          policy_id: string
          start_date?: string
          status?: string
          updated_at?: string
          usage_metrics?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          extensions_used?: number | null
          id?: string
          policy_id?: string
          start_date?: string
          status?: string
          updated_at?: string
          usage_metrics?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_trials_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "trial_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accomplishments: string[] | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          designation: string | null
          email: string | null
          facebook: string | null
          first_name: string | null
          has_Resume_Upload_Pop_Show: boolean | null
          id: string
          instagram: string | null
          last_name: string | null
          linkedin: string | null
          mode: string | null
          phone: string | null
          pin_code: string | null
          section1_background_url: string | null
          section2_background_url: string | null
          section3_background_url: string | null
          summary: string | null
          twitter: string | null
          updated_at: string | null
          user_id: string | null
          user_role: string | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          accomplishments?: string[] | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          facebook?: string | null
          first_name?: string | null
          has_Resume_Upload_Pop_Show?: boolean | null
          id?: string
          instagram?: string | null
          last_name?: string | null
          linkedin?: string | null
          mode?: string | null
          phone?: string | null
          pin_code?: string | null
          section1_background_url?: string | null
          section2_background_url?: string | null
          section3_background_url?: string | null
          summary?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_role?: string | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          accomplishments?: string[] | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          facebook?: string | null
          first_name?: string | null
          has_Resume_Upload_Pop_Show?: boolean | null
          id?: string
          instagram?: string | null
          last_name?: string | null
          linkedin?: string | null
          mode?: string | null
          phone?: string | null
          pin_code?: string | null
          section1_background_url?: string | null
          section2_background_url?: string | null
          section3_background_url?: string | null
          summary?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_role?: string | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      post_share_counts: {
        Row: {
          post_id: string | null
          share_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followers: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          follower_id: string | null
          last_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_following: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          following_id: string | null
          last_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_missing_conversation_participants: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      add_participants_if_not_exists: {
        Args: { p_conversation_id: string; p_user_ids: string[] }
        Returns: undefined
      }
      automatically_set_users_offline: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_conversation_with_participants: {
        Args: {
          p_creator_id: string
          p_participant_ids?: string[]
          p_name?: string
        }
        Returns: string
      }
      ensure_participant: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: undefined
      }
      get_feature_usage_stats: {
        Args: { start_date: string }
        Returns: {
          feature_name: string
          count: number
        }[]
      }
      get_or_create_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      get_page_view_stats: {
        Args: { start_date: string }
        Returns: {
          page_name: string
          count: number
        }[]
      }
      get_purchase_stats: {
        Args: { start_date: string }
        Returns: {
          plan_name: string
          count: number
        }[]
      }
      get_table_data_simple: {
        Args: { table_name: string; row_limit?: number }
        Returns: Json
      }
      get_table_structure: {
        Args: { p_table_name: string }
        Returns: {
          column_name: string
          data_type: string
          is_nullable: boolean
          column_default: string
          constraint_name: string
          constraint_type: string
        }[]
      }
      get_time_spent_by_date: {
        Args: { start_date: string }
        Returns: {
          date: string
          seconds: number
        }[]
      }
      get_time_spent_by_page: {
        Args: { start_date: string }
        Returns: {
          page_name: string
          seconds: number
        }[]
      }
      get_time_spent_stats: {
        Args: { start_date: string }
        Returns: {
          total_seconds: number
          avg_seconds_per_user: number
          page_with_most_time: string
          page_most_time_seconds: number
          peak_usage_date: string
          peak_usage_seconds: number
        }[]
      }
      is_message_sender_in_conversation: {
        Args: { sender_id: string; conversation_id: string }
        Returns: boolean
      }
      list_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          table_schema: string
        }[]
      }
      safely_add_participant: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: undefined
      }
      user_in_conversation: {
        Args: { user_id: string; conversation_id: string }
        Returns: boolean
      }
      users_are_connected: {
        Args: { user1_id: string; user2_id: string }
        Returns: boolean
      }
    }
    Enums: {
      billing_cycle: "monthly" | "quarterly" | "annual"
      ticket_priority: "low" | "medium" | "high" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      billing_cycle: ["monthly", "quarterly", "annual"],
      ticket_priority: ["low", "medium", "high", "critical"],
    },
  },
} as const
