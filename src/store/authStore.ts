import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<{ error: any }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null, loading: false });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null, loading: false });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false });
    }
  },

  signInWithOtp: async (email: string) => {
    if (!email.endsWith('@teb.edu.pl')) {
      return { error: { message: 'Dostęp tylko dla adresów @teb.edu.pl' } };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    return { error };
  },

  signInWithPassword: async (email, password) => {
    if (!email.endsWith('@teb.edu.pl')) {
      return { error: { message: 'Dostęp tylko dla adresów @teb.edu.pl' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.session) {
      set({ session: data.session, user: data.user });
    }

    return { error };
  },

  signUp: async (email, password) => {
    if (!email.endsWith('@teb.edu.pl')) {
      return { error: { message: 'Dostęp tylko dla adresów @teb.edu.pl' } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    return { error, data };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
