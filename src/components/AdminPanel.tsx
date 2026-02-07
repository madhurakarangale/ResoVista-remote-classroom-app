import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Users, 
  School, 
  BarChart3, 
  Settings, 
  UserPlus,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Database,
  Shield,
  Activity,
  DollarSign,
  Bell,
  Send
} from "lucide-react";

interface AdminPanelProps {
  onNavigate: (screen: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [systemStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalInstitutions: 23,
    activeClasses: 156,
    systemUptime: 99.8,
    storageUsed: 73
  });

  const [recentActivity] = useState([
    { id: 1, type: "user", action: "New teacher registered", user: "Dr. Rajesh Kumar", time: "5 min ago" },
    { id: 2, type: "system", action: "System maintenance completed", user: "System", time: "1 hour ago" },
    { id: 3, type: "alert", action: "High server load detected", user: "Monitor", time: "2 hours ago" },
    { id: 4, type: "user", action: "Institution onboarded", user: "Rural College Pune", time: "3 hours ago" }
  ]);

  const [institutions] = useState([
    { id: 1, name: "Rural College Mumbai", students: 245, teachers: 18, status: "active", plan: "premium" },
    { id: 2, name: "Village University Bihar", students: 189, teachers: 15, status: "active", plan: "basic" },
    { id: 3, name: "Remote Learning Center UP", students: 156, teachers: 12, status: "pending", plan: "trial" },
    { id: 4, name: "Gram Vidyalaya Odisha", students: 234, teachers: 16, status: "active", plan: "premium" }
  ]);

  const [userStats] = useState({
    students: 1089,
    teachers: 134,
    admins: 24,
    newThisMonth: 89
  });

  const [performanceMetrics] = useState([
    { metric: "Average Class Attendance", value: 87, trend: "up" },
    { metric: "Student Engagement Score", value: 82, trend: "up" },
    { metric: "System Response Time", value: 95, trend: "down" },
    { metric: "Content Upload Success", value: 98, trend: "up" }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-indigo-900">Admin Dashboard</h1>
              <p className="text-gray-600">System overview and management</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                System Healthy
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="institutions">Institutions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Users</p>
                      <p className="text-xl font-semibold">{systemStats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Active Now</p>
                      <p className="text-xl font-semibold">{systemStats.activeUsers}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Institutions</p>
                      <p className="text-xl font-semibold">{systemStats.totalInstitutions}</p>
                    </div>
                    <School className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Live Classes</p>
                      <p className="text-xl font-semibold">{systemStats.activeClasses}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>System Uptime</span>
                    <span className="font-medium">{systemStats.systemUptime}%</span>
                  </div>
                  <Progress value={systemStats.systemUptime} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Used</span>
                    <span className="font-medium">{systemStats.storageUsed}%</span>
                  </div>
                  <Progress value={systemStats.storageUsed} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    {activity.type === "user" && <Users className="w-5 h-5 text-blue-500 mt-0.5" />}
                    {activity.type === "system" && <Settings className="w-5 h-5 text-green-500 mt-0.5" />}
                    {activity.type === "alert" && <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notification Management - Quick Access */}
            <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="flex items-center text-teal-900">
                      <Bell className="w-5 h-5 mr-2" />
                      Notification Center
                    </h3>
                    <p className="text-teal-700 text-sm">Send announcements & alerts to students</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-xs text-teal-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        12 Sent Today
                      </div>
                      <div className="flex items-center text-xs text-teal-600">
                        <Send className="w-3 h-3 mr-1" />
                        85% Read Rate
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => onNavigate('notifications')}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Manage Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Students</p>
                      <p className="text-2xl font-bold">{userStats.students.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Teachers</p>
                      <p className="text-2xl font-bold">{userStats.teachers}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Admins</p>
                      <p className="text-2xl font-bold">{userStats.admins}</p>
                    </div>
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">New This Month</p>
                      <p className="text-2xl font-bold text-green-600">+{userStats.newThisMonth}</p>
                    </div>
                    <UserPlus className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-16">
                <UserPlus className="w-5 h-5 mr-2" />
                Add New User
              </Button>
              <Button variant="outline" className="h-16">
                <Database className="w-5 h-5 mr-2" />
                Export Users
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="institutions" className="space-y-6">
            {/* Institution List */}
            <div className="space-y-4">
              {institutions.map((institution) => (
                <Card key={institution.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{institution.name}</h3>
                          <Badge 
                            variant={institution.status === "active" ? "default" : "secondary"}
                            className={
                              institution.status === "active" ? "bg-green-100 text-green-800" : 
                              institution.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""
                            }
                          >
                            {institution.status}
                          </Badge>
                          <Badge variant="outline">
                            {institution.plan}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>{institution.students} students</span>
                          <span>{institution.teachers} teachers</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Institution */}
            <Button className="w-full h-12">
              <School className="w-5 h-5 mr-2" />
              Add New Institution
            </Button>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metric.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{metric.value}%</span>
                        {metric.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                        )}
                      </div>
                    </div>
                    <Progress value={metric.value} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="font-medium">Daily Active Users</p>
                  <p className="text-2xl font-bold text-blue-600">892</p>
                  <p className="text-sm text-gray-600">+12% from yesterday</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="font-medium">Classes Today</p>
                  <p className="text-2xl font-bold text-green-600">156</p>
                  <p className="text-sm text-gray-600">Across all institutions</p>
                </CardContent>
              </Card>
            </div>

            {/* Export Options */}
            <div className="space-y-3">
              <h3 className="font-medium">Export Reports</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Usage Report
                </Button>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  User Analytics
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}