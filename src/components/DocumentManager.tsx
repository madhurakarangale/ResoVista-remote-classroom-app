import { useState } from "react";
import { Upload, Download, FileText, Image, Video, BookOpen, Search, Filter, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'document';
  size: string;
  uploadDate: string;
  category: 'assignment' | 'notes' | 'reference' | 'lab' | 'exam';
  subject: string;
  downloadCount: number;
  thumbnail?: string;
}

interface DocumentManagerProps {
  userRole: 'student' | 'teacher';
  onNavigate: (screen: string) => void;
}

export function DocumentManager({ userRole, onNavigate }: DocumentManagerProps) {
  const [documents] = useState<Document[]>([
    { id: 1, name: "Mathematics_Chapter5_Notes.pdf", type: 'pdf', size: "2.4 MB", uploadDate: "2024-01-10", category: 'notes', subject: "Mathematics", downloadCount: 15 },
    { id: 2, name: "Physics_Lab_Report_Template.pdf", type: 'pdf', size: "1.8 MB", uploadDate: "2024-01-08", category: 'lab', subject: "Physics", downloadCount: 8 },
    { id: 3, name: "Chemistry_Periodic_Table.png", type: 'image', size: "0.9 MB", uploadDate: "2024-01-05", category: 'reference', subject: "Chemistry", downloadCount: 22 },
    { id: 4, name: "Biology_Cell_Structure_Video.mp4", type: 'video', size: "45.2 MB", uploadDate: "2024-01-03", category: 'notes', subject: "Biology", downloadCount: 12 },
    { id: 5, name: "English_Assignment_Guidelines.docx", type: 'document', size: "0.5 MB", uploadDate: "2024-01-01", category: 'assignment', subject: "English", downloadCount: 6 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'image': return <Image className="w-8 h-8 text-blue-500" />;
      case 'video': return <Video className="w-8 h-8 text-purple-500" />;
      case 'document': return <BookOpen className="w-8 h-8 text-green-500" />;
      default: return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'assignment': return 'bg-orange-100 text-orange-800';
      case 'notes': return 'bg-blue-100 text-blue-800';
      case 'reference': return 'bg-green-100 text-green-800';
      case 'lab': return 'bg-purple-100 text-purple-800';
      case 'exam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSubject = selectedSubject === "all" || doc.subject === selectedSubject;
    
    return matchesSearch && matchesCategory && matchesSubject;
  });

  const subjects = Array.from(new Set(documents.map(doc => doc.subject)));
  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  const handleDownload = (doc: Document) => {
    console.log(`Downloading ${doc.name}`);
    // Simulate download
  };

  const handleUpload = () => {
    console.log("Opening file upload dialog");
    // Simulate file upload
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userRole === 'teacher' ? 'Document Management' : 'Study Materials'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'Upload and manage educational resources for your students'
              : 'Access and download study materials, assignments, and resources'
            }
          </p>
        </div>

        {/* Upload Section (Teachers Only) */}
        {userRole === 'teacher' && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Upload New Document</h3>
                <p className="text-sm text-gray-600">Share study materials, assignments, or resources with students</p>
              </div>
              <Button 
                onClick={handleUpload}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents, subjects..."
                className="pl-10"
              />
            </div>
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">{documents.length}</div>
              <div className="text-sm text-blue-600">Total Files</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                {documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
              </div>
              <div className="text-sm text-green-600">Downloads</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">{subjects.length}</div>
              <div className="text-sm text-purple-600">Subjects</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-800">
                {Math.round(documents.reduce((sum, doc) => sum + parseFloat(doc.size), 0) * 10) / 10}
              </div>
              <div className="text-sm text-orange-600">Total MB</div>
            </div>
          </Card>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getFileIcon(doc.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate mb-1">
                    {doc.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge className={`text-xs ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {doc.subject}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Size: {doc.size}</div>
                    <div>Uploaded: {doc.uploadDate}</div>
                    <div>Downloads: {doc.downloadCount}</div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      onClick={() => handleDownload(doc)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="p-8 text-center bg-white/70 backdrop-blur-sm border-0">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">📄</div>
              <p>No documents found matching your criteria.</p>
              {userRole === 'teacher' && (
                <Button onClick={handleUpload} className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Document
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}