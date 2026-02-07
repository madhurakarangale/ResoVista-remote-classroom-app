import { Button } from "./ui/button";
import { 
  Home, 
  Video, 
  Gamepad2, 
  Settings, 
  Users,
  BookOpen,
  BarChart3,
  User,
  Beaker
} from "lucide-react";

interface BottomNavigationProps {
  currentScreen: string;
  userRole: 'student' | 'teacher' | 'admin';
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ currentScreen, userRole, onNavigate }: BottomNavigationProps) {
  const getNavItems = () => {
    switch (userRole) {
      case 'student':
        return [
          { id: 'student', icon: Home, label: 'Home' },
          { id: 'liveclass', icon: Video, label: 'Live Class' },
          { id: 'labs', icon: Beaker, label: 'Lab' },
          { id: 'games', icon: Gamepad2, label: 'Games' },
          { id: 'profile', icon: User, label: 'Profile' }
        ];
      case 'teacher':
        return [
          { id: 'teacher', icon: Home, label: 'Dashboard' },
          { id: 'liveclass', icon: Video, label: 'Live Class' },
          { id: 'materials', icon: BookOpen, label: 'Materials' },
          { id: 'students', icon: Users, label: 'Students' }
        ];
      case 'admin':
        return [
          { id: 'admin', icon: Home, label: 'Dashboard' },
          { id: 'users', icon: Users, label: 'Users' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 min-w-0 flex-1 h-auto py-2 px-1 ${
                isActive 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${isActive ? 'text-indigo-600' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}