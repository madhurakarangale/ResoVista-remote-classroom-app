import { useState } from "react";
import { MessageCircle, Phone, Video, Send, Search, UserCheck, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

interface Contact {
  id: number;
  name: string;
  role: 'teacher' | 'student';
  type: 'content_provider' | 'doubt_solver' | 'student';
  subject?: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
  rating?: number;
  specialization?: string[];
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
}

interface ChatCallSystemProps {
  userRole: 'student' | 'teacher';
  onNavigate: (screen: string) => void;
}

export function ChatCallSystem({ userRole, onNavigate }: ChatCallSystemProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'chat' | 'call'>('chat');
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);

  const [contacts] = useState<Contact[]>([
    { id: 1, name: "Dr. Rajesh Kumar", role: 'teacher', type: 'content_provider', subject: "Mathematics", status: 'online', rating: 4.8, specialization: ["Calculus", "Algebra", "Geometry"] },
    { id: 2, name: "Prof. Sneha Sharma", role: 'teacher', type: 'doubt_solver', subject: "Physics", status: 'online', rating: 4.9, specialization: ["Mechanics", "Thermodynamics"] },
    { id: 3, name: "Mr. Amit Patel", role: 'teacher', type: 'content_provider', subject: "Chemistry", status: 'busy', rating: 4.7, specialization: ["Organic Chemistry", "Physical Chemistry"] },
    { id: 4, name: "Dr. Priya Singh", role: 'teacher', type: 'doubt_solver', subject: "Biology", status: 'offline', lastSeen: "2 hours ago", rating: 4.6, specialization: ["Cell Biology", "Genetics"] },
    { id: 5, name: "Rahul Verma", role: 'student', type: 'student', status: 'online' },
    { id: 6, name: "Anjali Gupta", role: 'student', type: 'student', status: 'offline', lastSeen: "30 mins ago" }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, senderId: 1, text: "Hello! How can I help you with Mathematics today?", timestamp: "10:30 AM", type: 'text' },
    { id: 2, senderId: 0, text: "I'm having trouble with integration problems", timestamp: "10:32 AM", type: 'text' },
    { id: 3, senderId: 1, text: "No problem! Let's start with basic integration rules. Can you share the specific problem you're working on?", timestamp: "10:33 AM", type: 'text' },
  ]);

  const sendMessage = () => {
    if (messageText.trim() && selectedContact) {
      const newMessage: Message = {
        id: messages.length + 1,
        senderId: 0, // Current user
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  const startCall = (type: 'voice' | 'video') => {
    if (selectedContact) {
      setCallType(type);
      // Simulate call interface
      setTimeout(() => {
        alert(`${type === 'voice' ? 'Voice' : 'Video'} call started with ${selectedContact.name}`);
        setCallType(null);
      }, 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'content_provider': return 'bg-blue-100 text-blue-800';
      case 'doubt_solver': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userRole === 'student' ? contact.role === 'teacher' : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userRole === 'student' ? 'Connect with Teachers' : 'Student Communications'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'student' 
              ? 'Chat with teachers and get help with your studies'
              : 'Communicate with your students and provide guidance'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <Card className="lg:col-span-1 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-3">
                <Button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 ${activeTab === 'chat' ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'}`}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button
                  onClick={() => setActiveTab('call')}
                  className={`flex-1 ${activeTab === 'call' ? 'bg-green-500' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search contacts..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50/50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {contact.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{contact.name}</h4>
                        {contact.rating && (
                          <div className="flex items-center text-xs text-yellow-600">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {contact.rating}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Badge className={`text-xs ${getTypeColor(contact.type)}`}>
                          {contact.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {contact.subject && (
                          <div className="text-xs text-gray-600">{contact.subject}</div>
                        )}
                        {contact.specialization && (
                          <div className="text-xs text-gray-500">
                            {contact.specialization.slice(0, 2).join(', ')}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {contact.status === 'online' ? 'Online' : 
                           contact.status === 'busy' ? 'Busy' : 
                           contact.lastSeen ? `Last seen ${contact.lastSeen}` : 'Offline'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat/Call Interface */}
          <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            {selectedContact ? (
              <div className="h-96 flex flex-col">
                {/* Contact Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {selectedContact.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedContact.status)}`}></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Badge className={`text-xs ${getTypeColor(selectedContact.type)}`}>
                          {selectedContact.type.replace('_', ' ')}
                        </Badge>
                        {selectedContact.subject && <span>{selectedContact.subject}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => startCall('voice')}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      disabled={selectedContact.status === 'offline'}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => startCall('video')}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={selectedContact.status === 'offline'}
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {activeTab === 'chat' ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === 0 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === 0 ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder={`Message ${selectedContact.name}...`}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button 
                          onClick={sendMessage}
                          className="bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Call Interface */
                  <div className="flex-1 flex items-center justify-center">
                    {callType ? (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          {callType === 'voice' ? (
                            <Phone className="w-8 h-8 text-white" />
                          ) : (
                            <Video className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {callType === 'voice' ? 'Voice Call' : 'Video Call'} with {selectedContact.name}
                        </h3>
                        <p className="text-gray-600 mb-4">Connecting...</p>
                        <Button 
                          onClick={() => setCallType(null)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          End Call
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          {selectedContact.status === 'online' ? (
                            <UserCheck className="w-8 h-8 text-white" />
                          ) : (
                            <Clock className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">{selectedContact.name}</h3>
                        <p className="text-gray-600 mb-4">
                          {selectedContact.status === 'online' ? 'Available for calls' : 
                           selectedContact.status === 'busy' ? 'Currently busy' : 'Offline'}
                        </p>
                        <div className="flex space-x-3 justify-center">
                          <Button
                            onClick={() => startCall('voice')}
                            className="bg-green-500 hover:bg-green-600"
                            disabled={selectedContact.status === 'offline'}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Voice Call
                          </Button>
                          <Button
                            onClick={() => startCall('video')}
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={selectedContact.status === 'offline'}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Video Call
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Select a contact to start chatting or calling</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Teacher Types Info (For Students) */}
        {userRole === 'student' && (
          <Card className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Types of Teachers Available</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    📚
                  </div>
                  <h4 className="font-medium text-gray-900">Content Providers</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Teachers who create and deliver course content, conduct classes, and provide structured learning materials.
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    ❓
                  </div>
                  <h4 className="font-medium text-gray-900">Doubt Solvers</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Specialized teachers available for quick doubt resolution, problem-solving, and personalized help sessions.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}