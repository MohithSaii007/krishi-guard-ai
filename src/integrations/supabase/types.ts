export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_domains: {
        Row: {
          auto_renew: boolean
          created_at: string
          domain_name: string
          expires_at: string | null
          id: string
          nameservers: string[]
          order_item_id: string | null
          provider_reference: string | null
          registered_at: string | null
          registrar_provider: string
          status: Database["public"]["Enums"]["domain_registration_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          domain_name: string
          expires_at?: string | null
          id?: string
          nameservers?: string[]
          order_item_id?: string | null
          provider_reference?: string | null
          registered_at?: string | null
          registrar_provider?: string
          status?: Database["public"]["Enums"]["domain_registration_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          domain_name?: string
          expires_at?: string | null
          id?: string
          nameservers?: string[]
          order_item_id?: string | null
          provider_reference?: string | null
          registered_at?: string | null
          registrar_provider?: string
          status?: Database["public"]["Enums"]["domain_registration_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_domains_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: true
            referencedRelation: "domain_order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_dns_records: {
        Row: {
          created_at: string
          domain_id: string
          host: string
          id: string
          priority: number | null
          provider_reference: string | null
          record_type: string
          ttl: number
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          domain_id: string
          host: string
          id?: string
          priority?: number | null
          provider_reference?: string | null
          record_type: string
          ttl?: number
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          domain_id?: string
          host?: string
          id?: string
          priority?: number | null
          provider_reference?: string | null
          record_type?: string
          ttl?: number
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_dns_records_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "customer_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_order_items: {
        Row: {
          created_at: string
          domain_name: string
          id: string
          order_id: string
          provider_reference: string | null
          registration_status: Database["public"]["Enums"]["domain_registration_status"]
          renewal_price: number
          unit_price: number
          user_id: string
          years: number
        }
        Insert: {
          created_at?: string
          domain_name: string
          id?: string
          order_id: string
          provider_reference?: string | null
          registration_status?: Database["public"]["Enums"]["domain_registration_status"]
          renewal_price: number
          unit_price: number
          user_id: string
          years?: number
        }
        Update: {
          created_at?: string
          domain_name?: string
          id?: string
          order_id?: string
          provider_reference?: string | null
          registration_status?: Database["public"]["Enums"]["domain_registration_status"]
          renewal_price?: number
          unit_price?: number
          user_id?: string
          years?: number
        }
        Relationships: [
          {
            foreignKeyName: "domain_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "domain_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_orders: {
        Row: {
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          idempotency_key: string
          payment_reference: string | null
          status: Database["public"]["Enums"]["domain_order_status"]
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          idempotency_key: string
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["domain_order_status"]
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          idempotency_key?: string
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["domain_order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      domain_products: {
        Row: {
          created_at: string
          currency: string
          extension: string
          id: string
          is_active: boolean
          registration_price: number
          renewal_price: number
          transfer_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          extension: string
          id?: string
          is_active?: boolean
          registration_price: number
          renewal_price: number
          transfer_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          extension?: string
          id?: string
          is_active?: boolean
          registration_price?: number
          renewal_price?: number
          transfer_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      irrigation_events: {
        Row: {
          action: string
          created_at: string
          duration_minutes: number | null
          id: string
          soil_moisture: number | null
          source: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          soil_moisture?: number | null
          source?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          soil_moisture?: number | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          farm_name: string | null
          farm_size: string | null
          full_name: string
          id: string
          language: string
          main_crop: string | null
          mobile: string | null
          setup_complete: boolean
          soil_type: string | null
          state: string | null
          updated_at: string
          village: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          farm_name?: string | null
          farm_size?: string | null
          full_name?: string
          id: string
          language?: string
          main_crop?: string | null
          mobile?: string | null
          setup_complete?: boolean
          soil_type?: string | null
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          farm_name?: string | null
          farm_size?: string | null
          full_name?: string
          id?: string
          language?: string
          main_crop?: string | null
          mobile?: string | null
          setup_complete?: boolean
          soil_type?: string | null
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      sensor_devices: {
        Row: {
          connection: string
          created_at: string
          id: string
          last_seen: string | null
          name: string
          sensor_type: string
          status: string
          user_id: string
        }
        Insert: {
          connection?: string
          created_at?: string
          id?: string
          last_seen?: string | null
          name: string
          sensor_type: string
          status?: string
          user_id: string
        }
        Update: {
          connection?: string
          created_at?: string
          id?: string
          last_seen?: string | null
          name?: string
          sensor_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          humidity: number | null
          id: string
          nitrogen: number | null
          phosphorus: number | null
          potassium: number | null
          recorded_at: string
          soil_moisture: number | null
          soil_ph: number | null
          source: string
          temperature: number | null
          user_id: string
          water_level: number | null
        }
        Insert: {
          humidity?: number | null
          id?: string
          nitrogen?: number | null
          phosphorus?: number | null
          potassium?: number | null
          recorded_at?: string
          soil_moisture?: number | null
          soil_ph?: number | null
          source?: string
          temperature?: number | null
          user_id: string
          water_level?: number | null
        }
        Update: {
          humidity?: number | null
          id?: string
          nitrogen?: number | null
          phosphorus?: number | null
          potassium?: number | null
          recorded_at?: string
          soil_moisture?: number | null
          soil_ph?: number | null
          source?: string
          temperature?: number | null
          user_id?: string
          water_level?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["marketplace_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["marketplace_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["marketplace_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_marketplace_role: {
        Args: {
          _role: Database["public"]["Enums"]["marketplace_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      domain_order_status:
        | "draft"
        | "payment_pending"
        | "paid"
        | "registering"
        | "completed"
        | "failed"
        | "refunded"
      domain_registration_status:
        | "pending"
        | "active"
        | "expiring"
        | "expired"
        | "failed"
        | "transferring"
      marketplace_role: "admin" | "support" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      domain_order_status: [
        "draft",
        "payment_pending",
        "paid",
        "registering",
        "completed",
        "failed",
        "refunded",
      ],
      domain_registration_status: [
        "pending",
        "active",
        "expiring",
        "expired",
        "failed",
        "transferring",
      ],
      marketplace_role: ["admin", "support", "customer"],
    },
  },
} as const
