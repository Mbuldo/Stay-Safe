// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Resource types
export interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  url?: string;
  imageUrl?: string;
  type: 'article' | 'video' | 'tool' | 'hotline' | 'service' | 'guide';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

// AI types
export interface AIPromptContext {
  userAge: number;
  userGender?: string;
  assessmentCategory: string;
  responses: any[];
  previousAssessments?: any[];
}

export interface AIResponse {
  analysis: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  recommendations: string[];
  resources: Array<{
    title: string;
    description: string;
    url?: string;
    type: string;
  }>;
  followUpQuestions?: string[];
}

// Chat/Conversation types
export interface Message {
  id: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    category?: string;
    sentiment?: string;
    flagged?: boolean;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  category?: string;
  status: 'active' | 'archived' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

// Analytics types
export interface UserAnalytics {
  userId: string;
  totalAssessments: number;
  assessmentsByCategory: Record<string, number>;
  averageRiskLevel: number;
  lastAssessmentDate?: Date;
  resourcesViewed: number;
  activeStreak: number;
  lastActiveDate: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'alert' | 'tip' | 'update';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Settings types
export interface AppSettings {
  version: string;
  features: {
    aiChat: boolean;
    assessments: boolean;
    resources: boolean;
    analytics: boolean;
    notifications: boolean;
  };
  limits: {
    maxAssessmentsPerDay: number;
    maxChatMessagesPerDay: number;
    sessionTimeout: number;
  };
}