import { useState } from 'react';
import { useMarketStore } from '../../store/marketStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { toast } from 'react-hot-toast';

export const CreateItemForm = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { createItem } = useMarketStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error('Dodaj zdjęcie przedmiotu');
      return;
    }
    setLoading(true);

    const { error } = await createItem({
      title,
      description,
      price: Number(price),
    }, image);

    if (error) {
      toast.error('Błąd podczas dodawania ogłoszenia');
    } else {
      toast.success('Ogłoszenie dodane!');
      onClose();
    }
    setLoading(false);
  };

  return (
    <Card className="mb-6">
      <h2 className="text-xl font-bold mb-4">Sprzedaj coś</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Nazwa przedmiotu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Opis stanu, uwagi..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Cena (PLN)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zdjęcie</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Anuluj
          </Button>
          <Button type="submit" isLoading={loading} className="flex-1">
            Dodaj ogłoszenie
          </Button>
        </div>
      </form>
    </Card>
  );
};
