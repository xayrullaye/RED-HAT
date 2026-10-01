export interface ModuleProgress {
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore: number;
}

export interface UserProfile {
  username: string;
  fullname: string;
  xp: number;
  rank: string;
  badges: string[];
}

export interface BookmarkItem {
  id: string;
  moduleId: number;
  topicTitle: string;
  createdAt: string;
  notes?: string;
}

export interface TerminalLog {
  id: string;
  level: 'SYSTEM' | 'SECURITY' | 'EXEC' | 'INFO' | 'DANGER' | 'LEARN' | 'LAB' | 'BOOKMARK';
  message: string;
  timestamp: string;
}

export type ActivePage = 'dashboard' | 'lessons' | 'quiz' | 'lab' | 'bookmarks' | 'python_code';
