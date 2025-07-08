export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          variables?: Json;
          extensions?: Json;
          operationName?: string;
          query?: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          content: string;
          context_note_ids: string[] | null;
          created_at: string | null;
          id: string;
          model: string | null;
          note_id: string | null;
          role: string;
          tokens_used: number | null;
          user_id: string;
        };
        Insert: {
          content: string;
          context_note_ids?: string[] | null;
          created_at?: string | null;
          id?: string;
          model?: string | null;
          note_id?: string | null;
          role: string;
          tokens_used?: number | null;
          user_id: string;
        };
        Update: {
          content?: string;
          context_note_ids?: string[] | null;
          created_at?: string | null;
          id?: string;
          model?: string | null;
          note_id?: string | null;
          role?: string;
          tokens_used?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_chat_history_note_id_fkey';
            columns: ['note_id'];
            isOneToOne: false;
            referencedRelation: 'notes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_chat_history_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_insights: {
        Row: {
          actions: Json | null;
          content: string;
          created_at: string | null;
          expires_at: string | null;
          id: string;
          is_dismissed: boolean | null;
          is_read: boolean | null;
          priority: number | null;
          read_at: string | null;
          related_note_ids: string[] | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          actions?: Json | null;
          content: string;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          is_dismissed?: boolean | null;
          is_read?: boolean | null;
          priority?: number | null;
          read_at?: string | null;
          related_note_ids?: string[] | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          actions?: Json | null;
          content?: string;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          is_dismissed?: boolean | null;
          is_read?: boolean | null;
          priority?: number | null;
          read_at?: string | null;
          related_note_ids?: string[] | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_insights_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_processing_queue: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          error_message: string | null;
          id: string;
          note_id: string;
          priority: number | null;
          process_type: string;
          retry_count: number | null;
          started_at: string | null;
          status: string | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          note_id: string;
          priority?: number | null;
          process_type: string;
          retry_count?: number | null;
          started_at?: string | null;
          status?: string | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          note_id?: string;
          priority?: number | null;
          process_type?: string;
          retry_count?: number | null;
          started_at?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_processing_queue_note_id_fkey';
            columns: ['note_id'];
            isOneToOne: false;
            referencedRelation: 'notes';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_usage_stats: {
        Row: {
          completion_requests: number | null;
          completion_tokens: number | null;
          created_at: string | null;
          embedding_requests: number | null;
          embedding_tokens: number | null;
          estimated_cost: number | null;
          id: string;
          period_end: string;
          period_start: string;
          total_requests: number | null;
          total_tokens: number | null;
          user_id: string;
        };
        Insert: {
          completion_requests?: number | null;
          completion_tokens?: number | null;
          created_at?: string | null;
          embedding_requests?: number | null;
          embedding_tokens?: number | null;
          estimated_cost?: number | null;
          id?: string;
          period_end: string;
          period_start: string;
          total_requests?: number | null;
          total_tokens?: number | null;
          user_id: string;
        };
        Update: {
          completion_requests?: number | null;
          completion_tokens?: number | null;
          created_at?: string | null;
          embedding_requests?: number | null;
          embedding_tokens?: number | null;
          estimated_cost?: number | null;
          id?: string;
          period_end?: string;
          period_start?: string;
          total_requests?: number | null;
          total_tokens?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_usage_stats_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          is_ai_generated: boolean | null;
          name: string;
          notes_count: number | null;
          parent_id: string | null;
          slug: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_ai_generated?: boolean | null;
          name: string;
          notes_count?: number | null;
          parent_id?: string | null;
          slug: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_ai_generated?: boolean | null;
          name?: string;
          notes_count?: number | null;
          parent_id?: string | null;
          slug?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'categories_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      cluster_notes: {
        Row: {
          cluster_id: string;
          note_id: string;
          similarity_score: number | null;
        };
        Insert: {
          cluster_id: string;
          note_id: string;
          similarity_score?: number | null;
        };
        Update: {
          cluster_id?: string;
          note_id?: string;
          similarity_score?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cluster_notes_cluster_id_fkey';
            columns: ['cluster_id'];
            isOneToOne: false;
            referencedRelation: 'note_clusters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cluster_notes_note_id_fkey';
            columns: ['note_id'];
            isOneToOne: false;
            referencedRelation: 'notes';
            referencedColumns: ['id'];
          },
        ];
      };
      note_clusters: {
        Row: {
          avg_similarity: number | null;
          centroid: string | null;
          created_at: string | null;
          id: string;
          keywords: string[] | null;
          name: string;
          notes_count: number | null;
          summary: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          avg_similarity?: number | null;
          centroid?: string | null;
          created_at?: string | null;
          id?: string;
          keywords?: string[] | null;
          name: string;
          notes_count?: number | null;
          summary?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          avg_similarity?: number | null;
          centroid?: string | null;
          created_at?: string | null;
          id?: string;
          keywords?: string[] | null;
          name?: string;
          notes_count?: number | null;
          summary?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'note_clusters_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      note_connections: {
        Row: {
          ai_confidence: number | null;
          connection_type: string | null;
          created_at: string | null;
          from_note_id: string;
          id: string;
          is_ai_suggested: boolean | null;
          strength: number | null;
          to_note_id: string;
        };
        Insert: {
          ai_confidence?: number | null;
          connection_type?: string | null;
          created_at?: string | null;
          from_note_id: string;
          id?: string;
          is_ai_suggested?: boolean | null;
          strength?: number | null;
          to_note_id: string;
        };
        Update: {
          ai_confidence?: number | null;
          connection_type?: string | null;
          created_at?: string | null;
          from_note_id?: string;
          id?: string;
          is_ai_suggested?: boolean | null;
          strength?: number | null;
          to_note_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'note_connections_from_note_id_fkey';
            columns: ['from_note_id'];
            isOneToOne: false;
            referencedRelation: 'notes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'note_connections_to_note_id_fkey';
            columns: ['to_note_id'];
            isOneToOne: false;
            referencedRelation: 'notes';
            referencedColumns: ['id'];
          },
        ];
      };
      note_tags: {
        Row: {
          created_at: string | null;
          note_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string | null;
          note_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string | null;
          note_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'note_tags_note_id_fkey';
            columns: ['note_id'];
            isOneToOne: false;
            referencedRelation: 'notes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'note_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      notes: {
        Row: {
          ai_category_id: string | null;
          ai_confidence: number | null;
          ai_keywords: string[] | null;
          ai_processed_at: string | null;
          ai_summary: string | null;
          archived_at: string | null;
          attachments: Json | null;
          content: string;
          content_length: number | null;
          content_type: Database['public']['Enums']['note_type'] | null;
          created_at: string | null;
          embedding: string | null;
          id: string;
          is_favorite: boolean | null;
          is_pinned: boolean | null;
          last_reminded_at: string | null;
          metadata: Json | null;
          remind_at: string | null;
          reminded_count: number | null;
          status: Database['public']['Enums']['note_status'] | null;
          title: string | null;
          tsv: unknown | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          ai_category_id?: string | null;
          ai_confidence?: number | null;
          ai_keywords?: string[] | null;
          ai_processed_at?: string | null;
          ai_summary?: string | null;
          archived_at?: string | null;
          attachments?: Json | null;
          content: string;
          content_length?: number | null;
          content_type?: Database['public']['Enums']['note_type'] | null;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          is_favorite?: boolean | null;
          is_pinned?: boolean | null;
          last_reminded_at?: string | null;
          metadata?: Json | null;
          remind_at?: string | null;
          reminded_count?: number | null;
          status?: Database['public']['Enums']['note_status'] | null;
          title?: string | null;
          tsv?: unknown | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          ai_category_id?: string | null;
          ai_confidence?: number | null;
          ai_keywords?: string[] | null;
          ai_processed_at?: string | null;
          ai_summary?: string | null;
          archived_at?: string | null;
          attachments?: Json | null;
          content?: string;
          content_length?: number | null;
          content_type?: Database['public']['Enums']['note_type'] | null;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          is_favorite?: boolean | null;
          is_pinned?: boolean | null;
          last_reminded_at?: string | null;
          metadata?: Json | null;
          remind_at?: string | null;
          reminded_count?: number | null;
          status?: Database['public']['Enums']['note_status'] | null;
          title?: string | null;
          tsv?: unknown | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          last_active_at: string | null;
          settings: Json | null;
          total_connections: number | null;
          total_notes: number | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          last_active_at?: string | null;
          settings?: Json | null;
          total_connections?: number | null;
          total_notes?: number | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          last_active_at?: string | null;
          settings?: Json | null;
          total_connections?: number | null;
          total_notes?: number | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          slug: string;
          usage_count: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          slug: string;
          usage_count?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          usage_count?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tags_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_stats: {
        Row: {
          avg_daily_notes: number | null;
          last_note_at: string | null;
          most_active_hour: number | null;
          notes_created_month: number | null;
          notes_created_today: number | null;
          notes_created_week: number | null;
          streak_days: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          avg_daily_notes?: number | null;
          last_note_at?: string | null;
          most_active_hour?: number | null;
          notes_created_month?: number | null;
          notes_created_today?: number | null;
          notes_created_week?: number | null;
          streak_days?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          avg_daily_notes?: number | null;
          last_note_at?: string | null;
          most_active_hour?: number | null;
          notes_created_month?: number | null;
          notes_created_today?: number | null;
          notes_created_week?: number | null;
          streak_days?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_stats_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      binary_quantize: {
        Args: { '': string } | { '': unknown };
        Returns: unknown;
      };
      gtrgm_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: { '': unknown };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      halfvec_avg: {
        Args: { '': number[] };
        Returns: unknown;
      };
      halfvec_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      halfvec_send: {
        Args: { '': unknown };
        Returns: string;
      };
      halfvec_typmod_in: {
        Args: { '': unknown[] };
        Returns: number;
      };
      hnsw_bit_support: {
        Args: { '': unknown };
        Returns: unknown;
      };
      hnsw_halfvec_support: {
        Args: { '': unknown };
        Returns: unknown;
      };
      hnsw_sparsevec_support: {
        Args: { '': unknown };
        Returns: unknown;
      };
      hnswhandler: {
        Args: { '': unknown };
        Returns: unknown;
      };
      ivfflat_bit_support: {
        Args: { '': unknown };
        Returns: unknown;
      };
      ivfflat_halfvec_support: {
        Args: { '': unknown };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: { '': unknown };
        Returns: unknown;
      };
      json_matches_schema: {
        Args: { instance: Json; schema: Json };
        Returns: boolean;
      };
      jsonb_matches_schema: {
        Args: { schema: Json; instance: Json };
        Returns: boolean;
      };
      jsonschema_is_valid: {
        Args: { schema: Json };
        Returns: boolean;
      };
      jsonschema_validation_errors: {
        Args: { instance: Json; schema: Json };
        Returns: string[];
      };
      l2_norm: {
        Args: { '': unknown } | { '': unknown };
        Returns: number;
      };
      l2_normalize: {
        Args: { '': string } | { '': unknown } | { '': unknown };
        Returns: string;
      };
      set_limit: {
        Args: { '': number };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: { '': string };
        Returns: string[];
      };
      sparsevec_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      sparsevec_send: {
        Args: { '': unknown };
        Returns: string;
      };
      sparsevec_typmod_in: {
        Args: { '': unknown[] };
        Returns: number;
      };
      vector_avg: {
        Args: { '': number[] };
        Returns: string;
      };
      vector_dims: {
        Args: { '': string } | { '': unknown };
        Returns: number;
      };
      vector_norm: {
        Args: { '': string };
        Returns: number;
      };
      vector_out: {
        Args: { '': string };
        Returns: unknown;
      };
      vector_send: {
        Args: { '': string };
        Returns: string;
      };
      vector_typmod_in: {
        Args: { '': unknown[] };
        Returns: number;
      };
    };
    Enums: {
      note_status: 'active' | 'archived' | 'deleted';
      note_type: 'text' | 'voice' | 'image' | 'mixed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      note_status: ['active', 'archived', 'deleted'],
      note_type: ['text', 'voice', 'image', 'mixed'],
    },
  },
} as const;
