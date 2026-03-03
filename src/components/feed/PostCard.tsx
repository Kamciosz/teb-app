import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Post } from '../../types';
import { useFeedStore } from '../../store/feedStore';

interface PostCardProps {
  post: Post & { author?: { full_name: string; avatar_url?: string } };
}

export const PostCard = ({ post }: PostCardProps) => {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const { votePost } = useFeedStore();

  const handleVote = (type: 'up' | 'down') => {
    if (voted === type) return;
    setVoted(type);
    votePost(post.id, type);
  };

  return (
    <Card className="mb-4">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
          {post.author?.avatar_url ? (
            <img src={post.author.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 font-bold">{post.author?.full_name?.charAt(0) || '?'}</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{post.author?.full_name || 'Użytkownik'}</h3>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: pl })}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.image_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img src={post.image_url} alt="Post content" className="w-full h-auto object-cover max-h-96" />
        </div>
      )}

      {post.video_url && (
        <div className="mb-4 rounded-lg overflow-hidden aspect-video">
          <iframe
            src={post.video_url.replace('watch?v=', 'embed/')}
            title="Video"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('up')}
            className={voted === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-500'}
          >
            <ThumbsUp size={18} className="mr-1" />
            {post.upvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('down')}
            className={voted === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-500'}
          >
            <ThumbsDown size={18} className="mr-1" />
            {post.downvotes}
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <MessageSquare size={18} className="mr-1" />
            0
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Share2 size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
