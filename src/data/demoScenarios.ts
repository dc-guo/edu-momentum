import type { UserProgress } from '../lib/engine';

export type DemoScenarioKey = 'steady' | 'rebuild' | 'growth';

export const demoScenarios: Record<DemoScenarioKey, UserProgress> = {
  steady: {
    id: 'alex',
    name: 'Alex (Steady Progress)',
    readiness: 'medium',
    confidence: 'medium',
    streakDays: 6,
    learningDaysThisWeek: 4,
    semesterProgress: 42,
    consistencyPercentile: 64,
    daysSinceLastSession: 0,
    sessionsWithoutNewLearning: 0,
    recentMistakes: ['Punctuation', 'Ratios'],
    lastSessionPerformance: 0.72
  },
  rebuild: {
    id: 'maya',
    name: 'Maya (Rebuilding Momentum)',
    readiness: 'low',
    confidence: 'low',
    streakDays: 1,
    learningDaysThisWeek: 1,
    semesterProgress: 28,
    consistencyPercentile: 38,
    daysSinceLastSession: 3,
    sessionsWithoutNewLearning: 2,
    recentMistakes: ['eng-2', 'Algebra', 'Inference', 'Experimental Design'],
    lastSessionPerformance: 0.42
  },
  growth: {
    id: 'jordan',
    name: 'Jordan (Growth Mode)',
    readiness: 'high',
    confidence: 'high',
    streakDays: 8,
    learningDaysThisWeek: 5,
    semesterProgress: 55,
    consistencyPercentile: 82,
    daysSinceLastSession: 0,
    sessionsWithoutNewLearning: 0,
    recentMistakes: ['Functions'],
    lastSessionPerformance: 0.88
  }
};
