import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import logoImage from "figma:asset/338617c2b7ec5356fb321555f6e0695b4f0ae91b.png";

interface LoginScreenProps {
  onLogin: (role: 'student' | 'teacher' | 'admin') => void;
}

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  student: { email: "student@resovista.edu", password: "student123" },
  teacher: { email: "teacher@resovista.edu", password: "teacher123" },
  admin: { email: "admin@resovista.edu", password: "admin123" },
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Check credentials
    setTimeout(() => {
      let authenticated = false;
      let userRole: 'student' | 'teacher' | 'admin' | null = null;

      // Check against demo credentials
      if (email === DEMO_CREDENTIALS.student.email && password === DEMO_CREDENTIALS.student.password) {
        authenticated = true;
        userRole = 'student';
      } else if (email === DEMO_CREDENTIALS.teacher.email && password === DEMO_CREDENTIALS.teacher.password) {
        authenticated = true;
        userRole = 'teacher';
      } else if (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) {
        authenticated = true;
        userRole = 'admin';
      }

      if (authenticated && userRole) {
        // Store user session in localStorage
        localStorage.setItem('resovista_user', JSON.stringify({
          email,
          role: userRole,
          loginTime: new Date().toISOString()
        }));
        onLogin(userRole);
      } else {
        setError("Invalid email or password. Please try again.");
      }
      setLoading(false);
    }, 800); // Simulate network delay
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto">
            <img 
              src={logoImage} 
              alt="ResoVista Logo" 
              className="w-40 h-40 mx-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl text-gray-900">ResoVista</h1>
            <p className="text-gray-600 mt-2">Remote Learning Platform</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button className="text-blue-600 hover:text-blue-800">
                Request Access
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Designed for rural education accessibility</p>
          <p>© 2024 ResoVista. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}