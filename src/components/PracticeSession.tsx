import { useMemo, useState } from 'react';
import DailyCheckIn from './DailyCheckIn';
import { generateSessionMix, type Level } from '../lib/engine';
import { useStore } from '../store/useStore';

const roleLabel = {
  confidence: 'confidence builder',
  review: 'review',
  new: 'new learning'
};

const roleBadge = {
  confidence: 'bg-amber-100 text-amber-700',
  review: 'bg-indigo-100 text-indigo-700',
  new: 'bg-emerald-100 text-emerald-700'
};

const roleEmoji = {
  confidence: '💪',
  review: '🔁',
  new: '🌱'
};

export default function PracticeSession() {
  const user = useStore((s) => s.user);
  const initialSession = useStore((s) => s.currentSession);
  const completeSession = useStore((s) => s.completeSession);

  const [readiness, setReadiness] = useState<Level>(user.readiness);
  const [confidence, setConfidence] = useState<Level>(user.confidence);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const sessionMix = useMemo(() => {
    if (!started) return initialSession;
    return generateSessionMix({ ...user, readiness, confidence });
  }, [started, initialSession, user, readiness, confidence]);

  if (!sessionMix) return null;

  const current = sessionMix.questions[index];
  const selected = answers[current.id];
  const isAnswered = Boolean(selected);

  const submitAnswer = (choice: string) => {
    if (isAnswered) return;
    setAnswers({ ...answers, [current.id]: choice.charAt(0) });
  };

  const next = () => {
    if (index < sessionMix.questions.length - 1) {
      setIndex(index + 1);
      return;
    }

    const correct = sessionMix.questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const strengths = Array.from(
      new Set(sessionMix.questions.filter((q) => answers[q.id] === q.correctAnswer).map((q) => q.topic))
    );
    const areas = Array.from(
      new Set(sessionMix.questions.filter((q) => answers[q.id] !== q.correctAnswer).map((q) => q.topic))
    );

    completeSession({
      correctAnswers: correct,
      questionsAnswered: sessionMix.questions.length,
      strengths,
      areasToReinforce: areas,
      sessionMix
    });
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        {!started ? (
          <div className="space-y-5">
            <DailyCheckIn
              readiness={readiness}
              confidence={confidence}
              onChangeReadiness={setReadiness}
              onChangeConfidence={setConfidence}
            />
            <button
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 font-medium text-white shadow-md hover:from-indigo-600 hover:to-violet-700"
              onClick={() => setStarted(true)}
            >
              Build Today’s Session ✨
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/60 p-4 text-slate-700">
              <span className="text-xl">🧭</span>
              {sessionMix.reasoning}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">
                  Question {index + 1} of {sessionMix.questions.length}
                </p>
                <div className="flex gap-1.5">
                  {sessionMix.questions.map((q, i) => (
                    <span
                      key={q.id}
                      className={`h-2 w-2 rounded-full ${
                        i < index ? 'bg-indigo-500' : i === index ? 'bg-violet-400' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${roleBadge[current.role]}`}>
                {roleEmoji[current.role]} {roleLabel[current.role]}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-semibold">{current.prompt}</h2>

            <div className="mt-5 space-y-3">
              {current.choices.map((choice) => {
                const letter = choice.charAt(0);
                const correct = letter === current.correctAnswer;
                const picked = selected === letter;
                const style =
                  isAnswered && correct
                    ? 'border-emerald-500 bg-emerald-50'
                    : isAnswered && picked
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40';

                return (
                  <button
                    key={choice}
                    onClick={() => submitAnswer(choice)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${style}`}
                  >
                    {choice}
                    {isAnswered && correct && <span className="ml-2">✅</span>}
                    {isAnswered && picked && !correct && <span className="ml-2">❌</span>}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-blue-950">
                <p className="font-medium">💡 Explanation</p>
                <p className="mt-1">{current.explanation}</p>
              </div>
            )}

            <button
              disabled={!isAnswered}
              onClick={next}
              className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 font-medium text-white shadow-md hover:from-indigo-600 hover:to-violet-700 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
            >
              {index === sessionMix.questions.length - 1 ? 'Complete Session' : 'Next Question'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
