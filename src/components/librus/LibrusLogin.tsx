import { useState } from 'react';
import { useLibrusStore } from '../../store/librusStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from 'react-hot-toast';

export const LibrusLogin = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { connectLibrus } = useLibrusStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In real app, we would send these securely to our backend proxy
    // and store a token, not the password
    const { error } = await connectLibrus(login, password);
    
    if (error) {
      toast.error('Błąd połączenia z Librus: ' + error.message);
    } else {
      toast.success('Połączono z Librus!');
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-purple-700">Librus Proxy</h2>
        <p className="text-sm text-gray-500">Bezpieczny dostęp do ocen</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Login Librus"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <Input
          type="password"
          label="Hasło Librus"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={loading} className="w-full bg-purple-600 hover:bg-purple-700">
          Połącz konto
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">
          Twoje hasło jest przesyłane bezpośrednio do serwera proxy i nie jest zapisywane w bazie danych aplikacji.
        </p>
      </form>
    </Card>
  );
};
