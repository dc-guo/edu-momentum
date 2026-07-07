import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoScenarios, type DemoScenarioKey } from '../data/demoScenarios';
import type { Level, SessionMix, UserProgress } from '../lib/engine';

export type SessionResult = {
  correctAnswers: number;
  questionsAnswered: number;
  strengths: string[];
  areasToReinforce: string[];
  sessionMix: SessionMix;
  postConfidence?: Level;
};

type StoreState = {
  scenario: DemoScenarioKey;
  user: UserProgress;
  currentSession: SessionMix | null;
  lastResult: SessionResult | null;
  setDemoScenario: (scenario: DemoScenarioKey) => void;
  setCurrentSession: (session: SessionMix | null) => void;
  completeSession: (result: SessionResult) => void;
  setPostConfidence: (confidence: Level) => void;
  returnToDashboard: () => void;
  resetDemo: () => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      scenario: 'steady',
      user: demoScenarios.steady,
      currentSession: null,
      lastResult: null,

      setDemoScenario: (scenario) =>
        set({
          scenario,
          user: demoScenarios[scenario],
          currentSession: null,
          lastResult: null
        }),

      setCurrentSession: (session) => set({ currentSession: session }),

      completeSession: (result) => {
        const user = get().user;
        const missed = result.areasToReinforce;
        const hadNew = result.sessionMix.new > 0;

        set({
          lastResult: result,
          currentSession: null,
          user: {
            ...user,
            streakDays: user.streakDays + 1,
            learningDaysThisWeek: Math.min(7, user.learningDaysThisWeek + 1),
            semesterProgress: Math.min(100, user.semesterProgress + 2),
            consistencyPercentile: Math.min(99, user.consistencyPercentile + 1),
            daysSinceLastSession: 0,
            sessionsWithoutNewLearning: hadNew ? 0 : user.sessionsWithoutNewLearning + 1,
            recentMistakes: Array.from(new Set([...missed, ...user.recentMistakes])).slice(0, 6),
            lastSessionPerformance: result.correctAnswers / result.questionsAnswered
          }
        });
      },

      setPostConfidence: (confidence) => {
        const result = get().lastResult;
        if (result) set({ lastResult: { ...result, postConfidence: confidence } });
      },

      returnToDashboard: () => set({ currentSession: null, lastResult: null }),

      resetDemo: () =>
        set({
          scenario: 'steady',
          user: demoScenarios.steady,
          currentSession: null,
          lastResult: null
        })
    }),
    { name: 'momentum-act-demo' }
  )
);
