import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { ChatMessage } from '../types';
import { filterText } from '../utils/wordFilter';

interface ChatGroup {
  id: string;
  name: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
}

interface ChatState {
  groups: ChatGroup[];
  messages: ChatMessage[];
  currentGroupId: string | null;
  loading: boolean;
  fetchGroups: () => Promise<void>;
  selectGroup: (groupId: string) => Promise<void>;
  sendMessage: (content: string, imageFile?: File) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  createGroup: (name: string) => Promise<{ error: any; data?: ChatGroup }>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  groups: [],
  messages: [],
  currentGroupId: null,
  loading: false,

  fetchGroups: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('chat_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ groups: data as any });
    }
    set({ loading: false });
  },

  selectGroup: async (groupId: string) => {
    get().unsubscribeFromMessages();
    set({ currentGroupId: groupId, loading: true });
    
    const { data, error } = await supabase
      .from('chat_group_messages')
      .select(`
        *,
        sender:profiles(full_name, avatar_url)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      set({ messages: data as any });
      get().subscribeToMessages();
    }
    set({ loading: false });
  },

  createGroup: async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('chat_groups')
      .insert({ name, created_by: user.id })
      .select()
      .single();

    if (data) {
      set((state) => ({ groups: [data as any, ...state.groups] }));
    }

    return { error, data: data as any };
  },

  sendMessage: async (content: string, imageFile?: File) => {
    const { currentGroupId } = get();
    const { data: { user } } = await supabase.auth.getUser();

    if (!currentGroupId || !user) return;

    // Apply word filter
    const filteredContent = filterText(content);

    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('chat-images')
        .upload(fileName, imageFile);

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('chat-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    await supabase
      .from('chat_group_messages')
      .insert({
        group_id: currentGroupId,
        sender_id: user.id,
        content: filteredContent,
        image_url: imageUrl,
      });
  },

  subscribeToMessages: () => {
    const { currentGroupId } = get();
    if (!currentGroupId) return;

    const channel = supabase
      .channel(`chat:${currentGroupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_group_messages',
          filter: `group_id=eq.${currentGroupId}`,
        },
        async (payload) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            sender: senderData
          } as ChatMessage;

          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
        }
      )
      .subscribe();
  },

  unsubscribeFromMessages: () => {
    supabase.removeAllChannels();
  },
}));
