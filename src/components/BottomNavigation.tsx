
import { useLocation, Link } from 'react-router-dom';
import { Home, Shirt, Sparkles, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Ana Sayfa' },
    { path: '/wardrobe', icon: Shirt, label: 'Gardırop' },
    { path: '/outfits', icon: Sparkles, label: 'Kombinler' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-all duration-200 ${
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              <Icon 
                className={`h-5 w-5 md:h-6 md:w-6 mb-1 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} 
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span className={`text-xs font-medium ${isActive ? 'text-blue-500' : 'text-gray-500'} truncate`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
