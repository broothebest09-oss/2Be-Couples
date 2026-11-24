import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SupabaseProfile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  couple_id?: string;
}

export interface SupabaseCouple {
  id: string;
  invite_code: string;
  user1_id: string;
  user2_id?: string;
  user1_name: string;
  user2_name?: string;
  status: 'pending' | 'paired' | 'dissolved';
  paired_at?: string;
}

export interface SupabaseMessage {
  id: string;
  couple_id: string;
  sender_id: string;
  text?: string;
  type: string;
  media_url?: string;
  created_at: string;
}

export const supabaseService = {
  isConfigured: () => isSupabaseConfigured,

  /**
   * Send a real 6-digit OTP code to the user's email address
   */
  async sendEmailOtp(email: string) {
    if (!isSupabaseConfigured) {
      console.warn('[Supabase] Credentials not configured. Simulating code dispatch.');
      return { success: true, simulated: true };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('[Supabase Auth Error]', error);
      throw error;
    }

    return { success: true, simulated: false };
  },

  /**
   * Verify the 6-digit OTP code entered by the user
   */
  async verifyEmailOtp(email: string, token: string) {
    if (!isSupabaseConfigured) {
      console.warn('[Supabase] Credentials not configured. Local verification.');
      return { user: { id: 'local-user', email }, session: null };
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      console.error('[Supabase Verify Error]', error);
      throw error;
    }

    return { user: data.user, session: data.session };
  },

  /**
   * Create or update user profile
   */
  async upsertProfile(userId: string, displayName: string, email: string) {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        display_name: displayName,
        email,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) console.error('[Supabase Profile Upsert Error]', error);
    return data;
  },

  /**
   * Phone 1: Create an invite code in Supabase
   */
  async createCoupleInvite(userId: string, userName: string, inviteCode: string) {
    if (!isSupabaseConfigured) {
      return {
        id: 'local-couple',
        invite_code: inviteCode,
        user1_id: userId,
        user1_name: userName,
        status: 'pending' as const,
      };
    }

    const { data, error } = await supabase
      .from('couples')
      .insert({
        invite_code: inviteCode,
        user1_id: userId,
        user1_name: userName,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Create Couple Error]', error);
      throw error;
    }

    return data as SupabaseCouple;
  },

  /**
   * Phone 2: Enter invite code to pair with Phone 1
   */
  async joinCoupleByInvite(userId: string, userName: string, inviteCode: string) {
    if (!isSupabaseConfigured) {
      return { success: true, partnerName: 'Partner' };
    }

    // 1. Find pending couple by invite code
    const { data: couple, error: findError } = await supabase
      .from('couples')
      .select('*')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .eq('status', 'pending')
      .single();

    if (findError || !couple) {
      throw new Error('Invalid or expired invite code. Please check with your partner.');
    }

    // 2. Update couple to paired
    const { data: updated, error: updateError } = await supabase
      .from('couples')
      .update({
        user2_id: userId,
        user2_name: userName,
        status: 'paired',
        paired_at: new Date().toISOString(),
      })
      .eq('id', couple.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return {
      success: true,
      couple: updated as SupabaseCouple,
      partnerName: couple.user1_name,
      partnerId: couple.user1_id,
    };
  },

  /**
   * Phone 1 listens for Phone 2 joining via Realtime
   */
  subscribeToPairing(coupleId: string, onPaired: (couple: SupabaseCouple) => void) {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel(`couple-${coupleId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'couples',
          filter: `id=eq.${coupleId}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.status === 'paired') {
            onPaired(payload.new as SupabaseCouple);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Send a real-time message to the couple's chat
   */
  async sendMessage(coupleId: string, senderId: string, text: string, type = 'text', mediaUrl?: string) {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        couple_id: coupleId,
        sender_id: senderId,
        text,
        type,
        media_url: mediaUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Send Message Error]', error);
      throw error;
    }

    return data as SupabaseMessage;
  },

  /**
   * Listen for incoming messages in real-time
   */
  subscribeToMessages(coupleId: string, onMessage: (msg: SupabaseMessage) => void) {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel(`messages-${coupleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload: any) => {
          if (payload.new) {
            onMessage(payload.new as SupabaseMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
