import { useState } from "react";
import { Bot, Send, FileText, Users, Sparkles, Clock, BookOpen, Download, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

interface GeneratedNote {
  id: number;
  topic: string;
  subject: string;
  content: string;
  generatedAt: string;
  wordCount: number;
  status: 'generated' | 'sent' | 'draft';
  recipientCount?: number;
}

interface AIAssistantProps {
  userRole: 'teacher';
  onNavigate: (screen: string) => void;
}

export function AIAssistant({ userRole, onNavigate }: AIAssistantProps) {
  const [inputTopic, setInputTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedStyle, setSelectedStyle] = useState("concise");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  
  const [recentNotes] = useState<GeneratedNote[]>([
    {
      id: 1,
      topic: "Quadratic Equations - Solving Methods",
      subject: "Mathematics",
      content: `# Quadratic Equations - Solving Methods

## Overview
A quadratic equation is a polynomial equation of degree 2, written in the standard form: ax² + bx + c = 0

## Key Methods:

### 1. Factoring Method
- Look for common factors
- Use difference of squares: a² - b² = (a+b)(a-b)
- Factor trinomials: ax² + bx + c

### 2. Quadratic Formula
x = (-b ± √(b² - 4ac)) / 2a

### 3. Completing the Square
- Transform equation to (x + p)² = q form
- Take square root of both sides

## Practice Problems:
1. x² - 5x + 6 = 0
2. 2x² + 7x - 4 = 0
3. x² - 9 = 0

## Key Tips:
- Always check your solutions by substitution
- Remember: discriminant b² - 4ac determines nature of roots
- Graph to visualize solutions`,
      generatedAt: "2024-01-15 10:30 AM",
      wordCount: 142,
      status: 'sent',
      recipientCount: 45
    },
    {
      id: 2,
      topic: "Cell Division - Mitosis Process",
      subject: "Biology",
      content: `# Cell Division - Mitosis Process

## Introduction
Mitosis is the process by which a cell divides to produce two genetically identical daughter cells.

## Phases of Mitosis:

### 1. Prophase
- Chromatin condenses into chromosomes
- Nuclear envelope begins to break down
- Centrioles move to opposite poles

### 2. Metaphase
- Chromosomes align at the cell's equator
- Spindle fibers attach to centromeres
- Cell cycle checkpoint occurs

### 3. Anaphase
- Sister chromatids separate
- Chromosomes move to opposite poles
- Cell begins to elongate

### 4. Telophase
- Nuclear envelopes reform
- Chromosomes begin to decondense
- Cytokinesis begins

## Importance:
- Growth and repair of tissues
- Asexual reproduction in some organisms
- Maintains chromosome number

## Common Mistakes:
- Confusing mitosis with meiosis
- Forgetting the checkpoint mechanisms
- Not understanding chromosome behavior`,
      generatedAt: "2024-01-14 02:15 PM",
      wordCount: 156,
      status: 'draft'
    }
  ]);

  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
  const styles = [
    { value: "concise", label: "Concise & Clear" },
    { value: "detailed", label: "Detailed & Comprehensive" },
    { value: "visual", label: "Visual & Diagram-focused" },
    { value: "interactive", label: "Interactive & Engaging" }
  ];

  const generateNotes = async () => {
    if (!inputTopic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const sampleContent = `# ${inputTopic}

## Overview
This comprehensive guide covers the essential concepts and applications of ${inputTopic.toLowerCase()}.

## Key Concepts:

### 1. Fundamental Principles
- Core theoretical foundations
- Mathematical relationships
- Real-world applications

### 2. Problem-Solving Strategies
- Step-by-step approach
- Common techniques
- Error analysis methods

### 3. Practice Examples
Example 1: Basic application
- Problem statement
- Solution approach
- Final answer with explanation

Example 2: Advanced scenario
- Complex problem setup
- Multiple solution paths
- Verification methods

## Important Formulas:
- Formula 1: Relationship between variables
- Formula 2: Calculation methods
- Formula 3: Special cases

## Common Mistakes to Avoid:
- Conceptual misunderstandings
- Calculation errors
- Unit conversion issues

## Study Tips:
- Practice regularly with varied problems
- Create concept maps for better understanding
- Review solutions and learn from mistakes

## Additional Resources:
- Recommended textbook chapters
- Online simulations and tools
- Practice problem sets

## Assessment Guidelines:
- Focus areas for exams
- Types of questions to expect
- Time management strategies`;

    setGeneratedContent(sampleContent);
    setIsGenerating(false);
  };

  const sendToStudents = () => {
    if (generatedContent) {
      alert("Notes sent to all students in the class! They will receive a notification.");
      setGeneratedContent("");
      setInputTopic("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert("Content copied to clipboard!");
  };

  const downloadNotes = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inputTopic || 'AI_Generated_Notes'}.txt`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'generated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Bot className="w-8 h-8 mr-3 text-purple-600" />
            AI Teaching Assistant
          </h1>
          <p className="text-gray-600">
            Generate comprehensive study notes and materials for your students using AI
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">{recentNotes.length}</div>
              <div className="text-sm text-purple-600">Notes Generated</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">
                {recentNotes.filter(note => note.status === 'sent').length}
              </div>
              <div className="text-sm text-blue-600">Notes Shared</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                {recentNotes.reduce((sum, note) => sum + (note.recipientCount || 0), 0)}
              </div>
              <div className="text-sm text-green-600">Total Recipients</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-800">
                {Math.round(recentNotes.reduce((sum, note) => sum + note.wordCount, 0) / recentNotes.length) || 0}
              </div>
              <div className="text-sm text-orange-600">Avg Words</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Generator */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Generate Study Notes
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic/Concept
                  </label>
                  <Input
                    value={inputTopic}
                    onChange={(e) => setInputTopic(e.target.value)}
                    placeholder="e.g., Quadratic Equations, Photosynthesis, Newton's Laws..."
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select 
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                    >
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style
                    </label>
                    <select 
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                    >
                      {styles.map(style => (
                        <option key={style.value} value={style.value}>{style.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button
                  onClick={generateNotes}
                  disabled={!inputTopic.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Notes...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Generate AI Notes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Generated Content */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Generated Content
              </h3>
              
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50 text-sm">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {generatedContent}
                    </pre>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={sendToStudents}
                      className="bg-gradient-to-r from-green-500 to-blue-500"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send to Students
                    </Button>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={downloadNotes}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Enter a topic above and click "Generate AI Notes" to create comprehensive study materials</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Notes */}
        <Card className="mt-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent AI Generated Notes
            </h3>
          </div>
          
          <div className="divide-y">
            {recentNotes.map((note) => (
              <div key={note.id} className="p-4 hover:bg-gray-50/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{note.topic}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Badge variant="outline">{note.subject}</Badge>
                      <Badge className={getStatusColor(note.status)}>
                        {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{note.generatedAt}</div>
                    <div>{note.wordCount} words</div>
                    {note.recipientCount && (
                      <div className="flex items-center mt-1">
                        <Users className="w-3 h-3 mr-1" />
                        {note.recipientCount} students
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg max-h-20 overflow-hidden">
                  {note.content.substring(0, 200)}...
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    <FileText className="w-3 h-3 mr-1" />
                    View Full
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  {note.status === 'draft' && (
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      <Send className="w-3 h-3 mr-1" />
                      Send Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Assistant Features */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">AI Assistant Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  📝
                </div>
                <h4 className="font-medium text-gray-900">Smart Content Generation</h4>
              </div>
              <p className="text-sm text-gray-600">
                Generate comprehensive notes, summaries, and study materials tailored to your curriculum.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  🎯
                </div>
                <h4 className="font-medium text-gray-900">Personalized Learning</h4>
              </div>
              <p className="text-sm text-gray-600">
                Adapt content style and complexity based on student level and learning preferences.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  ⚡
                </div>
                <h4 className="font-medium text-gray-900">Instant Distribution</h4>
              </div>
              <p className="text-sm text-gray-600">
                Share generated content instantly with all students and track engagement.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}