import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  BookOpen, 
  Video, 
  Clock, 
  Download, 
  Play, 
  Trophy, 
  Bell, 
  Calendar,
  FileText,
  Gamepad2,
  Wifi,
  WifiOff,
  AlertTriangle,
  Upload,
  FileImage,
  Beaker,
  Award,
  BarChart3
} from "lucide-react";

interface StudentDashboardProps {
  onNavigate: (screen: string) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [notifications] = useState([
    { id: 1, type: "warning", message: "Tab switch detected during Math Quiz", time: "2 min ago" },
    { id: 2, type: "info", message: "New lecture video available: Physics Ch.5", time: "1 hour ago" },
    { id: 3, type: "alert", message: "Upcoming exam: Chemistry - Tomorrow 2 PM", time: "3 hours ago" }
  ]);

  const upcomingClasses = [
    { id: 1, subject: "Mathematics", time: "10:00 AM", teacher: "Prof. Sharma", status: "live" },
    { id: 2, subject: "Physics", time: "2:00 PM", teacher: "Dr. Patel", status: "scheduled" },
    { id: 3, subject: "Chemistry", time: "4:00 PM", teacher: "Prof. Kumar", status: "scheduled" }
  ];

  const recentVideos = [
    { id: 1, title: "Calculus Basics", duration: "45 min", subject: "Math", progress: 75 },
    { id: 2, title: "Organic Chemistry", duration: "38 min", subject: "Chemistry", progress: 100 },
    { id: 3, title: "Wave Motion", duration: "52 min", subject: "Physics", progress: 25 }
  ];

  const offlineContent = [
    { id: 1, title: "Physics Notes Ch.1-5", size: "12 MB", downloaded: true },
    { id: 2, title: "Math Practice Sets", size: "8 MB", downloaded: false },
    { id: 3, title: "Chemistry Lab Manual", size: "15 MB", downloaded: true }
  ];

  const gameStats = {
    totalPoints: 2450,
    rank: 12,
    badges: 8,
    level: "Advanced"
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-indigo-900">Good morning, Priya!</h1>
              <p className="text-gray-600">Ready to learn today?</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-green-600">
                <Wifi className="w-4 h-4 mr-1" />
                <span className="text-sm">Online</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('notifications')}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Classes Today</p>
                  <p className="text-xl font-semibold">3</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Game Points</p>
                  <p className="text-xl font-semibold">{gameStats.totalPoints}</p>
                </div>
                <Trophy className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.slice(0, 2).map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  {notification.type === "warning" && <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />}
                  {notification.type === "info" && <Bell className="w-5 h-5 text-blue-500 mt-0.5" />}
                  {notification.type === "alert" && <Clock className="w-5 h-5 text-red-500 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Answer Sheet Upload - Quick Access */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center text-orange-900">
                  <Upload className="w-5 h-5 mr-2" />
                  Submit Answer Sheets
                </h3>
                <p className="text-orange-700 text-sm">Upload handwritten answer sheets for exams</p>
              </div>
              <Button 
                onClick={() => onNavigate('exams')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <FileImage className="w-4 h-4 mr-2" />
                Upload Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Live Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{classItem.subject}</p>
                    {classItem.status === "live" && (
                      <Badge variant="destructive" className="bg-red-500">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{classItem.teacher} • {classItem.time}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => onNavigate('liveclass')}
                  variant={classItem.status === "live" ? "default" : "outline"}
                  className={classItem.status === "live" ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  {classItem.status === "live" ? "Join Now" : "Schedule"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Lecture Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Continue Watching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentVideos.map((video) => (
              <div key={video.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{video.title}</p>
                  <p className="text-sm text-gray-600">{video.subject} • {video.duration}</p>
                  <Progress value={video.progress} className="mt-2 h-2" />
                  <p className="text-xs text-gray-500 mt-1">{video.progress}% complete</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Offline Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Offline Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {offlineContent.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.size}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant={item.downloaded ? "outline" : "default"}
                  disabled={item.downloaded}
                >
                  {item.downloaded ? "Downloaded" : "Download"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gamification Quick Access */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Learning Games
                </h3>
                <p className="text-purple-100 text-sm">Level: {gameStats.level} | Rank #{gameStats.rank}</p>
                <p className="text-purple-100 text-sm">Badges: {gameStats.badges}</p>
              </div>
              <Button 
                onClick={() => onNavigate('games')}
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Play Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Virtual Lab Simulators - Quick Access */}
        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center text-cyan-900">
                  <Beaker className="w-5 h-5 mr-2" />
                  Virtual Lab Simulators
                </h3>
                <p className="text-cyan-700 text-sm">Hands-on experiments • Earn certificates</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-xs text-cyan-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    1 Completed
                  </div>
                  <div className="flex items-center text-xs text-cyan-600">
                    <Award className="w-3 h-3 mr-1" />
                    2 Certificates
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => onNavigate('labs')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <Beaker className="w-4 h-4 mr-2" />
                Start Lab
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Marks & Results - Quick Access */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center text-indigo-900">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  My Marks & Results
                </h3>
                <p className="text-indigo-700 text-sm">View grades, report cards & performance</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-xs text-indigo-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    85% Avg
                  </div>
                  <div className="flex items-center text-xs text-indigo-600">
                    <Trophy className="w-3 h-3 mr-1" />
                    Rank #5
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => onNavigate('results')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}