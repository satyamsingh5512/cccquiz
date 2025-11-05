export interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  quizId: string;
  createdAt?: Date;
}

export interface Quiz {
  _id?: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt?: Date;
  isActive: boolean;
  accessCode: string;
  timeLimit?: number; // in minutes, 0 or undefined means no time limit
}

export interface QuizAttempt {
  _id?: string;
  quizId: string;
  quizTitle?: string;
  userName: string;
  userEmail: string;
  rollNumber: string;
  answers: { questionId: string; selectedAnswer: number }[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
}
