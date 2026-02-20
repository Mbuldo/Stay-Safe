import { z } from 'zod';

export const RiskLevelSchema = z.enum(['low', 'moderate', 'high', 'critical']);

export const AssessmentCategorySchema = z.enum([
  'contraception',
  'sti-risk',
  'pregnancy',
  'menstrual-health',
  'sexual-health',
  'mental-health',
  'general-wellness',
]);

export const QuestionResponseSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  answer: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
  category: AssessmentCategorySchema,
});

export const AssessmentSubmissionSchema = z.object({
  userId: z.string().uuid(),
  category: AssessmentCategorySchema,
  responses: z.array(QuestionResponseSchema),
  timestamp: z.date().default(() => new Date()),
});

export const AssessmentResultSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  category: AssessmentCategorySchema,
  riskLevel: RiskLevelSchema,
  score: z.number().min(0).max(100),
  responses: z.array(QuestionResponseSchema),
  aiAnalysis: z.string(),
  recommendations: z.array(z.string()),
  resources: z.array(z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    type: z.enum(['article', 'video', 'tool', 'hotline', 'service']),
  })),
  createdAt: z.date(),
  expiresAt: z.date().optional(),
});

export const AssessmentHistorySchema = z.object({
  userId: z.string().uuid(),
  assessments: z.array(z.object({
    id: z.string().uuid(),
    category: AssessmentCategorySchema,
    riskLevel: RiskLevelSchema,
    score: z.number(),
    completedAt: z.date(),
  })),
  totalAssessments: z.number(),
});

export const AssessmentQuestionSchema = z.object({
  id: z.string(),
  category: AssessmentCategorySchema,
  text: z.string(),
  type: z.enum(['single-choice', 'multiple-choice', 'text', 'number', 'yes-no', 'scale']),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(true),
  weight: z.number().min(0).max(10).default(5),
  helpText: z.string().optional(),
});

export type RiskLevel = z.infer<typeof RiskLevelSchema>;
export type AssessmentCategory = z.infer<typeof AssessmentCategorySchema>;
export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
export type AssessmentSubmission = z.infer<typeof AssessmentSubmissionSchema>;
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;
export type AssessmentHistory = z.infer<typeof AssessmentHistorySchema>;
export type AssessmentQuestion = z.infer<typeof AssessmentQuestionSchema>;

