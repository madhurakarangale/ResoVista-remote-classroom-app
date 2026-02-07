import { useState } from "react";
import { Play, Award, Lock, CheckCircle, Clock, Download, BookOpen, Beaker } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface LabSimulator {
  id: number;
  title: string;
  subject: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  progress: number; // percentage
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  prerequisites?: string[];
  certificate: boolean;
  rating: number;
  studentsEnrolled: number;
  thumbnail: string;
  equipment: string[];
  learningOutcomes: string[];
}

interface Certificate {
  id: number;
  labTitle: string;
  completionDate: string;
  score: number;
  certificateId: string;
}

interface LabSimulatorsProps {
  userRole: 'student' | 'teacher';
  onNavigate: (screen: string) => void;
}

export function LabSimulators({ userRole, onNavigate }: LabSimulatorsProps) {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [activeTab, setActiveTab] = useState<'labs' | 'certificates'>('labs');

  const [labs] = useState<LabSimulator[]>([
    {
      id: 1,
      title: "Virtual Chemistry Lab - Acid Base Titration",
      subject: "Chemistry",
      description: "Learn the fundamentals of acid-base titration through interactive virtual experiments. Practice proper technique and data collection.",
      difficulty: 'beginner',
      duration: 45,
      progress: 100,
      status: 'completed',
      certificate: true,
      rating: 4.8,
      studentsEnrolled: 156,
      thumbnail: "🧪",
      equipment: ["Burette", "Conical Flask", "Pipette", "pH Indicator"],
      learningOutcomes: ["Understand titration principles", "Calculate molarity", "Analyze experimental data"]
    },
    {
      id: 2,
      title: "Physics Lab - Simple Pendulum",
      subject: "Physics",
      description: "Investigate the relationship between pendulum length and period through virtual experimentation.",
      difficulty: 'intermediate',
      duration: 60,
      progress: 75,
      status: 'in_progress',
      certificate: true,
      rating: 4.6,
      studentsEnrolled: 98,
      thumbnail: "⚖️",
      equipment: ["Pendulum Bob", "String", "Stopwatch", "Meter Scale"],
      learningOutcomes: ["Understand oscillatory motion", "Apply mathematical formulas", "Analyze experimental errors"]
    },
    {
      id: 3,
      title: "Biology Lab - Microscopy Techniques",
      subject: "Biology",
      description: "Master the art of microscopy and observe various biological specimens in detail.",
      difficulty: 'beginner',
      duration: 40,
      progress: 0,
      status: 'available',
      certificate: true,
      rating: 4.9,
      studentsEnrolled: 203,
      thumbnail: "🔬",
      equipment: ["Compound Microscope", "Slides", "Cover Slips", "Specimens"],
      learningOutcomes: ["Operate microscope properly", "Prepare slides", "Identify cell structures"]
    },
    {
      id: 4,
      title: "Advanced Organic Synthesis",
      subject: "Chemistry",
      description: "Complex organic synthesis reactions and mechanisms for advanced students.",
      difficulty: 'advanced',
      duration: 90,
      progress: 0,
      status: 'locked',
      prerequisites: ["Basic Organic Chemistry", "Reaction Mechanisms"],
      certificate: true,
      rating: 4.7,
      studentsEnrolled: 45,
      thumbnail: "⚗️",
      equipment: ["Reaction Vessels", "Heating Mantle", "Distillation Setup"],
      learningOutcomes: ["Master advanced reactions", "Understand mechanisms", "Design synthesis pathways"]
    },
    {
      id: 5,
      title: "Electronics Lab - Circuit Analysis",
      subject: "Physics",
      description: "Build and analyze electronic circuits using virtual components and instruments.",
      difficulty: 'intermediate',
      duration: 70,
      progress: 30,
      status: 'in_progress',
      certificate: true,
      rating: 4.5,
      studentsEnrolled: 78,
      thumbnail: "🔌",
      equipment: ["Breadboard", "Resistors", "Capacitors", "Multimeter"],
      learningOutcomes: ["Build circuits", "Use measuring instruments", "Analyze circuit behavior"]
    }
  ]);

  const [certificates] = useState<Certificate[]>([
    {
      id: 1,
      labTitle: "Virtual Chemistry Lab - Acid Base Titration",
      completionDate: "2024-01-15",
      score: 92,
      certificateId: "CERT-CHEM-2024-001"
    },
    {
      id: 2,
      labTitle: "Biology Lab - Cell Division",
      completionDate: "2024-01-10",
      score: 88,
      certificateId: "CERT-BIO-2024-002"
    }
  ]);

  const subjects = Array.from(new Set(labs.map(lab => lab.subject)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredLabs = labs.filter(lab => {
    const matchesSubject = selectedSubject === "all" || lab.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "all" || lab.difficulty === selectedDifficulty;
    return matchesSubject && matchesDifficulty;
  });

  const completedLabs = labs.filter(lab => lab.status === 'completed').length;
  const inProgressLabs = labs.filter(lab => lab.status === 'in_progress').length;
  const totalCertificates = certificates.length;
  const averageScore = certificates.length > 0 ? Math.round(certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length) : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-purple-100 text-purple-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startLab = (lab: LabSimulator) => {
    if (lab.status === 'locked') {
      alert(`This lab requires completion of: ${lab.prerequisites?.join(', ')}`);
      return;
    }
    
    alert(`Starting ${lab.title}. You will be redirected to the virtual lab environment.`);
  };

  const downloadCertificate = (certificate: Certificate) => {
    alert(`Downloading certificate for ${certificate.labTitle}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Virtual Lab Simulators
          </h1>
          <p className="text-gray-600">
            Experience hands-on learning through interactive virtual laboratory experiments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setActiveTab('labs')}
            className={`${activeTab === 'labs' ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'}`}
          >
            <Beaker className="w-4 h-4 mr-2" />
            Lab Simulators
          </Button>
          <Button
            onClick={() => setActiveTab('certificates')}
            className={`${activeTab === 'certificates' ? 'bg-purple-500' : 'bg-gray-200 text-gray-700'}`}
          >
            <Award className="w-4 h-4 mr-2" />
            My Certificates
          </Button>
        </div>

        {activeTab === 'labs' ? (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">{labs.length}</div>
                  <div className="text-sm text-blue-600">Total Labs</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">{completedLabs}</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 border-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-800">{inProgressLabs}</div>
                  <div className="text-sm text-orange-600">In Progress</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-800">{totalCertificates}</div>
                  <div className="text-sm text-purple-600">Certificates</div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-white"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <select 
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-white"
                >
                  <option value="all">All Difficulties</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Lab Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map((lab) => (
                <Card key={lab.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-4xl">{lab.thumbnail}</span>
                    </div>
                    {lab.certificate && (
                      <div className="absolute top-2 right-2">
                        <Award className="w-6 h-6 text-yellow-400 fill-current" />
                      </div>
                    )}
                    {lab.status === 'locked' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {lab.title}
                      </h3>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {lab.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge className={`text-xs ${getDifficultyColor(lab.difficulty)}`}>
                        {lab.difficulty}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(lab.status)}`}>
                        {lab.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lab.subject}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {lab.duration} mins
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {lab.studentsEnrolled} enrolled
                      </div>
                    </div>
                    
                    {lab.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{lab.progress}%</span>
                        </div>
                        <Progress value={lab.progress} className="h-1" />
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => startLab(lab)}
                        className={`flex-1 text-xs ${
                          lab.status === 'locked' 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : lab.status === 'completed'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        }`}
                        disabled={lab.status === 'locked'}
                      >
                        {lab.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            {lab.status === 'in_progress' ? 'Continue' : 'Start'}
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {lab.prerequisites && lab.status === 'locked' && (
                      <div className="mt-2 text-xs text-red-600">
                        Requires: {lab.prerequisites.join(', ')}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Certificates Tab */
          <div>
            {/* Certificate Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-800">{totalCertificates}</div>
                  <div className="text-sm text-yellow-600">Certificates Earned</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">{averageScore}%</div>
                  <div className="text-sm text-green-600">Average Score</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">{completedLabs}</div>
                  <div className="text-sm text-blue-600">Labs Completed</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-800">
                    {Math.round((completedLabs / labs.length) * 100)}%
                  </div>
                  <div className="text-sm text-purple-600">Completion Rate</div>
                </div>
              </Card>
            </div>

            {/* Certificates List */}
            <div className="space-y-4">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {certificate.labTitle}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Completion Date: {certificate.completionDate}</div>
                          <div>Score: {certificate.score}%</div>
                          <div>Certificate ID: {certificate.certificateId}</div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => downloadCertificate(certificate)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {certificates.length === 0 && (
              <Card className="p-8 text-center bg-white/70 backdrop-blur-sm border-0">
                <div className="text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4" />
                  <p className="mb-2">No certificates earned yet.</p>
                  <p className="text-sm">Complete lab simulations to earn certificates!</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}