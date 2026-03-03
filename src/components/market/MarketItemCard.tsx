import { Card } from '../ui/Card';
import { MarketItem } from '../../types';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

interface MarketItemCardProps {
  item: MarketItem;
}

export const MarketItemCard = ({ item }: MarketItemCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden rounded-t-xl -mx-5 -mt-5 mb-4">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-bold shadow-sm">
          {item.price} PLN
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
          <span>{item.seller?.full_name || 'Sprzedawca'}</span>
          <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: pl })}</span>
        </div>
      </div>

      <Button className="w-full mt-4" size="sm">
        Napisz do sprzedawcy
      </Button>
    </Card>
  );
};
