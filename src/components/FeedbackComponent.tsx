import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { 
  MessageSquare, 
  Star, 
  Send, 
  ThumbsUp, 
  ThumbsDown,
  CheckCircle,
  Clock,
  User,
  BookOpen,
  AlertCircle
} from "lucide-react";

interface FeedbackComponentProps {
  userRole: 'student' | 'teacher' | 'admin';
  onSubmit?: (feedback: any) => void;
}

export function FeedbackComponent({ userRole, onSubmit }: FeedbackComponentProps) {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [feedbackType, setFeedbackType] = useState<'teacher' | 'admin' | 'app'>('teacher');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [rating, setRating] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const teachers = [
    { id: 1, name: "Prof. Rajesh Sharma", subject: "Mathematics" },
    { id: 2, name: "Dr. Priya Patel", subject: "Physics" },
    { id: 3, name: "Prof. Amit Kumar", subject: "Chemistry" }
  ];

  const feedbackCategories = {
    teacher: [
      "Teaching Quality",
      "Communication",
      "Course Content",
      "Availability",
      "Assessment Methods"
    ],
    admin: [
      "Academic Issues",
      "Technical Support",
      "Fee Related",
      "General Inquiry",
      "Complaint"
    ],
    app: [
      "User Interface",
      "Performance",
      "Features",
      "Bug Report",
      "Suggestion"
    ]
  };

  const feedbackHistory = [
    {
      id: 1,
      type: "teacher",
      target: "Prof. Rajesh Sharma",
      subject: "Excellent teaching methods",
      rating: 5,
      status: "responded",
      date: "Dec 15, 2024",
      response: "Thank you for your positive feedback! I'm glad you found the teaching methods helpful."
    },
    {
      id: 2,
      type: "admin",
      target: "Academic Office",
      subject: "Issue with course enrollment",
      rating: 3,
      status: "resolved",
      date: "Dec 12, 2024",
      response: "Your enrollment issue has been resolved. Please check your dashboard."
    },
    {
      id: 3,
      type: "app",
      target: "Technical Team",
      subject: "App crashes during video calls",
      rating: 2,
      status: "in-progress",
      date: "Dec 10, 2024",
      response: "We're investigating this issue and will update you soon."
    }
  ];

  const handleSubmit = () => {
    if (!subject || !message || (feedbackType === 'teacher' && !selectedTeacher)) {
      return;
    }

    setIsSubmitting(true);

    const feedbackData = {
      type: feedbackType,
      target: feedbackType === 'teacher' ? selectedTeacher : feedbackType === 'admin' ? 'Admin Team' : 'Technical Team',
      subject,
      message,
      rating: feedbackType === 'teacher' ? rating : undefined,
      category,
      date: new Date().toLocaleDateString(),
      status: 'submitted'
    };

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit?.(feedbackData);
      
      // Reset form
      setSubject('');
      setMessage('');
      setRating(0);
      setSelectedTeacher('');
      setCategory('');
      
      alert('Feedback submitted successfully!');
    }, 1500);
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer ${
          index < currentRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded': return <CheckCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white">
        <div className="px-4 py-6">
          <h1 className="flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            Feedback Center
          </h1>
          <p className="text-pink-100">Share your thoughts and help us improve</p>
        </div>
      </div>

      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 mb-6 shadow-sm">
          <Button
            variant={activeTab === 'submit' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('submit')}
            className={`flex-1 ${activeTab === 'submit' ? 'bg-purple-500 text-white' : 'text-gray-600'}`}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className={`flex-1 ${activeTab === 'history' ? 'bg-purple-500 text-white' : 'text-gray-600'}`}
          >
            <Clock className="w-4 h-4 mr-2" />
            My Feedback
          </Button>
        </div>

        {/* Submit Feedback Tab */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            {/* Feedback Type Selection */}
            <Card className="bg-white border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-900">What would you like to give feedback about?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant={feedbackType === 'teacher' ? 'default' : 'outline'}
                    onClick={() => setFeedbackType('teacher')}
                    className={`justify-start h-auto py-4 ${
                      feedbackType === 'teacher' 
                        ? 'bg-orange-400 hover:bg-orange-500 text-white border-orange-400' 
                        : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Teacher Feedback</p>
                      <p className="text-sm opacity-80">Rate and review your teachers</p>
                    </div>
                  </Button>

                  <Button
                    variant={feedbackType === 'admin' ? 'default' : 'outline'}
                    onClick={() => setFeedbackType('admin')}
                    className={`justify-start h-auto py-4 ${
                      feedbackType === 'admin' 
                        ? 'bg-blue-400 hover:bg-blue-500 text-white border-blue-400' 
                        : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Admin Feedback</p>
                      <p className="text-sm opacity-80">Academic or administrative queries</p>
                    </div>
                  </Button>

                  <Button
                    variant={feedbackType === 'app' ? 'default' : 'outline'}
                    onClick={() => setFeedbackType('app')}
                    className={`justify-start h-auto py-4 ${
                      feedbackType === 'app' 
                        ? 'bg-green-400 hover:bg-green-500 text-white border-green-400' 
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">App Feedback</p>
                      <p className="text-sm opacity-80">Report bugs or suggest features</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Form */}
            <Card className="bg-white border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-900">
                  {feedbackType === 'teacher' && 'Teacher Feedback'}
                  {feedbackType === 'admin' && 'Admin Feedback'}
                  {feedbackType === 'app' && 'App Feedback'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Teacher Selection */}
                {feedbackType === 'teacher' && (
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Select Teacher</label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Choose a teacher...</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.name}>
                          {teacher.name} - {teacher.subject}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="block font-medium text-gray-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select category...</option>
                    {feedbackCategories[feedbackType].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Rating (for teacher feedback) */}
                {feedbackType === 'teacher' && (
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Rating</label>
                    <div className="flex items-center space-x-2">
                      {renderStars(rating, true)}
                      <span className="text-sm text-gray-600 ml-2">
                        {rating > 0 ? `${rating}/5` : 'No rating'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-2">
                  <label className="block font-medium text-gray-700">Subject</label>
                  <Input
                    type="text"
                    placeholder="Brief subject line..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="border-2 border-gray-200 focus:border-purple-400"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="block font-medium text-gray-700">Message</label>
                  <Textarea
                    placeholder="Write your detailed feedback here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="border-2 border-gray-200 focus:border-purple-400"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !subject || !message || (feedbackType === 'teacher' && !selectedTeacher)}
                  className={`w-full py-3 ${
                    feedbackType === 'teacher' ? 'bg-orange-500 hover:bg-orange-600' :
                    feedbackType === 'admin' ? 'bg-blue-500 hover:bg-blue-600' :
                    'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {feedbackHistory.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No feedback submitted yet</h3>
                  <p className="text-gray-600 mb-4">Start by submitting your first feedback!</p>
                  <Button onClick={() => setActiveTab('submit')} className="bg-purple-500 hover:bg-purple-600">
                    Submit Feedback
                  </Button>
                </CardContent>
              </Card>
            ) : (
              feedbackHistory.map((feedback) => (
                <Card 
                  key={feedback.id} 
                  className={`bg-white border-l-4 ${
                    feedback.type === 'teacher' ? 'border-orange-400' :
                    feedback.type === 'admin' ? 'border-blue-400' :
                    'border-green-400'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{feedback.subject}</h3>
                        <p className="text-sm text-gray-600">To: {feedback.target}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(feedback.status)}>
                          {getStatusIcon(feedback.status)}
                          <span className="ml-1 capitalize">{feedback.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {feedback.rating && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Your rating:</span>
                        {renderStars(feedback.rating)}
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-3">{feedback.date}</p>

                    {feedback.response && (
                      <div className="bg-gray-50 p-3 rounded-lg mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Response:</p>
                        <p className="text-sm text-gray-600">{feedback.response}</p>
                      </div>
                    )}
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