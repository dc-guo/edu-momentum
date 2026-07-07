import type { Level } from '../lib/engine';
import { useStore } from '../store/useStore';
import ProgressRing from './ProgressRing';

const intentLabel = {
  rebuild: 'Rebuilding momentum',
  balanced: 'Steady progress',
  growth: 'Growth'
};

const intentEmoji = {
  rebuild: '💪',
  balanced: '🌱',
  growth: '🚀'
};

const confidenceOptions: { level: Level; emoji: string; label: string }[] = [
  { level: 'low', emoji: '😐', label: 'Okay' },
  { level: 'medium', emoji: '🙂', label: 'Good' },
  { level: 'high', emoji: '😄', label: 'Great' }
];

export default function SessionSummary() {
  const result = useStore((s) => s.lastResult);
  const user = useStore((s) => s.user);
  const setPostConfidence = useStore((s) => s.setPostConfidence);
  const returnToDashboard = useStore((s) => s.returnToDashboard);

  if (!result) return null;

  const accuracyRatio = result.correctAnswers / result.questionsAnswered;
  const message =
    user.streakDays <= 2 && accuracyRatio >= 0.4
      ? 'Nice work getting back into it — you’re building momentum again.'
      : accuracyRatio === 1
        ? 'You showed strong recall today.'
        : accuracyRatio >= 0.6
          ? 'You’re building steady confidence across sessions.'
          : 'A bit more review will help these topics feel more automatic.';

  const nextDirection =
    accuracyRatio >= 0.8
      ? 'You’re ready to build into new concepts next session.'
      : accuracyRatio >= 0.4
        ? 'Next session will include a mix of review and confidence-building.'
        : 'Next session will use more review to rebuild momentum.';

  const selectConfidence = (value: Level) => {
    setPostConfidence(value);
    returnToDashboard();
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-indigo-500">Session Summary</p>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 p-5 text-white shadow-md">
          <div>
            <p className="text-sm font-medium text-orange-100">🎉 Today’s result</p>
            <h1 className="mt-1 text-3xl font-semibold">
              {result.correctAnswers} of {result.questionsAnswered} correct
            </h1>
          </div>
          <ProgressRing
            value={accuracyRatio * 100}
            label={`${result.correctAnswers}/${result.questionsAnswered}`}
            size={72}
          />
        </div>

        <div className="mt-4 rounded-2xl bg-violet-50 p-4">
          <p className="font-medium">
            {intentEmoji[result.sessionMix.sessionIntent]} Today’s focus: {intentLabel[result.sessionMix.sessionIntent]}
          </p>
          <p className="mt-1 text-slate-600">
            We adjusted today’s session mix dynamically based on readiness, confidence, and recent activity.
          </p>
        </div>

        <p className="mt-5 text-lg text-slate-700">{message}</p>
        <p className="mt-2 text-slate-600">{nextDirection}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FeedbackCard
            emoji="💪"
            tint="bg-emerald-50"
            title="Strengths"
            items={result.strengths}
            empty="Keep building — these areas will continue to strengthen with practice."
          />
          <FeedbackCard
            emoji="🎯"
            tint="bg-amber-50"
            title="Areas to reinforce"
            items={result.areasToReinforce}
            empty="Strong performance across this session."
          />
        </div>

        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
          <p className="font-medium">How are you feeling about your progress now?</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {confidenceOptions.map(({ level, emoji, label }) => (
              <button
                key={level}
                onClick={() => selectConfidence(level)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 hover:border-indigo-300 hover:bg-indigo-50"
              >
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeedbackCard({
  emoji,
  tint,
  title,
  items,
  empty
}: {
  emoji: string;
  tint: string;
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className={`rounded-2xl ${tint} p-4`}>
      <p className="font-medium">
        {emoji} {title}
      </p>
      {items.length ? (
        <ul className="mt-2 list-inside list-disc text-slate-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-slate-600">{empty}</p>
      )}
    </div>
  );
}
