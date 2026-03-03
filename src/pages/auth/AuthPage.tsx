import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

type AuthMode = 'signin-password' | 'signup' | 'magic-link';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin-password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signInWithOtp, signInWithPassword, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email.endsWith('@teb.edu.pl')) {
      toast.error('Wymagany adres email w domenie @teb.edu.pl');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (mode === 'magic-link') {
        result = await signInWithOtp(email);
        if (!result.error) {
          setSubmitted(true);
          toast.success('Link do logowania został wysłany!');
        }
      } else if (mode === 'signin-password') {
        result = await signInWithPassword(email, password);
        if (!result.error) {
          toast.success('Zalogowano pomyślnie!');
        }
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          toast.error('Hasła nie są identyczne');
          setLoading(false);
          return;
        }
        if (!fullName.trim()) {
          toast.error('Imię i nazwisko jest wymagane');
          setLoading(false);
          return;
        }
        result = await signUp(email, password, fullName);
        if (!result.error) {
          setSubmitted(true);
          toast.success('Sprawdź email, aby potwierdzić rejestrację!');
        }
      }

      if (result?.error) {
        toast.error(result.error.message || 'Wystąpił błąd');
      }
    } catch (error: any) {
      toast.error('Wystąpił nieoczekiwany błąd');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
            {mode === 'signup' 
              ? 'Wysłaliśmy link potwierdzający rejestrację.' 
              : 'Wysłaliśmy link logowania.'}
            <br />
            Sprawdź adres <strong>{email}</strong>.
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
          <p className="text-gray-600">
            {mode === 'signup' ? 'Zarejestruj konto' : 'Zaloguj się'}
          </p>
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
          
          {mode === 'signup' && (
            <Input
              type="text"
              label="Imię i nazwisko"
              placeholder="Jan Kowalski"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              required
            />
          )}

          {mode !== 'magic-link' && (
            <Input
              type="password"
              label="Hasło"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          )}

          {mode === 'signup' && (
            <Input
              type="password"
              label="Potwierdź hasło"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          )}
          
          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            {mode === 'signup' ? 'Zarejestruj się' : 'Zaloguj się'}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-center text-sm">
          {mode === 'signin-password' && (
            <>
              <button 
                onClick={() => setMode('signup')}
                className="text-blue-600 hover:underline"
              >
                Nie masz konta? Zarejestruj się
              </button>
              <button 
                onClick={() => setMode('magic-link')}
                className="text-gray-500 hover:underline"
              >
                Zaloguj się przez link e-mail (Magic Link)
              </button>
            </>
          )}

          {mode === 'signup' && (
            <button 
              onClick={() => setMode('signin-password')}
              className="text-blue-600 hover:underline"
            >
              Masz już konto? Zaloguj się
            </button>
          )}

          {mode === 'magic-link' && (
            <button 
              onClick={() => setMode('signin-password')}
              className="text-blue-600 hover:underline"
            >
              Wróć do logowania hasłem
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Dostęp tylko dla uczniów i pracowników TEB Edukacja.</p>
        </div>
      </Card>
    </div>
  );
}
