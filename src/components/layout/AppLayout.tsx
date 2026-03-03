import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, ShoppingBag, BookOpen, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

export default function AppLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/chat', icon: MessageSquare, label: 'TEBtalk' },
    { path: '/market', icon: ShoppingBag, label: 'Re-wear' },
    { path: '/librus', icon: BookOpen, label: 'Librus' },
    { path: '/gamification', icon: Trophy, label: 'TebGąbki' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold">TEB-App</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex flex-col items-center p-2 rounded-lg transition-colors',
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-400'
              )}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
