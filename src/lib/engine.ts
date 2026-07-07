import questions from '../data/questions.json';

export type Level = 'low' | 'medium' | 'high';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionRole = 'review' | 'new' | 'confidence';
export type SessionIntent = 'rebuild' | 'balanced' | 'growth';

export type Question = {
  id: string;
  exam: 'ACT';
  section: 'English' | 'Math' | 'Reading' | 'Science';
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
};

export type SessionQuestion = Question & { role: QuestionRole };

export type UserProgress = {
  id: string;
  name: string;
  readiness: Level;
  confidence: Level;
  streakDays: number;
  learningDaysThisWeek: number;
  semesterProgress: number;
  consistencyPercentile: number;
  daysSinceLastSession: number;
  sessionsWithoutNewLearning: number;
  recentMistakes: string[];
  lastSessionPerformance: number;
};

export type SessionMix = {
  review: number;
  new: number;
  confidence: number;
  reasoning: string;
  sessionIntent: SessionIntent;
  questions: SessionQuestion[];
};

const allQuestions = questions as Question[];

function clampCounts(review: number, newLearning: number, confidence: number) {
  let counts = { review, new: newLearning, confidence };

  if (counts.review < 2) {
    const needed = 2 - counts.review;
    counts.review += needed;
    if (counts.new >= needed) counts.new -= needed;
    else counts.confidence = Math.max(1, counts.confidence - needed);
  }

  if (counts.confidence < 1) {
    counts.confidence += 1;
    if (counts.new > 0) counts.new -= 1;
    else counts.review = Math.max(2, counts.review - 1);
  }

  while (counts.review + counts.new + counts.confidence < 5) {
    counts.review += 1;
  }

  while (counts.review + counts.new + counts.confidence > 5) {
    if (counts.new > 0) counts.new -= 1;
    else if (counts.confidence > 1) counts.confidence -= 1;
    else counts.review -= 1;
  }

  return counts;
}

function baseCounts(user: UserProgress) {
  if (user.readiness === 'low' && user.confidence === 'low') {
    return { review: 3, new: 0, confidence: 2, sessionIntent: 'rebuild' as const };
  }

  if (user.readiness === 'low' && user.confidence === 'high') {
    return { review: 3, new: 0, confidence: 2, sessionIntent: 'balanced' as const };
  }

  if (user.readiness === 'high' && user.confidence === 'high') {
    return { review: 2, new: 2, confidence: 1, sessionIntent: 'growth' as const };
  }

  return { review: 2, new: 1, confidence: 2, sessionIntent: 'balanced' as const };
}

function chooseQuestions(
  role: QuestionRole,
  count: number,
  user: UserProgress,
  selected: SessionQuestion[]
) {
  const selectedIds = new Set(selected.map((q) => q.id));
  const selectedTopics = new Set(selected.map((q) => q.topic));

  const roleFilter = (q: Question) => {
    if (role === 'confidence') return q.difficulty !== 'hard';

    if (role === 'review') {
      return (
        user.recentMistakes.includes(q.id) ||
        user.recentMistakes.includes(q.topic) ||
        q.difficulty !== 'hard'
      );
    }

    if (role === 'new') {
      return !user.recentMistakes.includes(q.id) && !user.recentMistakes.includes(q.topic);
    }

    return true;
  };

  const firstPass = allQuestions.filter(
    (q) => !selectedIds.has(q.id) && !selectedTopics.has(q.topic) && roleFilter(q)
  );

  const fallback = allQuestions.filter((q) => !selectedIds.has(q.id) && roleFilter(q));
  const finalFallback = allQuestions.filter((q) => !selectedIds.has(q.id));

  const pool = firstPass.length >= count ? firstPass : fallback.length >= count ? fallback : finalFallback;

  return pool.slice(0, count).map((q) => ({ ...q, role }));
}

export function generateSessionMix(user: UserProgress): SessionMix {
  let { review, new: newLearning, confidence, sessionIntent } = baseCounts(user);
  const reasons: string[] = [];

  if (user.daysSinceLastSession >= 2) {
    review += 1;
    confidence += 1;
    if (newLearning > 0) newLearning -= 1;
    sessionIntent = 'rebuild';
    reasons.push('This session focuses on rebuilding momentum after a short break.');
  }

  if (user.sessionsWithoutNewLearning >= 2 && newLearning === 0) {
    newLearning = 1;
    review = Math.max(2, review - 1);
    reasons.push('It also includes one new concept so forward progress continues steadily.');
  }

  const counts = clampCounts(review, newLearning, confidence);

  const selected: SessionQuestion[] = [];
  selected.push(...chooseQuestions('confidence', counts.confidence, user, selected));
  selected.push(...chooseQuestions('review', counts.review, user, selected));
  selected.push(...chooseQuestions('new', counts.new, user, selected));

  while (selected.length < 5) {
    selected.push(...chooseQuestions('review', 1, user, selected));
  }

  const intentReason =
    sessionIntent === 'rebuild'
      ? 'Today’s session emphasizes review and confidence-building to reinforce recent concepts and rebuild momentum.'
      : sessionIntent === 'growth'
        ? 'Today’s session balances review with building into new concepts.'
        : 'Today’s session is designed for steady progress with review, confidence-building, and a manageable new step.';

  return {
    review: counts.review,
    new: counts.new,
    confidence: counts.confidence,
    reasoning: [intentReason, ...reasons].join(' '),
    sessionIntent,
    questions: selected.slice(0, 5)
  };
}
