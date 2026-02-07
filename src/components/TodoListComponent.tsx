import { useState } from "react";
import { Plus, Check, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'assignment' | 'study' | 'exam' | 'personal';
}

interface TodoListComponentProps {
  onNavigate: (screen: string) => void;
}

export function TodoListComponent({ onNavigate }: TodoListComponentProps) {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, task: "Complete Math Assignment Chapter 5", completed: false, dueDate: "2024-01-15", priority: 'high', category: 'assignment' },
    { id: 2, task: "Study Physics Notes for Quiz", completed: false, dueDate: "2024-01-12", priority: 'medium', category: 'study' },
    { id: 3, task: "Review Chemistry Lab Report", completed: true, priority: 'low', category: 'assignment' },
  ]);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TodoItem['category']>('assignment');

  const addTodo = () => {
    if (newTask.trim()) {
      const newTodo: TodoItem = {
        id: Date.now(),
        task: newTask,
        completed: false,
        priority: 'medium',
        category: selectedCategory
      };
      setTodos([...todos, newTodo]);
      setNewTask("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assignment': return '📝';
      case 'study': return '📚';
      case 'exam': return '📊';
      case 'personal': return '👤';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My To-Do List</h1>
          <p className="text-gray-600">Stay organized and track your academic tasks</p>
        </div>

        {/* Add New Task */}
        <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as TodoItem['category'])}
                className="px-3 py-2 rounded-lg border bg-white"
              >
                <option value="assignment">Assignment</option>
                <option value="study">Study</option>
                <option value="exam">Exam</option>
                <option value="personal">Personal</option>
              </select>
              <Button onClick={addTodo} className="bg-gradient-to-r from-purple-500 to-blue-500">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">{todos.length}</div>
              <div className="text-sm text-blue-600">Total Tasks</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{todos.filter(t => t.completed).length}</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-800">{todos.filter(t => !t.completed).length}</div>
              <div className="text-sm text-orange-600">Pending</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">{todos.filter(t => t.priority === 'high' && !t.completed).length}</div>
              <div className="text-sm text-purple-600">High Priority</div>
            </div>
          </Card>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {todos.map((todo) => (
            <Card key={todo.id} className={`p-4 transition-all duration-200 hover:shadow-lg border-0 ${
              todo.completed ? 'bg-gray-50/70 opacity-75' : 'bg-white/70'
            } backdrop-blur-sm`}>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {todo.completed && <Check className="w-4 h-4" />}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getCategoryIcon(todo.category)}</span>
                    <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {todo.task}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(todo.priority)}`}>
                      {todo.priority.toUpperCase()}
                    </span>
                    {todo.dueDate && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{todo.dueDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {todos.length === 0 && (
          <Card className="p-8 text-center bg-white/70 backdrop-blur-sm border-0">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">✅</div>
              <p>No tasks yet. Add your first task above!</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}