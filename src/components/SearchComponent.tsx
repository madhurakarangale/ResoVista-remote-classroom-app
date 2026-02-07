import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Search, 
  User, 
  BookOpen, 
  Clock, 
  Star,
  MapPin,
  FileText,
  Calendar
} from "lucide-react";

interface SearchComponentProps {
  userRole: 'student' | 'teacher';
  placeholder: string;
  onSelect?: (item: any) => void;
}

export function SearchComponent({ userRole, placeholder, onSelect }: SearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for different user roles
  const studentSearchData = {
    teachers: [
      {
        id: 1,
        name: "Prof. Rajesh Sharma",
        subject: "Mathematics",
        experience: "15 years",
        rating: 4.8,
        location: "Main Campus",
        availability: "Mon-Fri 9AM-5PM",
        specialization: "Advanced Calculus, Statistics"
      },
      {
        id: 2,
        name: "Dr. Priya Patel",
        subject: "Physics",
        experience: "12 years",
        rating: 4.9,
        location: "Science Block",
        availability: "Tue-Sat 10AM-4PM",
        specialization: "Quantum Physics, Mechanics"
      },
      {
        id: 3,
        name: "Prof. Amit Kumar",
        subject: "Chemistry",
        experience: "10 years",
        rating: 4.7,
        location: "Lab Building",
        availability: "Mon-Thu 8AM-6PM",
        specialization: "Organic Chemistry, Biochemistry"
      }
    ],
    subjects: [
      {
        id: 1,
        name: "Advanced Mathematics",
        teacher: "Prof. Rajesh Sharma",
        schedule: "Mon, Wed, Fri - 10:00 AM",
        enrolled: 45,
        difficulty: "Advanced",
        category: "Core Subject"
      },
      {
        id: 2,
        name: "Physics Laboratory",
        teacher: "Dr. Priya Patel",
        schedule: "Tue, Thu - 2:00 PM",
        enrolled: 32,
        difficulty: "Intermediate",
        category: "Practical"
      },
      {
        id: 3,
        name: "Organic Chemistry",
        teacher: "Prof. Amit Kumar",
        schedule: "Mon, Wed - 11:00 AM",
        enrolled: 38,
        difficulty: "Advanced",
        category: "Core Subject"
      }
    ]
  };

  const teacherSearchData = {
    reports: [
      {
        id: 1,
        title: "Mathematics Class Report - Week 12",
        date: "December 15, 2024",
        class: "Advanced Mathematics",
        students: 45,
        attendance: 87,
        averageScore: 82,
        status: "Completed"
      },
      {
        id: 2,
        title: "Physics Lab Assessment Report",
        date: "December 14, 2024",
        class: "Physics Laboratory",
        students: 32,
        attendance: 94,
        averageScore: 78,
        status: "Under Review"
      },
      {
        id: 3,
        title: "Student Performance Analytics - Chemistry",
        date: "December 13, 2024",
        class: "Organic Chemistry",
        students: 38,
        attendance: 91,
        averageScore: 85,
        status: "Completed"
      }
    ],
    classes: [
      {
        id: 1,
        name: "Advanced Mathematics",
        schedule: "Mon, Wed, Fri - 10:00 AM",
        enrolled: 45,
        room: "Room 101",
        semester: "Fall 2024"
      },
      {
        id: 2,
        name: "Physics Laboratory",
        schedule: "Tue, Thu - 2:00 PM",
        enrolled: 32,
        room: "Lab 201",
        semester: "Fall 2024"
      }
    ]
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Simulate search delay
    setTimeout(() => {
      let results: any[] = [];

      if (userRole === 'student') {
        // Search both teachers and subjects
        const teacherResults = studentSearchData.teachers.filter(teacher =>
          teacher.name.toLowerCase().includes(query.toLowerCase()) ||
          teacher.subject.toLowerCase().includes(query.toLowerCase()) ||
          teacher.specialization.toLowerCase().includes(query.toLowerCase())
        );

        const subjectResults = studentSearchData.subjects.filter(subject =>
          subject.name.toLowerCase().includes(query.toLowerCase()) ||
          subject.teacher.toLowerCase().includes(query.toLowerCase()) ||
          subject.category.toLowerCase().includes(query.toLowerCase())
        );

        results = [
          ...teacherResults.map(t => ({ ...t, type: 'teacher' })),
          ...subjectResults.map(s => ({ ...s, type: 'subject' }))
        ];
      } else if (userRole === 'teacher') {
        // Search reports and classes
        const reportResults = teacherSearchData.reports.filter(report =>
          report.title.toLowerCase().includes(query.toLowerCase()) ||
          report.class.toLowerCase().includes(query.toLowerCase()) ||
          report.status.toLowerCase().includes(query.toLowerCase())
        );

        const classResults = teacherSearchData.classes.filter(cls =>
          cls.name.toLowerCase().includes(query.toLowerCase()) ||
          cls.room.toLowerCase().includes(query.toLowerCase()) ||
          cls.semester.toLowerCase().includes(query.toLowerCase())
        );

        results = [
          ...reportResults.map(r => ({ ...r, type: 'report' })),
          ...classResults.map(c => ({ ...c, type: 'class' }))
        ];
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white border-2 border-purple-200 focus:border-purple-400 rounded-xl"
        />
      </div>

      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            searchResults.map((result, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-l-4"
                style={{
                  borderLeftColor: 
                    result.type === 'teacher' ? '#fb923c' :
                    result.type === 'subject' ? '#22c55e' :
                    result.type === 'report' ? '#3b82f6' :
                    '#a855f7'
                }}
                onClick={() => onSelect?.(result)}
              >
                <CardContent className="p-4">
                  {/* Teacher Results */}
                  {result.type === 'teacher' && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{result.name}</h3>
                            <p className="text-sm text-gray-600">{result.subject} Teacher</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{result.rating}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{result.experience}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{result.location}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>Specialization:</strong> {result.specialization}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Available:</strong> {result.availability}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Subject Results */}
                  {result.type === 'subject' && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{result.name}</h3>
                            <p className="text-sm text-gray-600">by {result.teacher}</p>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(result.difficulty)}>
                          {result.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{result.schedule}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{result.enrolled} students</span>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                    </div>
                  )}

                  {/* Report Results */}
                  {result.type === 'report' && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{result.title}</h3>
                            <p className="text-sm text-gray-600">{result.class}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Date: {result.date}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{result.students} students</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Attendance: {result.attendance}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Score: {result.averageScore}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Class Results */}
                  {result.type === 'class' && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{result.name}</h3>
                            <p className="text-sm text-gray-600">{result.semester}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{result.schedule}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{result.room}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{result.enrolled} enrolled</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}