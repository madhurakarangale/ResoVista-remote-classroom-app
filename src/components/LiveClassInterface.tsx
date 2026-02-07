import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { WhiteboardInterface } from "./WhiteboardInterface";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Users, 
  MessageSquare, 
  Settings,
  AlertTriangle,
  Clock,
  Signal,
  Wifi,
  Camera,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PenTool,
  Presentation
} from "lucide-react";

interface LiveClassInterfaceProps {
  userRole: 'student' | 'teacher' | 'admin';
  onNavigate: (screen: string) => void;
}

export function LiveClassInterface({ userRole, onNavigate }: LiveClassInterfaceProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [attentionScore, setAttentionScore] = useState(85);
  const [examMode, setExamMode] = useState(false);
  const [examTimeRemaining, setExamTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [activeView, setActiveView] = useState<'video' | 'whiteboard' | 'split'>('video');

  // Mock exam questions for demo
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  
  const examQuestions = [
    {
      id: 1,
      question: "What is the derivative of x² + 3x + 2?",
      options: ["2x + 3", "x + 3", "2x + 2", "x² + 3"],
      type: "multiple-choice"
    },
    {
      id: 2,
      question: "Solve for x: 2x + 5 = 15",
      options: ["x = 5", "x = 10", "x = 3", "x = 7"],
      type: "multiple-choice"
    }
  ];

  // Simulate tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && (examMode || userRole === 'student')) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        if (newCount >= 3) {
          setShowTabWarning(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [tabSwitchCount, examMode, userRole]);

  // Exam timer
  useEffect(() => {
    if (examMode && examTimeRemaining > 0) {
      const timer = setInterval(() => {
        setExamTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examMode, examTimeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const participants = [
    { id: 1, name: "Prof. Sharma", role: "teacher", video: true, audio: true, attention: 100 },
    { id: 2, name: "Priya K.", role: "student", video: true, audio: false, attention: 92 },
    { id: 3, name: "Raj M.", role: "student", video: true, audio: false, attention: 78 },
    { id: 4, name: "Amit S.", role: "student", video: false, audio: false, attention: 65 },
    { id: 5, name: "Maya P.", role: "student", video: true, audio: false, attention: 88 }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header with class info and controls */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Mathematics - Advanced Calculus</h1>
          <Badge variant="destructive" className="bg-red-500">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
            LIVE
          </Badge>
          {examMode && (
            <Badge className="bg-orange-500">
              EXAM MODE
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {userRole === 'teacher' && (
            <div className="flex items-center space-x-1 mr-4">
              <Button
                size="sm"
                variant={activeView === 'video' ? 'default' : 'outline'}
                onClick={() => setActiveView('video')}
                className="text-xs"
              >
                <Video className="w-3 h-3 mr-1" />
                Video
              </Button>
              <Button
                size="sm"
                variant={activeView === 'whiteboard' ? 'default' : 'outline'}
                onClick={() => setActiveView('whiteboard')}
                className="text-xs"
              >
                <PenTool className="w-3 h-3 mr-1" />
                Board
              </Button>
              <Button
                size="sm"
                variant={activeView === 'split' ? 'default' : 'outline'}
                onClick={() => setActiveView('split')}
                className="text-xs"
              >
                <Presentation className="w-3 h-3 mr-1" />
                Both
              </Button>
            </div>
          )}
          <div className={`flex items-center ${getConnectionColor()}`}>
            <Signal className="w-4 h-4 mr-1" />
            <span className="text-sm capitalize">{connectionQuality}</span>
          </div>
          <Badge variant="outline" className="text-white border-gray-600">
            <Users className="w-3 h-3 mr-1" />
            {participants.length}
          </Badge>
        </div>
      </div>

      {/* Alerts and Warnings */}
      {showTabWarning && (
        <Alert className="mx-4 mt-4 border-red-500 bg-red-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-white">
            <strong>Warning:</strong> You have switched tabs {tabSwitchCount} times. 
            {tabSwitchCount >= 3 ? " Maximum limit reached! Your teacher has been notified." : ` Maximum 3 switches allowed.`}
          </AlertDescription>
        </Alert>
      )}

      {userRole === 'teacher' && tabSwitchCount > 0 && (
        <Alert className="mx-4 mt-4 border-orange-500 bg-orange-900/20">
          <Monitor className="h-4 w-4" />
          <AlertDescription className="text-white">
            Student monitoring alert: {tabSwitchCount} tab switch(es) detected from various students.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 flex">
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Content based on active view */}
          <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'flex-1'} bg-gray-800 relative`}>
            {activeView === 'video' ? (
              /* Video Feed */
              <div className="w-full h-full flex items-center justify-center">
                {isVideoOn ? (
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <Camera className="w-16 h-16 text-white/60" />
                      </div>
                      <p className="text-white/80">
                        {userRole === 'teacher' ? 'Your Camera' : 'Prof. Sharma'}
                      </p>
                    </div>
                    
                    {/* AI Compression Indicator */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white">
                        <Wifi className="w-3 h-3 mr-1" />
                        AI Compressed
                      </Badge>
                    </div>
                    
                    {/* Attention Score for students */}
                    {userRole === 'student' && (
                      <div className="absolute top-4 right-4">
                        <Badge className={`${attentionScore >= 80 ? 'bg-green-600' : attentionScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          Attention: {attentionScore}%
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-gray-400">
                    <VideoOff className="w-16 h-16" />
                  </div>
                )}
              </div>
            ) : activeView === 'whiteboard' ? (
              /* Whiteboard */
              <div className="w-full h-full">
                <WhiteboardInterface 
                  userRole={userRole as 'teacher' | 'student'} 
                  isLiveClass={true}
                  onNavigate={onNavigate}
                />
              </div>
            ) : (
              /* Split View */
              <div className="w-full h-full flex">
                <div className="w-1/2 h-full">
                  {isVideoOn ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
                          <Camera className="w-10 h-10 text-white/60" />
                        </div>
                        <p className="text-white/80 text-sm">
                          {userRole === 'teacher' ? 'Your Camera' : 'Prof. Sharma'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-gray-400 h-full">
                      <VideoOff className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="w-1/2 h-full border-l border-gray-600">
                  <WhiteboardInterface 
                    userRole={userRole as 'teacher' | 'student'} 
                    isLiveClass={true}
                    onNavigate={onNavigate}
                  />
                </div>
              </div>
            )}
            
            {/* Live class indicators */}
            {activeView !== 'whiteboard' && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-600 text-white">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                  LIVE CLASS
                </Badge>
              </div>
            )}
            
            {/* Controls overlay - show only in video or split view */}
            {activeView !== 'whiteboard' && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2">
                  <Button
                    size="sm"
                    variant={isVideoOn ? "default" : "destructive"}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={isAudioOn ? "default" : "destructive"}
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                  
                  {userRole === 'teacher' && (
                    <>
                      <Button
                        size="sm"
                        variant={isScreenSharing ? "default" : "outline"}
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                        className="rounded-full w-10 h-10 p-0"
                      >
                        {isScreenSharing ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={activeView === 'whiteboard' ? "default" : "outline"}
                        onClick={() => setActiveView(activeView === 'whiteboard' ? 'video' : 'whiteboard')}
                        className="rounded-full w-10 h-10 p-0"
                        title="Toggle Whiteboard"
                      >
                        <PenTool className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Exam Interface */}
          {examMode && userRole === 'student' && (
            <div className="bg-gray-800 p-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Mathematics Exam</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-red-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(examTimeRemaining)}
                  </div>
                  <Badge variant="outline" className="text-white border-gray-600">
                    Question {currentQuestion} of {examQuestions.length}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="mb-4">{examQuestions[currentQuestion - 1]?.question}</p>
                  
                  <div className="space-y-2">
                    {examQuestions[currentQuestion - 1]?.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          onChange={() => setAnswers({...answers, [currentQuestion]: option})}
                          className="text-blue-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    disabled={currentQuestion === 1}
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={() => {
                      if (currentQuestion < examQuestions.length) {
                        setCurrentQuestion(currentQuestion + 1);
                      } else {
                        // Submit exam
                        setExamMode(false);
                      }
                    }}
                  >
                    {currentQuestion === examQuestions.length ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with participants and controls */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Participants */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Participants ({participants.length})
            </h3>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 rounded bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      {participant.video ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{participant.name}</p>
                      {userRole === 'teacher' && participant.role === 'student' && (
                        <p className="text-xs text-gray-400">Attention: {participant.attention}%</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {participant.audio ? <Mic className="w-3 h-3 text-green-500" /> : <MicOff className="w-3 h-3 text-red-500" />}
                    {participant.role === 'teacher' && <Badge size="sm" className="text-xs">Host</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Controls */}
          {userRole === 'teacher' && (
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold mb-3">Class Controls</h3>
              <div className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setExamMode(!examMode)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {examMode ? 'End Exam' : 'Start Exam'}
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveView(activeView === 'whiteboard' ? 'video' : 'whiteboard')}
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  {activeView === 'whiteboard' ? 'Hide Whiteboard' : 'Show Whiteboard'}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Monitor className="w-4 h-4 mr-2" />
                  Share Screen
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Class Settings
                </Button>
              </div>
            </div>
          )}

          {/* Chat or monitoring info */}
          <div className="flex-1 p-4">
            <h3 className="font-semibold mb-3">
              {userRole === 'teacher' ? 'Monitoring' : 'Class Info'}
            </h3>
            
            {userRole === 'teacher' ? (
              <div className="space-y-3">
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm">Average Attention Score</p>
                  <div className="flex items-center justify-between mt-2">
                    <Progress value={82} className="flex-1 mr-2" />
                    <span className="text-sm">82%</span>
                  </div>
                </div>
                
                <div className="bg-orange-900/30 p-3 rounded border border-orange-500">
                  <p className="text-sm text-orange-200">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    3 students with low attention
                  </p>
                </div>

                <div className="bg-red-900/30 p-3 rounded border border-red-500">
                  <p className="text-sm text-red-200">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Tab switches detected: {tabSwitchCount}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm">Your Attention Score</p>
                  <div className="flex items-center justify-between mt-2">
                    <Progress value={attentionScore} className="flex-1 mr-2" />
                    <span className="text-sm">{attentionScore}%</span>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm">Class Duration</p>
                  <p className="text-lg font-mono">45:32</p>
                </div>
                
                {tabSwitchCount > 0 && (
                  <div className="bg-orange-900/30 p-3 rounded border border-orange-500">
                    <p className="text-sm text-orange-200">
                      Tab switches: {tabSwitchCount}/3
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom action buttons */}
          <div className="p-4 border-t border-gray-700">
            <div className="space-y-2">
              <Button 
                className="w-full"
                variant="destructive"
                onClick={() => onNavigate(userRole === 'student' ? 'student' : userRole === 'teacher' ? 'teacher' : 'admin')}
              >
                Leave Class
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}