import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Post } from '../types';

interface FeedState {
  posts: Post[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'created_at' | 'upvotes' | 'downvotes' | 'author_id'>) => Promise<{ error: any }>;
  votePost: (postId: string, type: 'up' | 'down') => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  loading: false,

  fetchPosts: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('feed_posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ posts: data as any }); // Type assertion needed due to join
    }
    set({ loading: false });
  },

  createPost: async (newPost) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
      .from('feed_posts')
      .insert({
        ...newPost,
        author_id: user.id,
      });

    if (!error) {
      get().fetchPosts();
    }
    return { error };
  },

  votePost: async (postId, type) => {
    // Optimistic update
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            [type === 'up' ? 'upvotes' : 'downvotes']: post[type === 'up' ? 'upvotes' : 'downvotes'] + 1,
          };
        }
        return post;
      }),
    }));

    // RPC call would be better here to handle concurrency, but simple update for now
    const post = get().posts.find((p) => p.id === postId);
    if (!post) return;

    await supabase
      .from('feed_posts')
      .update({
        [type === 'up' ? 'upvotes' : 'downvotes']: post[type === 'up' ? 'upvotes' : 'downvotes'],
      })
      .eq('id', postId);
  },
}));
