import { useState, useRef, useEffect } from "react";
import { Pen, Eraser, Square, Circle, Type, Palette, RotateCcw, Save, Share, Trash2, Move } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

interface WhiteboardInterfaceProps {
  userRole: 'teacher' | 'student';
  isLiveClass?: boolean;
  onNavigate: (screen: string) => void;
}

export function WhiteboardInterface({ userRole, isLiveClass = false, onNavigate }: WhiteboardInterfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'move'>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height - 100; // Account for toolbar
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Set default canvas properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (userRole === 'student' && !isLiveClass) return; // Students can only draw in live class

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'text') {
      setTextPosition({ x, y });
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    if (tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || (userRole === 'student' && !isLiveClass)) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeRect(textPosition.x, textPosition.y, x - textPosition.x, y - textPosition.y);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - textPosition.x, 2) + Math.pow(y - textPosition.y, 2));
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(textPosition.x, textPosition.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const addText = () => {
    if (!textInput.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = color;
    ctx.font = `${brushSize * 6}px Arial`;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    setTextInput('');
    setShowTextInput(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setShapes([]);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareWithStudents = () => {
    if (userRole === 'teacher') {
      alert('Whiteboard shared with all students in the live class!');
    }
  };

  const getCursor = () => {
    switch (tool) {
      case 'pen': return 'crosshair';
      case 'eraser': return 'grab';
      case 'text': return 'text';
      case 'move': return 'move';
      default: return 'crosshair';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLiveClass ? 'Live Class Whiteboard' : 'Interactive Whiteboard'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'Draw, write, and explain concepts visually to your students'
              : isLiveClass 
                ? 'Follow along with your teacher\'s explanations'
                : 'Create and practice with visual diagrams'
            }
          </p>
        </div>

        {/* Toolbar */}
        <Card className="p-4 mb-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex flex-wrap items-center gap-3">
            {/* Drawing Tools */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setTool('pen')}
                className={`${tool === 'pen' ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'}`}
                disabled={userRole === 'student' && !isLiveClass}
              >
                <Pen className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setTool('eraser')}
                className={`${tool === 'eraser' ? 'bg-red-500' : 'bg-gray-200 text-gray-700'}`}
                disabled={userRole === 'student' && !isLiveClass}
              >
                <Eraser className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setTool('rectangle')}
                className={`${tool === 'rectangle' ? 'bg-green-500' : 'bg-gray-200 text-gray-700'}`}
                disabled={userRole === 'student' && !isLiveClass}
              >
                <Square className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setTool('circle')}
                className={`${tool === 'circle' ? 'bg-purple-500' : 'bg-gray-200 text-gray-700'}`}
                disabled={userRole === 'student' && !isLiveClass}
              >
                <Circle className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setTool('text')}
                className={`${tool === 'text' ? 'bg-yellow-500' : 'bg-gray-200 text-gray-700'}`}
                disabled={userRole === 'student' && !isLiveClass}
              >
                <Type className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setTool('move')}
                className={`${tool === 'move' ? 'bg-indigo-500' : 'bg-gray-200 text-gray-700'}`}
                disabled={userRole === 'student' && !isLiveClass}
              >
                <Move className="w-4 h-4" />
              </Button>
            </div>

            {/* Brush Size */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-20"
                disabled={userRole === 'student' && !isLiveClass}
              />
              <span className="text-sm text-gray-600 w-4">{brushSize}</span>
            </div>

            {/* Color Palette */}
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-600" />
              <div className="flex space-x-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      color === c ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                    disabled={userRole === 'student' && !isLiveClass}
                  />
                ))}
              </div>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
                disabled={userRole === 'student' && !isLiveClass}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-2 ml-auto">
              <Button
                onClick={clearCanvas}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                disabled={userRole === 'student' && !isLiveClass}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                onClick={saveCanvas}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              {userRole === 'teacher' && isLiveClass && (
                <Button
                  onClick={shareWithStudents}
                  className="bg-gradient-to-r from-green-500 to-blue-500"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share with Students
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Text Input Modal */}
        {showTextInput && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 bg-white m-4">
              <h3 className="font-semibold text-gray-900 mb-4">Add Text</h3>
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text to add to whiteboard..."
                className="mb-4"
                onKeyPress={(e) => e.key === 'Enter' && addText()}
              />
              <div className="flex space-x-2">
                <Button onClick={addText} className="bg-blue-500">
                  Add Text
                </Button>
                <Button 
                  onClick={() => setShowTextInput(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Canvas Container */}
        <Card className="bg-white shadow-lg border-0 overflow-hidden">
          <div className="relative" style={{ height: '70vh' }}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={() => setIsDrawing(false)}
              className="absolute inset-0 cursor-crosshair"
              style={{ cursor: getCursor() }}
            />
            
            {/* Instructions for students */}
            {userRole === 'student' && !isLiveClass && (
              <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-lg font-medium mb-2">Whiteboard Available in Live Classes</p>
                  <p>Join a live class to interact with the whiteboard</p>
                </div>
              </div>
            )}
            
            {/* Live indicator */}
            {isLiveClass && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Whiteboard Features Info */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Whiteboard Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  🎨
                </div>
                <h4 className="font-medium text-gray-900">Drawing Tools</h4>
              </div>
              <p className="text-sm text-gray-600">
                Use pen, eraser, shapes, and text tools to create comprehensive visual explanations.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  📤
                </div>
                <h4 className="font-medium text-gray-900">Real-time Sharing</h4>
              </div>
              <p className="text-sm text-gray-600">
                Share your whiteboard instantly with students during live classes for interactive learning.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  💾
                </div>
                <h4 className="font-medium text-gray-900">Save & Export</h4>
              </div>
              <p className="text-sm text-gray-600">
                Save your whiteboard content and share it with students for later reference.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}