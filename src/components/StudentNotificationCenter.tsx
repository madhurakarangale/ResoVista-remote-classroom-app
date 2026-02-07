import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock,
  Search,
  Filter,
  Calendar,
  User,
  MarkAsUnread,
  Archive,
  Star,
  Trash2
} from "lucide-react";

interface StudentNotification {
  id: number;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'reminder' | 'emergency';
  sender: string;
  senderRole: 'admin' | 'teacher';
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface StudentNotificationCenterProps {
  onNavigate: (screen: string) => void;
}

export function StudentNotificationCenter({ onNavigate }: StudentNotificationCenterProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<StudentNotification | null>(null);

  const [notifications, setNotifications] = useState<StudentNotification[]>([
    {
      id: 1,
      title: "New Semester Schedule Released",
      message: "The schedule for the upcoming semester has been released. Please check your dashboard for updated class timings. Make sure to note the new lab session timings for Chemistry and Physics.",
      type: 'announcement',
      sender: 'Admin Office',
      senderRole: 'admin',
      timestamp: '2024-01-15 09:00',
      isRead: true,
      isStarred: false,
      isArchived: false,
      priority: 'medium'
    },
    {
      id: 2,
      title: "Emergency: Campus Closure",
      message: "Due to severe weather conditions, the campus will be closed today. All classes will be conducted online via the live class platform. Please check your class schedule for updated meeting links.",
      type: 'emergency',
      sender: 'Emergency Management',
      senderRole: 'admin',
      timestamp: '2024-01-14 07:30',
      isRead: true,
      isStarred: true,
      isArchived: false,
      priority: 'urgent'
    },
    {
      id: 3,
      title: "Assignment Submission Reminder",
      message: "This is a reminder that your Mathematics assignment is due tomorrow at 11:59 PM. Please submit your work through the assignment portal.",
      type: 'reminder',
      sender: 'Prof. Sharma',
      senderRole: 'teacher',
      timestamp: '2024-01-13 16:45',
      isRead: false,
      isStarred: false,
      isArchived: false,
      priority: 'high'
    },
    {
      id: 4,
      title: "Lab Session Cancelled",
      message: "Tomorrow's Chemistry lab session has been cancelled due to equipment maintenance. It will be rescheduled for next week.",
      type: 'alert',
      sender: 'Dr. Patel',
      senderRole: 'teacher',
      timestamp: '2024-01-13 14:20',
      isRead: false,
      isStarred: false,
      isArchived: false,
      priority: 'medium'
    },
    {
      id: 5,
      title: "Library Hours Extended",
      message: "Library hours have been extended until 10 PM during exam week (January 20-26). Additional study rooms are also available for group discussions.",
      type: 'announcement',
      sender: 'Library Services',
      senderRole: 'admin',
      timestamp: '2024-01-12 11:30',
      isRead: true,
      isStarred: true,
      isArchived: false,
      priority: 'low'
    },
    {
      id: 6,
      title: "Grade Posted: Physics Quiz",
      message: "Your grade for the Physics Quiz has been posted. You can view your results in the marks section.",
      type: 'announcement',
      sender: 'Dr. Kumar',
      senderRole: 'teacher',
      timestamp: '2024-01-11 15:15',
      isRead: true,
      isStarred: false,
      isArchived: true,
      priority: 'low'
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
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

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const toggleStar = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isStarred: !notif.isStarred } : notif
      )
    );
  };

  const archiveNotification = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isArchived: true } : notif
      )
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notification.isRead) ||
                         (selectedFilter === 'starred' && notification.isStarred) ||
                         (selectedFilter === 'archived' && notification.isArchived) ||
                         (selectedFilter !== 'all' && selectedFilter !== 'unread' && selectedFilter !== 'starred' && selectedFilter !== 'archived' && notification.type === selectedFilter);
    
    const matchesSearch = searchQuery === '' || 
                         notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.sender.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch && !notification.isArchived;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const starredCount = notifications.filter(n => n.isStarred && !n.isArchived).length;
  const totalCount = notifications.filter(n => !n.isArchived).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            My Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with announcements, alerts, and reminders
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">{totalCount}</div>
              <div className="text-sm text-blue-600">Total Notifications</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-red-100 to-red-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-800">{unreadCount}</div>
              <div className="text-sm text-red-600">Unread</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-800">{starredCount}</div>
              <div className="text-sm text-yellow-600">Starred</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                {notifications.filter(n => n.isArchived).length}
              </div>
              <div className="text-sm text-green-600">Archived</div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="starred">Starred</option>
              <option value="announcement">Announcements</option>
              <option value="alert">Alerts</option>
              <option value="reminder">Reminders</option>
              <option value="emergency">Emergency</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </Card>

        {/* Notifications List */}
        {selectedNotification ? (
          /* Detailed Notification View */
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedNotification(null)}
                >
                  ← Back to Notifications
                </Button>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleStar(selectedNotification.id)}
                    className={selectedNotification.isStarred ? 'text-yellow-600' : ''}
                  >
                    <Star className={`w-4 h-4 ${selectedNotification.isStarred ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      archiveNotification(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge className={getTypeColor(selectedNotification.type)}>
                    {getTypeIcon(selectedNotification.type)}
                    <span className="ml-1">{selectedNotification.type}</span>
                  </Badge>
                  <Badge className={getPriorityColor(selectedNotification.priority)}>
                    {selectedNotification.priority}
                  </Badge>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedNotification.title}
                </h2>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {selectedNotification.sender}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {selectedNotification.timestamp}
                  </span>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedNotification.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Notifications List */
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="p-8 text-center bg-white/70 backdrop-blur-sm border-0">
                <div className="text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No notifications found</p>
                  <p className="text-sm">Check back later for updates!</p>
                </div>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
                    !notification.isRead ? 'ring-2 ring-blue-200' : ''
                  }`}
                  onClick={() => {
                    setSelectedNotification(notification);
                    markAsRead(notification.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getTypeColor(notification.type)}>
                              {getTypeIcon(notification.type)}
                              <span className="ml-1">{notification.type}</span>
                            </Badge>
                            <Badge className={getPriorityColor(notification.priority)} size="sm">
                              {notification.priority}
                            </Badge>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          {notification.isStarred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <h3 className={`font-semibold text-gray-900 mb-1 ${
                          !notification.isRead ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {notification.sender}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(notification.id);
                          }}
                          className={notification.isStarred ? 'text-yellow-600' : 'text-gray-400'}
                        >
                          <Star className={`w-4 h-4 ${notification.isStarred ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}