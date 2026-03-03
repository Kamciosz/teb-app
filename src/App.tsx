import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import AuthPage from './pages/auth/AuthPage';
import FeedPage from './pages/feed/FeedPage';
import ChatPage from './pages/chat/ChatPage';
import MarketPage from './pages/market/MarketPage';
import LibrusPage from './pages/librus/LibrusPage';
import GamificationPage from './pages/gamification/GamificationPage';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Ładowanie...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<FeedPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="librus" element={<LibrusPage />} />
          <Route path="gamification" element={<GamificationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
