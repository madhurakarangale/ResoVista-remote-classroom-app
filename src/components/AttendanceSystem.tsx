import { useState } from "react";
import { Calendar, Users, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  present: boolean | null; // null = not marked, true = present, false = absent
  timeIn?: string;
}

interface AttendanceRecord {
  date: string;
  subject: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
}

interface AttendanceSystemProps {
  userRole: 'teacher' | 'admin';
  onNavigate: (screen: string) => void;
}

export function AttendanceSystem({ userRole, onNavigate }: AttendanceSystemProps) {
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Rahul Sharma", rollNumber: "2024001", present: true, timeIn: "09:15 AM" },
    { id: 2, name: "Priya Singh", rollNumber: "2024002", present: true, timeIn: "09:10 AM" },
    { id: 3, name: "Amit Kumar", rollNumber: "2024003", present: false },
    { id: 4, name: "Sneha Patel", rollNumber: "2024004", present: null },
    { id: 5, name: "Rohit Gupta", rollNumber: "2024005", present: true, timeIn: "09:20 AM" },
    { id: 6, name: "Anjali Verma", rollNumber: "2024006", present: null },
    { id: 7, name: "Vikash Singh", rollNumber: "2024007", present: false },
    { id: 8, name: "Pooja Sharma", rollNumber: "2024008", present: true, timeIn: "09:05 AM" },
  ]);

  const [attendanceHistory] = useState<AttendanceRecord[]>([
    { date: "2024-01-10", subject: "Mathematics", totalStudents: 8, presentCount: 6, absentCount: 2 },
    { date: "2024-01-09", subject: "Physics", totalStudents: 8, presentCount: 7, absentCount: 1 },
    { date: "2024-01-08", subject: "Chemistry", totalStudents: 8, presentCount: 5, absentCount: 3 },
    { date: "2024-01-05", subject: "Mathematics", totalStudents: 8, presentCount: 8, absentCount: 0 },
  ]);

  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];

  const markAttendance = (studentId: number, status: boolean) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { 
            ...student, 
            present: status, 
            timeIn: status ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined 
          }
        : student
    ));
  };

  const markAllPresent = () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStudents(prev => prev.map(student => ({
      ...student,
      present: true,
      timeIn: currentTime
    })));
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({
      ...student,
      present: false,
      timeIn: undefined
    })));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = students.filter(s => s.present === true).length;
  const absentCount = students.filter(s => s.present === false).length;
  const unmarkedCount = students.filter(s => s.present === null).length;
  const attendancePercentage = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userRole === 'teacher' ? 'Take Attendance' : 'Attendance Overview'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'Mark student attendance for today\'s class'
              : 'Monitor and review attendance records'
            }
          </p>
        </div>

        {/* Class Info & Controls */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{currentDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-white"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {userRole === 'teacher' && (
              <div className="flex space-x-2">
                <Button 
                  onClick={markAllPresent}
                  className="bg-gradient-to-r from-green-500 to-blue-500"
                >
                  Mark All Present
                </Button>
                <Button 
                  onClick={markAllAbsent}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Mark All Absent
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">{students.length}</div>
              <div className="text-sm text-blue-600">Total Students</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{presentCount}</div>
              <div className="text-sm text-green-600">Present</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-red-100 to-red-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-800">{absentCount}</div>
              <div className="text-sm text-red-600">Absent</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">{attendancePercentage}%</div>
              <div className="text-sm text-purple-600">Attendance</div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students by name or roll number..."
              className="pl-10"
            />
          </div>
        </Card>

        {/* Student List */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Student List</h3>
            {unmarkedCount > 0 && (
              <p className="text-sm text-orange-600 mt-1">
                {unmarkedCount} students not marked yet
              </p>
            )}
          </div>
          
          <div className="divide-y">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                    {student.timeIn && (
                      <div className="text-xs text-green-600 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {student.timeIn}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {student.present === true && (
                    <Badge className="bg-green-100 text-green-800">Present</Badge>
                  )}
                  {student.present === false && (
                    <Badge className="bg-red-100 text-red-800">Absent</Badge>
                  )}
                  {student.present === null && (
                    <Badge variant="outline">Not Marked</Badge>
                  )}
                  
                  {userRole === 'teacher' && (
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        onClick={() => markAttendance(student.id, true)}
                        className={`${student.present === true 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => markAttendance(student.id, false)}
                        className={`${student.present === false 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Attendance History */}
        {userRole === 'admin' && (
          <Card className="mt-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Recent Attendance Records</h3>
            </div>
            <div className="divide-y">
              {attendanceHistory.map((record, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{record.subject}</div>
                    <div className="text-sm text-gray-500">{record.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="text-green-600">{record.presentCount} Present</span>
                      {" / "}
                      <span className="text-red-600">{record.absentCount} Absent</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((record.presentCount / record.totalStudents) * 100)}% Attendance
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}