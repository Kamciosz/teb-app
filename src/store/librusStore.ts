import { create } from 'zustand';

interface Grade {
  subject: string;
  grade: string | number;
  date: string;
  category?: string;
}

interface LibrusState {
  grades: Grade[];
  loading: boolean;
  connected: boolean;
  connectLibrus: (login: string, pass: string) => Promise<{ error: any }>;
  fetchGrades: () => Promise<void>;
}

export const useLibrusStore = create<LibrusState>((set) => ({
  grades: [],
  loading: false,
  connected: false, // In real app, check if user has linked account

  connectLibrus: async (login, pass) => {
    set({ loading: true });
    try {
      // Use relative path for Vercel Serverless Functions
      const API_URL = '/api/grades';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password: pass }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Librus');
      }

      const data = await response.json();
      set({ grades: data.grades, connected: true, loading: false });
      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return { error: { message: error.message } };
    }
  },

  fetchGrades: async () => {
    // Reuse connect logic or separate fetch
    // For this mock, connect does the fetch
  }
}));
