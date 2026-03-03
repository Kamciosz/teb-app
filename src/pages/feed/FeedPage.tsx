import { useEffect } from 'react';
import { useFeedStore } from '../../store/feedStore';
import { PostCard } from '../../components/feed/PostCard';
import { CreatePostForm } from '../../components/feed/CreatePostForm';
import { useAuthStore } from '../../store/authStore';

export default function FeedPage() {
  const { posts, loading, fetchPosts } = useFeedStore();
  const { user } = useAuthStore();
  
  // TODO: Check if user is editor/admin
  const canCreatePost = true; // Placeholder

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading && posts.length === 0) {
    return <div className="p-4 text-center">Ładowanie...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {canCreatePost && <CreatePostForm />}
      
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {posts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Brak postów do wyświetlenia.
          </div>
        )}
      </div>
    </div>
  );
}
