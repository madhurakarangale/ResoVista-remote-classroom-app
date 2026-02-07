import { useState } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";
import { StudentDashboard } from "./components/StudentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { LiveClassInterface } from "./components/LiveClassInterface";
import { GamificationSection } from "./components/GamificationSection";
import { FeedbackComponent } from "./components/FeedbackComponent";
import { BottomNavigation } from "./components/BottomNavigation";
import { TodoListComponent } from "./components/TodoListComponent";
import { DocumentManager } from "./components/DocumentManager";
import { AttendanceSystem } from "./components/AttendanceSystem";
import { ExamQuizSystem } from "./components/ExamQuizSystem";
import { MarksResultsSheet } from "./components/MarksResultsSheet";
import { ChatCallSystem } from "./components/ChatCallSystem";
import { LabSimulators } from "./components/LabSimulators";
import { AIAssistant } from "./components/AIAssistant";
import { WhiteboardInterface } from "./components/WhiteboardInterface";
import { AdminNotificationCenter } from "./components/AdminNotificationCenter";
import { StudentNotificationCenter } from "./components/StudentNotificationCenter";
import logoImage from "figma:asset/338617c2b7ec5356fb321555f6e0695b4f0ae91b.png";

type UserRole = 'student' | 'teacher' | 'admin' | null;
type Screen = 'splash' | 'login' | 'student' | 'teacher' | 'admin' | 'liveclass' | 'games' | 'profile' | 'materials' | 'students' | 'users' | 'analytics' | 'settings' | 'notifications' | 'alerts' | 'feedback' | 'todo' | 'documents' | 'attendance' | 'exams' | 'results' | 'chat' | 'labs' | 'ai-assistant' | 'whiteboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: 'student' | 'teacher' | 'admin') => {
    setUserRole(role);
    setCurrentScreen(role);
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('login');
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen('login')} />;
        
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      
      case 'student':
        return <StudentDashboard onNavigate={handleNavigate} />;
      
      case 'teacher':
        return <TeacherDashboard onNavigate={handleNavigate} />;
      
      case 'admin':
        return <AdminPanel onNavigate={handleNavigate} />;
      
      case 'liveclass':
        return <LiveClassInterface userRole={userRole!} onNavigate={handleNavigate} />;
      
      case 'games':
        return <GamificationSection onNavigate={handleNavigate} />;
      
      case 'feedback':
        return <FeedbackComponent userRole={userRole!} onSubmit={(feedback) => console.log('Feedback submitted:', feedback)} />;
      
      case 'todo':
        return <TodoListComponent onNavigate={handleNavigate} />;
      
      case 'documents':
        return <DocumentManager userRole={userRole! as 'student' | 'teacher'} onNavigate={handleNavigate} />;
      
      case 'attendance':
        return <AttendanceSystem userRole={userRole! as 'teacher' | 'admin'} onNavigate={handleNavigate} />;
      
      case 'exams':
        return <ExamQuizSystem userRole={userRole! as 'student' | 'teacher'} onNavigate={handleNavigate} />;
      
      case 'results':
        return <MarksResultsSheet userRole={userRole!} onNavigate={handleNavigate} />;
      
      case 'chat':
        return <ChatCallSystem userRole={userRole! as 'student' | 'teacher'} onNavigate={handleNavigate} />;
      
      case 'labs':
        return <LabSimulators userRole={userRole! as 'student' | 'teacher'} onNavigate={handleNavigate} />;
      
      case 'ai-assistant':
        return <AIAssistant userRole={userRole! as 'teacher'} onNavigate={handleNavigate} />;
      
      case 'whiteboard':
        return <WhiteboardInterface userRole={userRole! as 'teacher' | 'student'} onNavigate={handleNavigate} />;
      
      case 'notifications':
        return userRole === 'admin' 
          ? <AdminNotificationCenter onNavigate={handleNavigate} />
          : <StudentNotificationCenter onNavigate={handleNavigate} />;
      
      case 'profile':
      case 'materials':
      case 'students':
      case 'users':
      case 'analytics':
      case 'settings':
      case 'alerts':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-xl text-gray-900 mb-2">
                {currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1)} Screen
              </h2>
              <p className="text-gray-600 mb-4">
                This screen is under development and will be available soon.
              </p>
              <button 
                onClick={() => handleNavigate(userRole!)}
                className="text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        );
      
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header for authenticated screens */}
      {userRole && currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'liveclass' && (
        <div className="bg-blue-600 shadow-lg border-b border-blue-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="ResoVista Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-white text-lg">ResoVista</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="text-sm text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="relative">
        {renderScreen()}
      </main>

      {/* Bottom Navigation - only show for authenticated users and not on splash, login or live class */}
      {userRole && currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'liveclass' && (
        <BottomNavigation 
          currentScreen={currentScreen}
          userRole={userRole}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}