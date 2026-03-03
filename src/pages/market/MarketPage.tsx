import { useEffect, useState } from 'react';
import { useMarketStore } from '../../store/marketStore';
import { MarketItemCard } from '../../components/market/MarketItemCard';
import { CreateItemForm } from '../../components/market/CreateItemForm';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export default function MarketPage() {
  const { items, loading, fetchItems } = useMarketStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading && items.length === 0) {
    return <div className="p-4 text-center">Ładowanie...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Re-wear Market</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={20} className="mr-1" />
            Dodaj ogłoszenie
          </Button>
        )}
      </div>

      {showForm && <CreateItemForm onClose={() => setShowForm(false)} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MarketItemCard key={item.id} item={item} />
        ))}
      </div>
      
      {items.length === 0 && !showForm && (
        <div className="text-center text-gray-500 py-12">
          Brak ogłoszeń. Bądź pierwszy!
        </div>
      )}
    </div>
  );
}
