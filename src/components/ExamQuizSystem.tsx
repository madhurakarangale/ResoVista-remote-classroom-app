import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, FileText, Camera, Upload, Send, Eye, X, Image, FileImage } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";

interface Question {
  id: number;
  type: 'mcq' | 'short' | 'long';
  question: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
  studentAnswer?: string;
}

interface Exam {
  id: number;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalMarks: number;
  questions: Question[];
  status: 'upcoming' | 'ongoing' | 'completed';
  startTime?: string;
  submitTime?: string;
  webcamRequired: boolean;
}

interface ExamQuizSystemProps {
  userRole: 'student' | 'teacher';
  onNavigate: (screen: string) => void;
}

export function ExamQuizSystem({ userRole, onNavigate }: ExamQuizSystemProps) {
  const [exams] = useState<Exam[]>([
    {
      id: 1,
      title: "Mathematics Mid-Term Exam",
      subject: "Mathematics",
      duration: 120,
      totalMarks: 100,
      status: 'upcoming',
      webcamRequired: true,
      questions: [
        { id: 1, type: 'mcq', question: "What is the derivative of x²?", options: ["2x", "x", "2", "x²"], correctAnswer: "2x", marks: 5 },
        { id: 2, type: 'short', question: "Solve: 2x + 5 = 15", marks: 10 },
        { id: 3, type: 'long', question: "Prove that the sum of angles in a triangle is 180°", marks: 20 }
      ]
    },
    {
      id: 2,
      title: "Physics Quiz",
      subject: "Physics",
      duration: 30,
      totalMarks: 25,
      status: 'completed',
      webcamRequired: false,
      questions: [
        { id: 1, type: 'mcq', question: "What is the speed of light?", options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁹ m/s"], correctAnswer: "3×10⁸ m/s", marks: 5, studentAnswer: "3×10⁸ m/s" }
      ]
    }
  ]);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, File>>({});
  const [answerSheetFiles, setAnswerSheetFiles] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<'online' | 'answersheet'>('online');

  // Timer effect
  useEffect(() => {
    if (examStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (examStarted && document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert("Warning: You have switched tabs 3 times. Exam will be auto-submitted.");
            handleAutoSubmit();
          } else {
            alert(`Warning: Tab switching detected. Count: ${newCount}/3`);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examStarted]);

  const startExam = (exam: Exam) => {
    if (exam.webcamRequired && !webcamEnabled) {
      alert("Please enable webcam to start this exam.");
      return;
    }
    
    setSelectedExam(exam);
    setTimeRemaining(exam.duration * 60); // Convert to seconds
    setExamStarted(true);
    setCurrentQuestionIndex(0);
    setTabSwitchCount(0);
  };

  const enableWebcam = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamEnabled(true);
    } catch (error) {
      alert("Webcam access denied. Required for this exam.");
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleFileUpload = (questionId: number, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [questionId]: file }));
  };

  const handleAnswerSheetUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAnswerSheetFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeAnswerSheetFile = (index: number) => {
    setAnswerSheetFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAutoSubmit = () => {
    alert("Time's up! Exam submitted automatically.");
    setExamStarted(false);
    setSelectedExam(null);
  };

  const handleManualSubmit = () => {
    if (confirm("Are you sure you want to submit the exam?")) {
      setExamStarted(false);
      setSelectedExam(null);
      alert("Exam submitted successfully!");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (examStarted && selectedExam) {
    const currentQuestion = selectedExam.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedExam.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Exam Header */}
          <Card className="p-4 mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedExam.title}</h1>
                <p className="text-sm text-gray-600">Subject: {selectedExam.subject}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{formatTime(timeRemaining)}</div>
                <div className="text-sm text-gray-600">Time Remaining</div>
              </div>
            </div>
            
            {/* Mode Selector and Status */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={uploadMode === 'online' ? 'default' : 'outline'}
                    onClick={() => setUploadMode('online')}
                    className="text-xs"
                  >
                    Online Exam
                  </Button>
                  <Button
                    size="sm"
                    variant={uploadMode === 'answersheet' ? 'default' : 'outline'}
                    onClick={() => setUploadMode('answersheet')}
                    className="text-xs"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Answer Sheet Upload
                  </Button>
                </div>
                <Progress value={progress} className="w-32" />
              </div>
              
              <div className="flex items-center space-x-4">
                {selectedExam.webcamRequired && (
                  <div className="flex items-center space-x-2">
                    <Camera className={`w-4 h-4 ${webcamEnabled ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`text-sm ${webcamEnabled ? 'text-green-600' : 'text-red-600'}`}>
                      {webcamEnabled ? 'Webcam Active' : 'Webcam Required'}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <AlertCircle className={`w-4 h-4 ${tabSwitchCount < 2 ? 'text-yellow-500' : 'text-red-500'}`} />
                  <span className={`text-sm ${tabSwitchCount < 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                    Tab Switches: {tabSwitchCount}/3
                  </span>
                </div>
                {answerSheetFiles.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      {answerSheetFiles.length} file(s) uploaded
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {uploadMode === 'online' ? (
            /* Online Exam Mode */
            <Card className="p-6 mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">Question {currentQuestionIndex + 1} of {selectedExam.questions.length}</Badge>
                  <Badge className="bg-purple-100 text-purple-800">{currentQuestion.marks} marks</Badge>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answer Section */}
              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'short' && (
                <div className="space-y-3">
                  <Input
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full"
                  />
                </div>
              )}

              {currentQuestion.type === 'long' && (
                <div className="space-y-4">
                  <Textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Write your detailed answer here..."
                    className="w-full h-40"
                  />
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Or Upload Answer for this Question</h4>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(currentQuestion.id, file);
                        }}
                        className="hidden"
                        id={`file-${currentQuestion.id}`}
                      />
                      <label
                        htmlFor={`file-${currentQuestion.id}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                      </label>
                      {uploadedFiles[currentQuestion.id] && (
                        <span className="text-sm text-green-600">
                          ✓ {uploadedFiles[currentQuestion.id].name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            /* Answer Sheet Upload Mode */
            <Card className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 shadow-lg">
              <div className="text-center mb-6">
                <Upload className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Your Answer Sheet
                </h2>
                <p className="text-gray-600">
                  Upload photos or scanned copies of your handwritten answer sheets
                </p>
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    multiple
                    onChange={(e) => handleAnswerSheetUpload(e.target.files)}
                    className="hidden"
                    id="answer-sheet-upload"
                  />
                  <label
                    htmlFor="answer-sheet-upload"
                    className="cursor-pointer"
                  >
                    <div className="space-y-2">
                      <FileImage className="w-12 h-12 text-orange-400 mx-auto" />
                      <div>
                        <span className="text-blue-600 font-medium">Click to upload</span>
                        <span className="text-gray-600"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, JPG, PNG up to 10MB each
                      </p>
                    </div>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {answerSheetFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                    {answerSheetFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeAnswerSheetFile(index)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    📝 Instructions for Answer Sheet Upload:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Write your Name and Roll Number clearly on each page</li>
                    <li>• Number your answers according to the question paper</li>
                    <li>• Ensure good lighting and clear visibility of your handwriting</li>
                    <li>• Upload pages in the correct order</li>
                    <li>• Multiple file formats supported: PDF, JPG, PNG, DOC</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {uploadMode === 'online' ? (
              <>
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {currentQuestionIndex < selectedExam.questions.length - 1 ? (
                    <Button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      onClick={handleManualSubmit}
                      className="bg-gradient-to-r from-green-500 to-blue-500"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Exam
                    </Button>
                  )}
                </div>
              </>
            ) : (
              /* Answer Sheet Mode Navigation */
              <div className="w-full flex justify-center">
                <Button
                  onClick={handleManualSubmit}
                  disabled={answerSheetFiles.length === 0}
                  className="bg-gradient-to-r from-green-500 to-blue-500 px-8"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Answer Sheets ({answerSheetFiles.length} files)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userRole === 'teacher' ? 'Exam Management' : 'Exams & Quizzes'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'Create and manage exams and quizzes for your students'
              : 'Take your scheduled exams and quizzes'
            }
          </p>
        </div>

        {/* Exam List */}
        <div className="grid gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>Subject: {exam.subject}</span>
                    <span>Duration: {exam.duration} mins</span>
                    <span>Total Marks: {exam.totalMarks}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </Badge>
                    {exam.webcamRequired && (
                      <Badge variant="outline" className="border-orange-300 text-orange-600">
                        <Camera className="w-3 h-3 mr-1" />
                        Webcam Required
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {userRole === 'student' && exam.status === 'upcoming' && (
                    <>
                      {exam.webcamRequired && !webcamEnabled && (
                        <Button
                          onClick={enableWebcam}
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Enable Webcam
                        </Button>
                      )}
                      <Button
                        onClick={() => startExam(exam)}
                        className="bg-gradient-to-r from-green-500 to-blue-500"
                        disabled={exam.webcamRequired && !webcamEnabled}
                      >
                        Start Exam
                      </Button>
                    </>
                  )}
                  
                  {userRole === 'student' && exam.status === 'completed' && (
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Results
                    </Button>
                  )}
                  
                  {userRole === 'teacher' && (
                    <>
                      <Button variant="outline">
                        Edit
                      </Button>
                      <Button variant="outline">
                        View Submissions
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Question Preview */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Questions Preview:</h4>
                <div className="space-y-1">
                  {exam.questions.slice(0, 3).map((question, index) => (
                    <div key={question.id} className="text-sm text-gray-600 flex items-start">
                      <span className="font-medium mr-2">{index + 1}.</span>
                      <span className="flex-1">{question.question.substring(0, 60)}...</span>
                      <span className="text-purple-600 font-medium">{question.marks}m</span>
                    </div>
                  ))}
                  {exam.questions.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{exam.questions.length - 3} more questions
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {userRole === 'teacher' && (
          <Card className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Create New Exam</h3>
              <p className="text-gray-600 mb-4">Design and schedule new exams and quizzes for your students</p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                <FileText className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}