export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'student' | 'editor' | 'admin';
  points: number; // TebGąbki
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  author_id: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  chat_group_id?: string;
}

export interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  seller_id: string;
  created_at: string;
}
