import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Users, 
  Video, 
  Clock, 
  Upload, 
  Eye, 
  AlertTriangle,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  BookOpen,
  Monitor,
  CheckCircle,
  XCircle,
  Bot,
  Sparkles,
  PenTool
} from "lucide-react";

interface TeacherDashboardProps {
  onNavigate: (screen: string) => void;
}

export function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const [activeAlerts] = useState([
    { id: 1, student: "Raj Kumar", issue: "Tab switched 3 times", subject: "Mathematics", time: "2 min ago" },
    { id: 2, student: "Priya Sharma", issue: "Webcam covered", subject: "Physics", time: "5 min ago" },
    { id: 3, student: "Amit Singh", issue: "Multiple tab switches", subject: "Chemistry", time: "8 min ago" }
  ]);

  const todayClasses = [
    { id: 1, subject: "Mathematics", time: "10:00 AM", students: 45, status: "live", duration: "1h 30m" },
    { id: 2, subject: "Physics", time: "2:00 PM", students: 38, status: "scheduled", duration: "1h 15m" },
    { id: 3, subject: "Chemistry Lab", time: "4:00 PM", students: 25, status: "scheduled", duration: "2h" }
  ];

  const recentUploads = [
    { id: 1, title: "Calculus Assignment Solutions", type: "PDF", uploadDate: "Today", views: 28 },
    { id: 2, title: "Physics Experiment Video", type: "Video", uploadDate: "Yesterday", views: 42 },
    { id: 3, title: "Chemistry Practice Questions", type: "PDF", uploadDate: "2 days ago", views: 35 }
  ];

  const studentMetrics = {
    totalStudents: 108,
    activeNow: 45,
    attendanceToday: 85,
    averageEngagement: 78
  };

  const upcomingExams = [
    { id: 1, subject: "Mathematics", date: "Tomorrow", time: "10:00 AM", students: 45, status: "ready" },
    { id: 2, subject: "Physics", date: "Dec 20", time: "2:00 PM", students: 38, status: "draft" },
    { id: 3, subject: "Chemistry", date: "Dec 22", time: "11:00 AM", students: 42, status: "ready" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-indigo-900">Welcome back, Prof. Sharma!</h1>
              <p className="text-gray-600">Manage your classes and students</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('alerts')}
                className="relative"
              >
                <AlertTriangle className="w-5 h-5" />
                {activeAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {activeAlerts.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
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
                  <p className="text-blue-100">Students Online</p>
                  <p className="text-xl font-semibold">{studentMetrics.activeNow}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Today's Attendance</p>
                  <p className="text-xl font-semibold">{studentMetrics.attendanceToday}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Teaching Assistant - Prominent Feature */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center text-xl font-semibold mb-2">
                  <Bot className="w-6 h-6 mr-3" />
                  AI Teaching Assistant
                </h3>
                <p className="text-purple-100 mb-4">
                  Generate study notes, create summaries, and get help with teaching doubts instantly
                </p>
                <div className="flex items-center space-x-4 text-sm text-purple-100">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Smart Content Generation
                  </div>
                  <div className="flex items-center">
                    <PenTool className="w-4 h-4 mr-1" />
                    Instant Notes Creation
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onNavigate('ai-assistant')}
                className="bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-semibold px-6 py-3"
              >
                <Bot className="w-4 h-4 mr-2" />
                Use AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Monitoring Alerts */}
        {activeAlerts.length > 0 && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <Monitor className="w-5 h-5 mr-2" />
                Live Monitoring Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-900">{alert.student}</p>
                      <p className="text-sm text-orange-700">{alert.issue} in {alert.subject}</p>
                      <p className="text-xs text-orange-600">{alert.time}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-orange-700 border-orange-300">
                    Review
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayClasses.map((classItem) => (
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
                  <p className="text-sm text-gray-600">
                    {classItem.time} • {classItem.students} students • {classItem.duration}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {classItem.status === "live" ? (
                    <Button size="sm" onClick={() => onNavigate('liveclass')} className="bg-red-500 hover:bg-red-600">
                      Join Class
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      Start Class
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <Upload className="w-8 h-8 mx-auto text-blue-600" />
                <p className="font-medium">Upload Materials</p>
                <Button size="sm" className="w-full">
                  Upload Files
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <Calendar className="w-8 h-8 mx-auto text-green-600" />
                <p className="font-medium">Schedule Exam</p>
                <Button size="sm" variant="outline" className="w-full">
                  Create Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Materials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{upload.title}</p>
                    <p className="text-sm text-gray-600">{upload.type} • {upload.uploadDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {upload.views}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{exam.subject}</p>
                    <Badge variant={exam.status === "ready" ? "default" : "secondary"}>
                      {exam.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {exam.date} at {exam.time} • {exam.students} students
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  {exam.status === "ready" ? "View" : "Edit"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Engagement Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Student Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Attention Score</span>
                <span className="font-medium">{studentMetrics.averageEngagement}%</span>
              </div>
              <Progress value={studentMetrics.averageEngagement} />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{studentMetrics.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{studentMetrics.activeNow}</p>
                <p className="text-sm text-gray-600">Active Now</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{activeAlerts.length}</p>
                <p className="text-sm text-gray-600">Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}