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
      clothing_items: {
        Row: {
          accessories: string[] | null
          ai_analysis: Json | null
          brand: string | null
          button_count: string | null
          category: string
          closure_type: string | null
          collar: string | null
          color_tone: string | null
          confidence: number | null
          context_tags: string[] | null
          created_at: string | null
          cuff_style: string | null
          design_details: string[] | null
          fit: string | null
          has_lining: boolean | null
          hem_style: string | null
          id: string
          image_description: string | null
          image_url: string
          is_favorite: boolean | null
          lapel_style: string | null
          material: string | null
          name: string
          neckline: string | null
          occasions: string[] | null
          pattern: string | null
          pattern_type: string | null
          pocket_style: string | null
          primary_color: string | null
          prompt_description: string | null
          purchase_price: number | null
          seasons: string[] | null
          secondary_colors: string[] | null
          size_info: string | null
          sleeve: string | null
          style_tags: string[] | null
          subcategory: string | null
          updated_at: string | null
          user_id: string
          user_notes: string | null
          waist_style: string | null
          wear_count: number | null
        }
        Insert: {
          accessories?: string[] | null
          ai_analysis?: Json | null
          brand?: string | null
          button_count?: string | null
          category: string
          closure_type?: string | null
          collar?: string | null
          color_tone?: string | null
          confidence?: number | null
          context_tags?: string[] | null
          created_at?: string | null
          cuff_style?: string | null
          design_details?: string[] | null
          fit?: string | null
          has_lining?: boolean | null
          hem_style?: string | null
          id?: string
          image_description?: string | null
          image_url: string
          is_favorite?: boolean | null
          lapel_style?: string | null
          material?: string | null
          name: string
          neckline?: string | null
          occasions?: string[] | null
          pattern?: string | null
          pattern_type?: string | null
          pocket_style?: string | null
          primary_color?: string | null
          prompt_description?: string | null
          purchase_price?: number | null
          seasons?: string[] | null
          secondary_colors?: string[] | null
          size_info?: string | null
          sleeve?: string | null
          style_tags?: string[] | null
          subcategory?: string | null
          updated_at?: string | null
          user_id: string
          user_notes?: string | null
          waist_style?: string | null
          wear_count?: number | null
        }
        Update: {
          accessories?: string[] | null
          ai_analysis?: Json | null
          brand?: string | null
          button_count?: string | null
          category?: string
          closure_type?: string | null
          collar?: string | null
          color_tone?: string | null
          confidence?: number | null
          context_tags?: string[] | null
          created_at?: string | null
          cuff_style?: string | null
          design_details?: string[] | null
          fit?: string | null
          has_lining?: boolean | null
          hem_style?: string | null
          id?: string
          image_description?: string | null
          image_url?: string
          is_favorite?: boolean | null
          lapel_style?: string | null
          material?: string | null
          name?: string
          neckline?: string | null
          occasions?: string[] | null
          pattern?: string | null
          pattern_type?: string | null
          pocket_style?: string | null
          primary_color?: string | null
          prompt_description?: string | null
          purchase_price?: number | null
          seasons?: string[] | null
          secondary_colors?: string[] | null
          size_info?: string | null
          sleeve?: string | null
          style_tags?: string[] | null
          subcategory?: string | null
          updated_at?: string | null
          user_id?: string
          user_notes?: string | null
          waist_style?: string | null
          wear_count?: number | null
        }
        Relationships: []
      }
      fashion_facts: {
        Row: {
          category: string | null
          created_at: string
          fact: string
          id: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          fact: string
          id?: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          fact?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      outfits: {
        Row: {
          ai_styling_tips: string | null
          clothing_item_ids: string[] | null
          created_at: string | null
          id: string
          is_favorite: boolean | null
          is_saved: boolean | null
          last_worn: string | null
          name: string
          occasion: string | null
          saved_at: string | null
          time_of_day: string | null
          times_worn: number | null
          user_id: string
          user_rating: number | null
          weather_type: string | null
        }
        Insert: {
          ai_styling_tips?: string | null
          clothing_item_ids?: string[] | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          is_saved?: boolean | null
          last_worn?: string | null
          name: string
          occasion?: string | null
          saved_at?: string | null
          time_of_day?: string | null
          times_worn?: number | null
          user_id: string
          user_rating?: number | null
          weather_type?: string | null
        }
        Update: {
          ai_styling_tips?: string | null
          clothing_item_ids?: string[] | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          is_saved?: boolean | null
          last_worn?: string | null
          name?: string
          occasion?: string | null
          saved_at?: string | null
          time_of_day?: string | null
          times_worn?: number | null
          user_id?: string
          user_rating?: number | null
          weather_type?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          ad_bonus_generations: number | null
          ad_bonus_items: number | null
          body_measurements: Json | null
          created_at: string | null
          daily_outfit_generations: number | null
          full_name: string | null
          gender: string | null
          id: string
          last_ad_bonus_date: string | null
          last_generation_date: string | null
          location: string | null
          preferred_brands: string[] | null
          style_preferences: string[] | null
          subscription_type: string | null
          updated_at: string | null
        }
        Insert: {
          ad_bonus_generations?: number | null
          ad_bonus_items?: number | null
          body_measurements?: Json | null
          created_at?: string | null
          daily_outfit_generations?: number | null
          full_name?: string | null
          gender?: string | null
          id: string
          last_ad_bonus_date?: string | null
          last_generation_date?: string | null
          location?: string | null
          preferred_brands?: string[] | null
          style_preferences?: string[] | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Update: {
          ad_bonus_generations?: number | null
          ad_bonus_items?: number | null
          body_measurements?: Json | null
          created_at?: string | null
          daily_outfit_generations?: number | null
          full_name?: string | null
          gender?: string | null
          id?: string
          last_ad_bonus_date?: string | null
          last_generation_date?: string | null
          location?: string | null
          preferred_brands?: string[] | null
          style_preferences?: string[] | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
