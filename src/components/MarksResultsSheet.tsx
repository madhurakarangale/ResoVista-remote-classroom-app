import { useState } from "react";
import { TrendingUp, Award, BarChart3, Download, Filter, Calendar, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface ExamResult {
  id: number;
  examName: string;
  subject: string;
  date: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank: number;
  totalStudents: number;
  status: 'published' | 'pending';
}

interface GamePoints {
  subject: string;
  points: number;
  level: string;
  achievements: string[];
}

interface MarksResultsSheetProps {
  userRole: 'student' | 'teacher' | 'admin';
  onNavigate: (screen: string) => void;
}

export function MarksResultsSheet({ userRole, onNavigate }: MarksResultsSheetProps) {
  const [selectedSemester, setSelectedSemester] = useState("current");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const [examResults] = useState<ExamResult[]>([
    { id: 1, examName: "Mid-Term Examination", subject: "Mathematics", date: "2024-01-15", totalMarks: 100, obtainedMarks: 85, percentage: 85, grade: "A", rank: 3, totalStudents: 45, status: 'published' },
    { id: 2, examName: "Unit Test 2", subject: "Physics", date: "2024-01-10", totalMarks: 50, obtainedMarks: 42, percentage: 84, grade: "A", rank: 5, totalStudents: 45, status: 'published' },
    { id: 3, examName: "Quiz 1", subject: "Chemistry", date: "2024-01-08", totalMarks: 25, obtainedMarks: 22, percentage: 88, grade: "A+", rank: 2, totalStudents: 45, status: 'published' },
    { id: 4, examName: "Weekly Test", subject: "Biology", date: "2024-01-05", totalMarks: 30, obtainedMarks: 26, percentage: 87, grade: "A", rank: 4, totalStudents: 45, status: 'published' },
    { id: 5, examName: "Final Exam", subject: "English", date: "2024-01-20", totalMarks: 100, obtainedMarks: 0, percentage: 0, grade: "Pending", rank: 0, totalStudents: 45, status: 'pending' },
  ]);

  const [gamePoints] = useState<GamePoints[]>([
    { subject: "Mathematics", points: 1250, level: "Expert", achievements: ["Quick Solver", "Perfect Score", "Streak Master"] },
    { subject: "Physics", points: 980, level: "Advanced", achievements: ["Lab Master", "Formula Expert"] },
    { subject: "Chemistry", points: 1100, level: "Expert", achievements: ["Reaction Predictor", "Equation Balancer"] },
    { subject: "Biology", points: 850, level: "Intermediate", achievements: ["Diagram Expert"] },
  ]);

  const publishedResults = examResults.filter(result => result.status === 'published');
  const pendingResults = examResults.filter(result => result.status === 'pending');
  
  const averagePercentage = publishedResults.length > 0 
    ? Math.round(publishedResults.reduce((sum, result) => sum + result.percentage, 0) / publishedResults.length)
    : 0;

  const totalGamePoints = gamePoints.reduce((sum, gp) => sum + gp.points, 0);
  const totalAchievements = gamePoints.reduce((sum, gp) => sum + gp.achievements.length, 0);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-blue-100 text-blue-800';
      case 'B+': return 'bg-yellow-100 text-yellow-800';
      case 'B': return 'bg-orange-100 text-orange-800';
      case 'C': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-green-100 text-green-800';
      case 'Beginner': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const subjects = Array.from(new Set(examResults.map(result => result.subject)));

  const filteredResults = examResults.filter(result => {
    const matchesSubject = selectedSubject === "all" || result.subject === selectedSubject;
    return matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userRole === 'student' ? 'My Academic Results' : 'Student Results Overview'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'student' 
              ? 'Track your exam scores, grades, and game achievements'
              : 'Monitor student performance and academic progress'
            }
          </p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">{averagePercentage}%</div>
              <div className="text-sm text-blue-600">Average Score</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{publishedResults.length}</div>
              <div className="text-sm text-green-600">Exams Completed</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">{totalGamePoints}</div>
              <div className="text-sm text-purple-600">Game Points</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-800">{totalAchievements}</div>
              <div className="text-sm text-orange-600">Achievements</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <select 
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-white"
            >
              <option value="current">Current Semester</option>
              <option value="previous">Previous Semester</option>
              <option value="all">All Semesters</option>
            </select>
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
            <Button variant="outline" className="md:ml-auto">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </Card>

        {/* Game Points & Achievements */}
        {userRole === 'student' && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Gaming Achievements & Incentive Points
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gamePoints.map((gp, index) => (
                <div key={index} className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{gp.subject}</h4>
                    <Badge className={getLevelColor(gp.level)}>{gp.level}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">{gp.points} pts</div>
                  <div className="space-y-1">
                    {gp.achievements.map((achievement, i) => (
                      <div key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block mr-1">
                        🏆 {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Total Incentive Points</h4>
                  <p className="text-sm text-gray-600">Can be redeemed for rewards and benefits</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">{totalGamePoints}</div>
                  <Button size="sm" className="mt-2 bg-gradient-to-r from-orange-500 to-red-500">
                    Redeem Points
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Exam Results */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Examination Results
            </h3>
          </div>
          
          <div className="divide-y">
            {filteredResults.map((result) => (
              <div key={result.id} className="p-4 hover:bg-gray-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{result.examName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {result.subject}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {result.date}
                      </span>
                    </div>
                  </div>
                  <Badge className={getGradeColor(result.grade)}>
                    Grade {result.grade}
                  </Badge>
                </div>

                {result.status === 'published' ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {result.obtainedMarks}/{result.totalMarks}
                        </div>
                        <div className="text-xs text-gray-500">Marks Obtained</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{result.percentage}%</div>
                        <div className="text-xs text-gray-500">Percentage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">#{result.rank}</div>
                        <div className="text-xs text-gray-500">Class Rank</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{result.totalStudents}</div>
                        <div className="text-xs text-gray-500">Total Students</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Performance</span>
                        <span>{result.percentage}%</span>
                      </div>
                      <Progress value={result.percentage} className="h-2" />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-gray-500 mb-2">
                      <Clock className="w-8 h-8 mx-auto mb-2" />
                      Result Pending
                    </div>
                    <p className="text-sm text-gray-600">
                      Results will be published soon
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Insights */}
        {userRole === 'student' && publishedResults.length > 0 && (
          <Card className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {publishedResults.filter(r => r.percentage >= 90).length}
                </div>
                <div className="text-sm text-gray-600">Excellent Scores (90%+)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.min(...publishedResults.map(r => r.rank))}
                </div>
                <div className="text-sm text-gray-600">Best Rank Achieved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {publishedResults.filter(r => r.percentage > averagePercentage).length}
                </div>
                <div className="text-sm text-gray-600">Above Average Scores</div>
              </div>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {filteredResults.length === 0 && (
          <Card className="p-8 text-center bg-white/70 backdrop-blur-sm border-0">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No exam results found for the selected criteria.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}