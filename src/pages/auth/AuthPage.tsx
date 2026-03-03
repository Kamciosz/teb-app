import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email.endsWith('@teb.edu.pl')) {
      toast.error('Wymagany adres email w domenie @teb.edu.pl');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email);

    if (error) {
      toast.error(error.message || 'Błąd logowania');
    } else {
      setSubmitted(true);
      toast.success('Link do logowania został wysłany!');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <div className="mb-4 text-green-500">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Sprawdź swoją skrzynkę</h2>
          <p className="text-gray-600 mb-6">
            Wysłaliśmy link logowania na adres <strong>{email}</strong>.
            Kliknij go, aby zalogować się do aplikacji.
          </p>
          <Button
            variant="outline"
            onClick={() => setSubmitted(false)}
            className="w-full"
          >
            Wróć do logowania
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">TEB-App</h1>
          <p className="text-gray-600">Zaloguj się kontem szkolnym</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email szkolny"
            placeholder="imie.nazwisko@teb.edu.pl"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            autoFocus
          />
          
          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Zaloguj się
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Dostęp tylko dla uczniów i pracowników TEB Edukacja.</p>
        </div>
      </Card>
    </div>
  );
}
