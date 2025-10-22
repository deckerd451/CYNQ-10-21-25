export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          background: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          background?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          background?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_goals: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_interests: {
        Row: {
          id: string
          user_id: string
          interest: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          interest: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          interest?: string
          created_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          model: string
          created_at: string
          last_active: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          model?: string
          created_at?: string
          last_active?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          model?: string
          created_at?: string
          last_active?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          timestamp: string
          tool_calls: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          timestamp?: string
          tool_calls?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          timestamp?: string
          tool_calls?: Json | null
          created_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          event_date: string | null
          location: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          event_date?: string | null
          location?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          event_date?: string | null
          location?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      communities: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          url: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          website: string | null
          industry: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          website?: string | null
          industry?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          website?: string | null
          industry?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          proficiency_level: string | null
          years_experience: number | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          proficiency_level?: string | null
          years_experience?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          proficiency_level?: string | null
          years_experience?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: string | null
          start_date: string | null
          end_date: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_items: {
        Row: {
          id: string
          user_id: string
          name: string
          url: string | null
          description: string | null
          content_type: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          url?: string | null
          description?: string | null
          content_type?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          url?: string | null
          description?: string | null
          content_type?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      relationships: {
        Row: {
          id: string
          user_id: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          relationship_type: string
          strength: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          relationship_type: string
          strength?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
          relationship_type?: string
          strength?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      critical_paths: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          overall_timeline: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          overall_timeline?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          overall_timeline?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      critical_path_phases: {
        Row: {
          id: string
          critical_path_id: string
          name: string
          duration: string | null
          objective: string | null
          deliverable: string | null
          phase_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          critical_path_id: string
          name: string
          duration?: string | null
          objective?: string | null
          deliverable?: string | null
          phase_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          critical_path_id?: string
          name?: string
          duration?: string | null
          objective?: string | null
          deliverable?: string | null
          phase_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      critical_path_tasks: {
        Row: {
          id: string
          phase_id: string
          text: string
          completed: boolean
          assigned_to_org_id: string | null
          task_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phase_id: string
          text: string
          completed?: boolean
          assigned_to_org_id?: string | null
          task_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phase_id?: string
          text?: string
          completed?: boolean
          assigned_to_org_id?: string | null
          task_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      community_resources: {
        Row: {
          id: string
          type: 'article' | 'tool' | 'contact'
          title: string
          description: string | null
          tags: string[] | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'article' | 'tool' | 'contact'
          title: string
          description?: string | null
          tags?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'article' | 'tool' | 'contact'
          title?: string
          description?: string | null
          tags?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      anonymized_insights: {
        Row: {
          id: string
          text: string
          relevance_score: number | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          relevance_score?: number | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          text?: string
          relevance_score?: number | null
          tags?: string[] | null
          created_at?: string
        }
      }
      oauth_tokens: {
        Row: {
          id: string
          user_id: string
          service: string
          access_token: string
          refresh_token: string | null
          expires_in: number | null
          scope: string | null
          token_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service: string
          access_token: string
          refresh_token?: string | null
          expires_in?: number | null
          scope?: string | null
          token_type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service?: string
          access_token?: string
          refresh_token?: string | null
          expires_in?: number | null
          scope?: string | null
          token_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      data_source_connections: {
        Row: {
          id: string
          user_id: string
          service: string
          is_connected: boolean
          last_sync_at: string | null
          sync_status: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service: string
          is_connected?: boolean
          last_sync_at?: string | null
          sync_status?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service?: string
          is_connected?: boolean
          last_sync_at?: string | null
          sync_status?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
