import { demoScenarios, type DemoScenarioKey } from '../data/demoScenarios';
import { generateSessionMix } from '../lib/engine';
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

export default function Dashboard() {
  const user = useStore((s) => s.user);
  const scenario = useStore((s) => s.scenario);
  const setDemoScenario = useStore((s) => s.setDemoScenario);
  const setCurrentSession = useStore((s) => s.setCurrentSession);
  const resetDemo = useStore((s) => s.resetDemo);

  const predicted = generateSessionMix(user);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-500">⚡ MomentumACT</p>
          <h1 className="text-3xl font-semibold tracking-tight">Adaptive ACT prep demo</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Daily practice that adapts by learning type: review, new learning, and confidence builder.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:w-72">
          <label className="text-sm font-medium text-slate-600" htmlFor="scenario">
            Select Demo Scenario
          </label>
          <select
            id="scenario"
            className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2"
            value={scenario}
            onChange={(e) => setDemoScenario(e.target.value as DemoScenarioKey)}
          >
            <option value="steady">{demoScenarios.steady.name}</option>
            <option value="rebuild">{demoScenarios.rebuild.name}</option>
            <option value="growth">{demoScenarios.growth.name}</option>
          </select>
          <button
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            onClick={resetDemo}
          >
            🔄 Reset Demo
          </button>
        </div>
      </header>

      {user.daysSinceLastSession >= 2 && (
        <section className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <span className="text-2xl">👋</span>
          Let’s rebuild your momentum today with a quick session.
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <Card
          emoji="📅"
          tint="bg-amber-50"
          chip="bg-amber-100"
          label="Learning days this week"
          value={`${user.learningDaysThisWeek}/7`}
          note="Building steady rhythm"
        />
        <Card
          emoji="🔥"
          tint="bg-rose-50"
          chip="bg-rose-100"
          label="Current streak"
          value={`${user.streakDays} days`}
          note="Consistency is growing"
        />
        <Card
          emoji="📈"
          tint="bg-violet-50"
          chip="bg-violet-100"
          label="Semester progress"
          value={`${user.semesterProgress}%`}
          note="Steady readiness over time"
        />
        <Card
          emoji="🏆"
          tint="bg-emerald-50"
          chip="bg-emerald-100"
          label="Consistency percentile"
          value={`${user.consistencyPercentile}th`}
          note="Based on practice frequency, not scores"
        />
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm font-semibold text-indigo-500">Predicted Focus</p>
            <h2 className="text-2xl font-semibold">
              {intentEmoji[predicted.sessionIntent]} {intentLabel[predicted.sessionIntent]}
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">{predicted.reasoning}</p>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">Review {predicted.review}</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">New {predicted.new}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Confidence {predicted.confidence}</span>
          </div>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
            style={{ width: `${user.semesterProgress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-slate-600">At this pace, you’re building steady readiness over time.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 p-5 text-white shadow-md">
            <div>
              <p className="text-sm font-medium text-orange-100">Semester progress</p>
              <p className="mt-1 text-2xl font-semibold">{user.semesterProgress}/100</p>
            </div>
            <ProgressRing value={user.semesterProgress} label={`${user.semesterProgress}%`} />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-md">
            <div>
              <p className="text-sm font-medium text-blue-100">Consistency percentile</p>
              <p className="mt-1 text-2xl font-semibold">{user.consistencyPercentile}/100</p>
            </div>
            <ProgressRing value={user.consistencyPercentile} label={`${user.consistencyPercentile}th`} />
          </div>
        </div>

        <button
          onClick={() => setCurrentSession(predicted)}
          className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 font-medium text-white shadow-md hover:from-indigo-600 hover:to-violet-700"
        >
          Start Quick Session ✨
        </button>
      </section>
    </div>
  );
}

function Card({
  emoji,
  tint,
  chip,
  label,
  value,
  note
}: {
  emoji: string;
  tint: string;
  chip: string;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className={`rounded-2xl ${tint} p-5 shadow-sm`}>
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${chip} text-xl`}>{emoji}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{note}</p>
    </div>
  );
}
