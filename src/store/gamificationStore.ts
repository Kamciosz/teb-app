import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { UserProfile } from '../types';

interface GamificationState {
  ranking: UserProfile[];
  currentUser: UserProfile | null;
  loading: boolean;
  fetchRanking: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  ranking: [],
  currentUser: null,
  loading: false,

  fetchRanking: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false })
      .limit(50);

    if (!error && data) {
      set({ ranking: data as any });
    }
    set({ loading: false });
  },

  fetchCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      set({ currentUser: data as any });
    }
  },
}));
