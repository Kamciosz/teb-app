import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { MarketItem } from '../types';
import imageCompression from 'browser-image-compression';

interface MarketState {
  items: MarketItem[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  createItem: (item: Omit<MarketItem, 'id' | 'created_at' | 'seller_id' | 'image_url'>, imageFile: File) => Promise<{ error: any }>;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  items: [],
  loading: false,

  fetchItems: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('market_items')
      .select(`
        *,
        seller:profiles(full_name, avatar_url)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ items: data as any });
    }
    set({ loading: false });
  },

  createItem: async (item, imageFile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    // Compress image
    const options = {
      maxSizeMB: 0.1, // ~100KB
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    let compressedFile = imageFile;
    try {
      compressedFile = await imageCompression(imageFile, options);
    } catch (error) {
      console.error('Image compression error:', error);
      // Fallback to original file if compression fails, or handle error
    }

    // Upload image
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('market-images')
      .upload(fileName, compressedFile);

    if (uploadError) return { error: uploadError };

    const { data: publicUrlData } = supabase.storage
      .from('market-images')
      .getPublicUrl(fileName);
    const imageUrl = publicUrlData.publicUrl;

    // Create item record
    const { error } = await supabase
      .from('market_items')
      .insert({
        ...item,
        seller_id: user.id,
        image_url: imageUrl,
      });

    if (!error) {
      get().fetchItems();
    }
    return { error };
  },
}));
