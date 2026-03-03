import { useState } from 'react';
import { useFeedStore } from '../../store/feedStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { toast } from 'react-hot-toast';

export const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { createPost } = useFeedStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await createPost({
      title,
      content,
      image_url: imageUrl,
    });

    if (error) {
      toast.error('Błąd podczas dodawania posta');
    } else {
      toast.success('Post dodany!');
      setTitle('');
      setContent('');
      setImageUrl('');
    }
    setLoading(false);
  };

  return (
    <Card className="mb-4">
      <h2 className="text-xl font-bold mb-4">Dodaj nowy wpis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Tytuł posta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Treść posta..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Input
          placeholder="URL obrazka (opcjonalnie)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Opublikuj
        </Button>
      </form>
    </Card>
  );
};
