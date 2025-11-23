export enum Difficulty {
  EASY = 'Dễ',
  MEDIUM = 'Trung bình',
  HARD = 'Khó'
}

export enum Topic {
  ADDITION = 'Phép cộng',
  SUBTRACTION = 'Phép trừ',
  MULTIPLICATION = 'Phép nhân',
  DIVISION = 'Phép chia',
  WORD_PROBLEMS = 'Toán đố'
}

export interface Question {
  id: string;
  text: string;
  options: string[]; // Storing as strings to handle mixed number/text answers potentially
  correctAnswer: string;
  explanation: string;
  funFact?: string;
}

export interface GameState {
  score: number;
  streak: number;
  questions: Question[];
  currentQuestionIndex: number;
  isGameOver: boolean;
  loading: boolean;
  selectedTopic: Topic | null;
  selectedDifficulty: Difficulty | null;
  lives: number;
}

export type Screen = 'WELCOME' | 'TOPIC_SELECT' | 'PLAYING' | 'GAME_OVER';