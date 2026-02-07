import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { 
  Bell, 
  Send, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Calendar,
  Eye,
  Plus,
  Filter,
  Search,
  Trash2,
  Edit
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'reminder' | 'emergency';
  target: 'all' | 'class' | 'individual';
  targetDetails: string;
  scheduledFor?: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'scheduled';
  deliveredTo: number;
  readBy: number;
  totalRecipients: number;
}

interface AdminNotificationCenterProps {
  onNavigate: (screen: string) => void;
}

export function AdminNotificationCenter({ onNavigate }: AdminNotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'announcement' as const,
    target: 'all' as const,
    targetDetails: '',
    scheduledFor: ''
  });

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Semester Schedule Released",
      message: "The schedule for the upcoming semester has been released. Please check your dashboard for updated class timings.",
      type: 'announcement',
      target: 'all',
      targetDetails: 'All Students',
      createdAt: '2024-01-15 09:00',
      status: 'sent',
      deliveredTo: 245,
      readBy: 198,
      totalRecipients: 245
    },
    {
      id: 2,
      title: "Emergency: Campus Closure",
      message: "Due to weather conditions, the campus will be closed today. All classes will be conducted online.",
      type: 'emergency',
      target: 'all',
      targetDetails: 'All Students',
      createdAt: '2024-01-14 07:30',
      status: 'sent',
      deliveredTo: 245,
      readBy: 240,
      totalRecipients: 245
    },
    {
      id: 3,
      title: "Math Department Meeting",
      message: "Mandatory meeting for all math students regarding the upcoming competitive exam preparation.",
      type: 'alert',
      target: 'class',
      targetDetails: 'Mathematics Department',
      createdAt: '2024-01-13 14:00',
      status: 'sent',
      deliveredTo: 45,
      readBy: 38,
      totalRecipients: 45
    },
    {
      id: 4,
      title: "Library Hours Extended",
      message: "Library hours have been extended until 10 PM during exam week.",
      type: 'announcement',
      target: 'all',
      targetDetails: 'All Students',
      scheduledFor: '2024-01-20 08:00',
      createdAt: '2024-01-12 16:00',
      status: 'scheduled',
      deliveredTo: 0,
      readBy: 0,
      totalRecipients: 245
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'alert': return 'bg-orange-100 text-orange-800';
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      case 'alert': return <Bell className="w-4 h-4" />;
      case 'announcement': return <Info className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const handleSendNotification = () => {
    if (!notificationForm.title || !notificationForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    // Here you would typically send the notification to the backend
    alert(`Notification "${notificationForm.title}" has been sent to ${notificationForm.target} recipients!`);
    
    // Reset form
    setNotificationForm({
      title: '',
      message: '',
      type: 'announcement',
      target: 'all',
      targetDetails: '',
      scheduledFor: ''
    });
  };

  const calculateReadPercentage = (notification: Notification) => {
    if (notification.totalRecipients === 0) return 0;
    return Math.round((notification.readBy / notification.totalRecipients) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Notification Center
          </h1>
          <p className="text-gray-600">
            Create and manage notifications for students and staff
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">245</div>
              <div className="text-sm text-blue-600">Total Recipients</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">12</div>
              <div className="text-sm text-green-600">Sent Today</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-800">3</div>
              <div className="text-sm text-orange-600">Scheduled</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">85%</div>
              <div className="text-sm text-purple-600">Read Rate</div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setActiveTab('create')}
            className={`${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Notification
          </Button>
          <Button
            onClick={() => setActiveTab('manage')}
            className={`${activeTab === 'manage' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Manage Notifications
          </Button>
        </div>

        {activeTab === 'create' ? (
          /* Create Notification Tab */
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { type: 'announcement', label: 'Announcement', icon: Info },
                    { type: 'alert', label: 'Alert', icon: Bell },
                    { type: 'reminder', label: 'Reminder', icon: Clock },
                    { type: 'emergency', label: 'Emergency', icon: AlertTriangle }
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => setNotificationForm(prev => ({ ...prev, type: type as any }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        notificationForm.type === type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Title *
                </label>
                <Input
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title..."
                  className="w-full"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content *
                </label>
                <Textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message here..."
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={notificationForm.target}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, target: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="all">All Students</option>
                    <option value="class">Specific Class/Department</option>
                    <option value="individual">Individual Students</option>
                  </select>
                </div>

                {notificationForm.target !== 'all' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {notificationForm.target === 'class' ? 'Class/Department' : 'Student Names/IDs'}
                    </label>
                    <Input
                      value={notificationForm.targetDetails}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, targetDetails: e.target.value }))}
                      placeholder={
                        notificationForm.target === 'class'
                          ? 'e.g., Mathematics, Physics, Class 12A'
                          : 'e.g., John Doe, Jane Smith, ST001'
                      }
                    />
                  </div>
                )}
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <Input
                  type="datetime-local"
                  value={notificationForm.scheduledFor}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="w-full md:w-1/2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to send immediately
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleSendNotification}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {notificationForm.scheduledFor ? 'Schedule Notification' : 'Send Now'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setNotificationForm({
                    title: '',
                    message: '',
                    type: 'announcement',
                    target: 'all',
                    targetDetails: '',
                    scheduledFor: ''
                  })}
                >
                  Clear Form
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Manage Notifications Tab */
          <div>
            {/* Filters */}
            <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-10"
                  />
                </div>
                <select className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white">
                  <option value="all">All Types</option>
                  <option value="announcement">Announcements</option>
                  <option value="alert">Alerts</option>
                  <option value="reminder">Reminders</option>
                  <option value="emergency">Emergency</option>
                </select>
                <select className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white">
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <Badge className={getTypeColor(notification.type)}>
                            {getTypeIcon(notification.type)}
                            <span className="ml-1">{notification.type}</span>
                          </Badge>
                          <Badge className={getStatusColor(notification.status)}>
                            {notification.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {notification.targetDetails}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {notification.createdAt}
                          </span>
                          {notification.scheduledFor && (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Scheduled: {notification.scheduledFor}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {notification.status === 'sent' && (
                      <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{notification.deliveredTo}</div>
                          <div className="text-xs text-gray-500">Delivered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{notification.readBy}</div>
                          <div className="text-xs text-gray-500">Read</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{calculateReadPercentage(notification)}%</div>
                          <div className="text-xs text-gray-500">Read Rate</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}