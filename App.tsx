import React, { useState, useEffect } from 'react';
import { Difficulty, Topic, GameState, Screen, Question } from './types';
import { generateMathQuestions } from './services/geminiService';
import { Button } from './components/Button';
import { 
  Rocket, 
  Brain, 
  Trophy, 
  Star, 
  RefreshCcw, 
  ArrowRight, 
  Heart,
  CheckCircle,
  XCircle,
  Calculator,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<Screen>('WELCOME');
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    questions: [],
    currentQuestionIndex: 0,
    isGameOver: false,
    loading: false,
    selectedTopic: null,
    selectedDifficulty: null,
    lives: 3
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean>(false);

  const startGame = async (topic: Topic, difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, loading: true, selectedTopic: topic, selectedDifficulty: difficulty }));
    
    // Generate questions
    const questions = await generateMathQuestions(topic, difficulty, 5);
    
    setGameState({
      score: 0,
      streak: 0,
      questions: questions,
      currentQuestionIndex: 0,
      isGameOver: false,
      loading: false,
      selectedTopic: topic,
      selectedDifficulty: difficulty,
      lives: 3
    });
    setScreen('PLAYING');
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return; // Prevent double clicks

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setSelectedAnswer(answer);
    setFeedbackCorrect(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      // Sound effect could go here
    } else {
      // Wrong answer logic
    }
  };

  const nextQuestion = () => {
    const isCorrect = feedbackCorrect;
    
    setGameState(prev => {
      const newScore = isCorrect ? prev.score + (100 + (prev.streak * 10)) : prev.score;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newLives = isCorrect ? prev.lives : prev.lives - 1;
      const nextIndex = prev.currentQuestionIndex + 1;
      const isGameOver = nextIndex >= prev.questions.length || newLives <= 0;

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        lives: newLives,
        currentQuestionIndex: isGameOver ? prev.currentQuestionIndex : nextIndex,
        isGameOver: isGameOver
      };
    });

    setShowFeedback(false);
    setSelectedAnswer(null);

    // If game over was calculated in the state update above, screen won't change immediately due to closure
    // So we check logic again or use useEffect. Let's use the updated state logic in the next render
    // or simply check conditions here for screen transition.
    if (!isCorrect && gameState.lives - 1 <= 0) {
       setScreen('GAME_OVER');
    } else if (gameState.currentQuestionIndex + 1 >= gameState.questions.length) {
       setScreen('GAME_OVER');
    }
  };

  // Screen Components

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-purple-600 p-4 text-center">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-white/30 max-w-md w-full animate-float">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 p-4 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)]">
            <Rocket size={64} className="text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-md">Hành Trình Toán Học</h1>
        <p className="text-xl text-blue-100 mb-8">Thám Hiểm Ngân Hà</p>
        
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => setScreen('TOPIC_SELECT')}
          className="w-full text-2xl"
        >
          Bắt đầu ngay! 🚀
        </Button>
      </div>
    </div>
  );

  const TopicSelectScreen = () => {
    const topics = Object.values(Topic);
    const difficulties = Object.values(Difficulty);
    const [localTopic, setLocalTopic] = useState<Topic>(Topic.ADDITION);
    const [localDiff, setLocalDiff] = useState<Difficulty>(Difficulty.EASY);

    return (
      <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          <Button variant="outline" size="sm" onClick={() => setScreen('WELCOME')} className="mb-6">
             ← Quay lại
          </Button>

          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Chuẩn Bị Nhiệm Vụ</h2>

          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Brain className="text-purple-500" /> Chọn Chủ Đề
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setLocalTopic(t)}
                  className={`p-4 rounded-xl text-left font-semibold transition-all ${
                    localTopic === t 
                    ? 'bg-blue-500 text-white shadow-lg scale-105 ring-4 ring-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-500" /> Chọn Độ Khó
            </h3>
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setLocalDiff(d)}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    localDiff === d 
                    ? 'bg-purple-500 text-white shadow-lg scale-105 ring-4 ring-purple-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {gameState.loading ? (
              <div className="w-full py-4 flex flex-col items-center text-blue-600 animate-pulse">
                 <Calculator className="animate-spin mb-2" size={32} />
                 <p className="font-bold text-lg">Đang hỏi Phù thủy Toán học...</p>
              </div>
            ) : (
              <Button 
                variant="success" 
                size="lg" 
                onClick={() => startGame(localTopic, localDiff)}
                className="w-full"
              >
                Bắt đầu nhiệm vụ!
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PlayingScreen = () => {
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    if (!question) return <div>Đang tải...</div>;

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col max-w-3xl mx-auto shadow-2xl min-h-[100dvh]">
        {/* Header */}
        <div className="bg-white p-4 flex justify-between items-center shadow-md z-10 rounded-b-3xl">
          <div className="flex gap-4">
             <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                <span className="font-bold text-yellow-800">{gameState.score}</span>
             </div>
             <div className="flex items-center gap-1 bg-red-100 px-3 py-1 rounded-full">
                <Heart className="text-red-500 fill-red-500" size={20} />
                <span className="font-bold text-red-800">{gameState.lives}</span>
             </div>
          </div>
          <div className="text-gray-500 font-bold">
            Câu {gameState.currentQuestionIndex + 1} / {gameState.questions.length}
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
              {gameState.selectedTopic} • {gameState.selectedDifficulty}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {question.text}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, idx) => {
              let btnVariant: 'outline' | 'success' | 'danger' | 'primary' = 'outline';
              let opacity = 'opacity-100';

              if (showFeedback) {
                if (option === question.correctAnswer) {
                  btnVariant = 'success';
                } else if (option === selectedAnswer) {
                  btnVariant = 'danger';
                } else {
                  opacity = 'opacity-50';
                }
              } else {
                  // Hover effect managed by CSS in Button component
                  // but we can override base style here if needed
              }

              return (
                <Button
                  key={idx}
                  variant={showFeedback && option === question.correctAnswer ? 'success' : (showFeedback && option === selectedAnswer ? 'danger' : 'outline')}
                  className={`h-20 text-xl md:text-2xl ${opacity}`}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Feedback Overlay / Bottom Sheet */}
        {showFeedback && (
          <div className={`p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-slide-up ${
            feedbackCorrect ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                 <div className={`p-3 rounded-full ${feedbackCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {feedbackCorrect ? <CheckCircle className="text-white" size={32} /> : <XCircle className="text-white" size={32} />}
                 </div>
                 <div>
                   <h3 className={`text-2xl font-bold ${feedbackCorrect ? 'text-green-800' : 'text-red-800'}`}>
                     {feedbackCorrect ? 'Tuyệt vời!' : 'Chưa chính xác!'}
                   </h3>
                   <p className={`text-lg ${feedbackCorrect ? 'text-green-700' : 'text-red-700'}`}>
                     {question.explanation}
                   </p>
                   {question.funFact && feedbackCorrect && (
                      <p className="text-sm text-green-600 mt-1 italic">💡 Sự thật thú vị: {question.funFact}</p>
                   )}
                 </div>
              </div>
              
              <Button onClick={nextQuestion} className="w-full md:w-auto whitespace-nowrap min-w-[160px]">
                {gameState.currentQuestionIndex + 1 === gameState.questions.length ? 'Xem kết quả' : 'Câu hỏi tiếp'} <ArrowRight className="ml-2 inline" size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const GameOverScreen = () => {
    const isWin = gameState.score > 0 && gameState.lives > 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-float">
          <div className="flex justify-center -mt-20 mb-6">
            {isWin ? (
               <Trophy size={100} className="text-yellow-400 drop-shadow-lg filter" />
            ) : (
               <div className="bg-gray-200 rounded-full p-6">
                 <RefreshCcw size={64} className="text-gray-500" />
               </div>
            )}
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            {isWin ? 'Nhiệm Vụ Hoàn Thành!' : 'Thử lại nào!'}
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            {isWin ? 'Bạn là siêu sao toán học!' : 'Hãy tiếp tục luyện tập nhé, bạn sẽ làm được!'}
          </p>

          <div className="bg-indigo-50 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
             <div className="text-center">
                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Tổng Điểm</p>
                <p className="text-3xl font-bold text-indigo-600">{gameState.score}</p>
             </div>
             <div className="text-center border-l-2 border-indigo-100">
                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Chuỗi Thắng</p>
                <p className="text-3xl font-bold text-green-500">{gameState.streak} 🔥</p>
             </div>
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => setScreen('TOPIC_SELECT')}
              className="w-full"
            >
              Chơi Lại
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setScreen('WELCOME')}
              className="w-full"
            >
              Màn Hình Chính
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      {screen === 'WELCOME' && <WelcomeScreen />}
      {screen === 'TOPIC_SELECT' && <TopicSelectScreen />}
      {screen === 'PLAYING' && <PlayingScreen />}
      {screen === 'GAME_OVER' && <GameOverScreen />}
    </div>
  );
}