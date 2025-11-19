import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'basic' | 'pro' | 'premium';
          token_balance: number;
          total_tokens_purchased: number;
          total_tokens_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'basic' | 'pro' | 'premium';
          token_balance?: number;
          total_tokens_purchased?: number;
          total_tokens_used?: number;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'basic' | 'pro' | 'premium';
          token_balance?: number;
          total_tokens_purchased?: number;
          total_tokens_used?: number;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: 'basic' | 'pro' | 'premium';
          status: 'active' | 'canceled' | 'past_due' | 'expired';
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          tokens_per_month: number;
          price_monthly: number;
          created_at: string;
          updated_at: string;
        };
      };
      token_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'purchase' | 'usage' | 'refill' | 'bonus' | 'refund';
          amount: number;
          balance_after: number;
          description: string;
          generation_id: string | null;
          payment_id: string | null;
          metadata: Record<string, any> | null;
          created_at: string;
        };
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          type: 'image' | 'video';
          prompt: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          result_url: string | null;
          thumbnail_url: string | null;
          tokens_used: number;
          n8n_webhook_id: string | null;
          error_message: string | null;
          metadata: Record<string, any> | null;
          is_favorite: boolean;
          is_public: boolean;
          public_share_id: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          type: 'image' | 'video';
          prompt: string;
          tokens_used: number;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          metadata?: Record<string, any> | null;
        };
        Update: {
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          result_url?: string | null;
          thumbnail_url?: string | null;
          error_message?: string | null;
          completed_at?: string | null;
          is_favorite?: boolean;
          is_public?: boolean;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          stripe_payment_intent_id: string;
          stripe_invoice_id: string | null;
          amount: number;
          currency: string;
          status: 'pending' | 'succeeded' | 'failed' | 'refunded';
          payment_type: 'subscription' | 'token_purchase' | 'upgrade';
          tokens_credited: number | null;
          subscription_id: string | null;
          metadata: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
