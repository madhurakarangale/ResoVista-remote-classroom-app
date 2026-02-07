import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  Gamepad2, 
  Medal, 
  Crown,
  Zap,
  Brain,
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  TrendingUp,
  Users,
  Gift
} from "lucide-react";

interface GamificationSectionProps {
  onNavigate: (screen: string) => void;
}

export function GamificationSection({ onNavigate }: GamificationSectionProps) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(false);

  // Mock user stats
  const userStats = {
    totalPoints: 2450,
    level: 12,
    rank: 8,
    badges: 15,
    streakDays: 7,
    weeklyGoal: 500,
    weeklyProgress: 340
  };

  // Available games
  const games = [
    {
      id: 1,
      title: "Math Lightning",
      description: "Quick arithmetic challenges",
      icon: Calculator,
      subject: "Mathematics",
      difficulty: "Easy",
      points: 50,
      color: "bg-blue-500",
      players: 234
    },
    {
      id: 2,
      title: "Physics Puzzles",
      description: "Solve physics problems",
      icon: Atom,
      subject: "Physics",
      difficulty: "Medium",
      points: 75,
      color: "bg-green-500",
      players: 189
    },
    {
      id: 3,
      title: "Chemistry Lab",
      description: "Virtual experiments",
      icon: FlaskConical,
      subject: "Chemistry",
      difficulty: "Hard",
      points: 100,
      color: "bg-purple-500",
      players: 156
    },
    {
      id: 4,
      title: "Logic Masters",
      description: "Critical thinking games",
      icon: Brain,
      subject: "Logic",
      difficulty: "Medium",
      points: 80,
      color: "bg-orange-500",
      players: 201
    }
  ];

  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: "Priya Sharma", points: 3250, badge: "👑", level: 15 },
    { rank: 2, name: "Raj Kumar", points: 3100, badge: "🥈", level: 14 },
    { rank: 3, name: "Amit Singh", points: 2890, badge: "🥉", level: 13 },
    { rank: 4, name: "Maya Patel", points: 2750, badge: "⭐", level: 12 },
    { rank: 5, name: "Rohit Verma", points: 2650, badge: "⭐", level: 12 },
    { rank: 6, name: "Sneha Gupta", points: 2580, badge: "⭐", level: 11 },
    { rank: 7, name: "Vikash Yadav", points: 2520, badge: "⭐", level: 11 },
    { rank: 8, name: "You", points: userStats.totalPoints, badge: "⭐", level: userStats.level, isUser: true }
  ];

  // Badges/Achievements
  const badges = [
    { id: 1, name: "First Steps", description: "Complete your first game", icon: "🎯", earned: true },
    { id: 2, name: "Math Master", description: "Score 100% in 5 math games", icon: "🧮", earned: true },
    { id: 3, name: "Speed Demon", description: "Complete a game in under 60 seconds", icon: "⚡", earned: true },
    { id: 4, name: "Streak Champion", description: "Play games for 7 days straight", icon: "🔥", earned: true },
    { id: 5, name: "Knowledge Seeker", description: "Play games in all subjects", icon: "📚", earned: false },
    { id: 6, name: "Top 10", description: "Reach top 10 in leaderboard", icon: "🏆", earned: false }
  ];

  // Simple math game logic
  const [mathQuestion, setMathQuestion] = useState({ a: 0, b: 0, operation: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [questionCount, setQuestionCount] = useState(0);

  const generateMathQuestion = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer = 0;
    switch (operation) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '*': answer = a * b; break;
    }
    
    setMathQuestion({ a, b, operation, answer });
  };

  const startGame = (gameId: number) => {
    setSelectedGame(gameId);
    setGameInProgress(true);
    setCurrentScore(0);
    setQuestionCount(0);
    if (gameId === 1) { // Math Lightning
      generateMathQuestion();
    }
  };

  const checkAnswer = () => {
    if (parseInt(userAnswer) === mathQuestion.answer) {
      setCurrentScore(currentScore + 10);
      setQuestionCount(questionCount + 1);
      setUserAnswer('');
      if (questionCount < 9) { // 10 questions total
        generateMathQuestion();
      } else {
        // Game complete
        setGameInProgress(false);
        setSelectedGame(null);
      }
    } else {
      // Wrong answer, show feedback
      setUserAnswer('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center">
                <Trophy className="w-6 h-6 mr-2" />
                Learning Games
              </h1>
              <p className="text-purple-100">Challenge yourself and earn rewards!</p>
            </div>
            <div className="text-right">
              <p className="text-purple-100">Level {userStats.level}</p>
              <p className="text-2xl font-bold">{userStats.totalPoints}</p>
              <p className="text-sm text-purple-200">Total Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game in Progress */}
      {gameInProgress && selectedGame === 1 && (
        <div className="p-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                  Math Lightning
                </span>
                <Badge className="bg-blue-600">
                  Question {questionCount + 1}/10
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {mathQuestion.a} {mathQuestion.operation} {mathQuestion.b} = ?
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="w-32 p-2 text-center border rounded-lg text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  <Button onClick={checkAnswer} disabled={!userAnswer}>
                    Submit
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                  <span>Score: {currentScore}</span>
                  <Progress value={(questionCount / 10) * 100} className="w-32" />
                  <span>Progress: {questionCount}/10</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* User Stats Dashboard */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Current Rank</p>
                  <p className="text-2xl font-bold">#{userStats.rank}</p>
                </div>
                <Crown className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Badges Earned</p>
                  <p className="text-2xl font-bold">{userStats.badges}</p>
                </div>
                <Medal className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Weekly Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Progress to goal</span>
              <span className="font-medium">{userStats.weeklyProgress}/{userStats.weeklyGoal} points</span>
            </div>
            <Progress value={(userStats.weeklyProgress / userStats.weeklyGoal) * 100} />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{userStats.streakDays} day streak 🔥</span>
              <span>{userStats.weeklyGoal - userStats.weeklyProgress} points to go</span>
            </div>
          </CardContent>
        </Card>

        {/* Available Games */}
        {!gameInProgress && (
          <div className="space-y-4">
            <h2 className="flex items-center">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Available Games
            </h2>
            
            <div className="space-y-3">
              {games.map((game) => {
                const IconComponent = game.icon;
                return (
                  <Card key={game.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{game.title}</h3>
                            <p className="text-sm text-gray-600">{game.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {game.subject}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  game.difficulty === 'Easy' ? 'text-green-600' :
                                  game.difficulty === 'Medium' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}
                              >
                                {game.difficulty}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {game.players}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            +{game.points} points
                          </div>
                          <Button size="sm" onClick={() => startGame(game.id)}>
                            Play Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((player) => (
                <div 
                  key={player.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">#{player.rank}</span>
                    </div>
                    <div>
                      <p className={`font-medium ${player.isUser ? 'text-blue-900' : ''}`}>
                        {player.name} {player.badge}
                      </p>
                      <p className="text-sm text-gray-600">Level {player.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{player.points.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges/Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Medal className="w-5 h-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-lg border text-center ${
                    badge.earned 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                  {badge.earned && (
                    <Badge size="sm" className="mt-2 bg-yellow-500">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Store Preview */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Rewards Store
                </h3>
                <p className="text-indigo-100 text-sm">Redeem points for prizes!</p>
                <p className="text-indigo-200 text-xs">New rewards added weekly</p>
              </div>
              <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                Browse Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}