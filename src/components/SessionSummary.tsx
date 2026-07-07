import type { Level } from '../lib/engine';
import { useStore } from '../store/useStore';

const intentLabel = {
  rebuild: 'Rebuilding momentum',
  balanced: 'Steady progress',
  growth: 'Growth'
};

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
        <p className="text-sm font-medium text-slate-500">Session Summary</p>
        <h1 className="mt-1 text-3xl font-semibold">
          {result.correctAnswers} of {result.questionsAnswered} correct
        </h1>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="font-medium">Today’s focus: {intentLabel[result.sessionMix.sessionIntent]}</p>
          <p className="mt-1 text-slate-600">
            We adjusted today’s session mix dynamically based on readiness, confidence, and recent activity.
          </p>
        </div>

        <p className="mt-5 text-lg text-slate-700">{message}</p>
        <p className="mt-2 text-slate-600">{nextDirection}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FeedbackCard
            title="Strengths"
            items={result.strengths}
            empty="Keep building — these areas will continue to strengthen with practice."
          />
          <FeedbackCard
            title="Areas to reinforce"
            items={result.areasToReinforce}
            empty="Strong performance across this session."
          />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <p className="font-medium">How are you feeling about your progress now?</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {(['low', 'medium', 'high'] as Level[]).map((level) => (
              <button
                key={level}
                onClick={() => selectConfidence(level)}
                className="rounded-xl border border-slate-300 px-4 py-2 capitalize hover:bg-slate-50"
              >
                {level === 'low' ? 'Okay' : level === 'medium' ? 'Good' : 'Great'}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeedbackCard({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="font-medium">{title}</p>
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
