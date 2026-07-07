import { demoScenarios, type DemoScenarioKey } from '../data/demoScenarios';
import { generateSessionMix } from '../lib/engine';
import { useStore } from '../store/useStore';

const intentLabel = {
  rebuild: 'Rebuilding momentum',
  balanced: 'Steady progress',
  growth: 'Growth'
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
          <p className="text-sm font-medium text-slate-500">MomentumACT</p>
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
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            value={scenario}
            onChange={(e) => setDemoScenario(e.target.value as DemoScenarioKey)}
          >
            <option value="steady">{demoScenarios.steady.name}</option>
            <option value="rebuild">{demoScenarios.rebuild.name}</option>
            <option value="growth">{demoScenarios.growth.name}</option>
          </select>
          <button
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            onClick={resetDemo}
          >
            Reset Demo
          </button>
        </div>
      </header>

      {user.daysSinceLastSession >= 2 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Let’s rebuild your momentum today with a quick session.
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <Card label="Learning days this week" value={`${user.learningDaysThisWeek}/7`} note="Building steady rhythm" />
        <Card label="Current streak" value={`${user.streakDays} days`} note="Consistency is growing" />
        <Card label="Semester progress" value={`${user.semesterProgress}%`} note="Steady readiness over time" />
        <Card
          label="Consistency percentile"
          value={`${user.consistencyPercentile}th`}
          note="Based on practice frequency, not scores"
        />
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Predicted Focus</p>
            <h2 className="text-2xl font-semibold">{intentLabel[predicted.sessionIntent]}</h2>
            <p className="mt-2 max-w-2xl text-slate-600">{predicted.reasoning}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            Review {predicted.review} · New {predicted.new} · Confidence {predicted.confidence}
          </div>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-slate-800" style={{ width: `${user.semesterProgress}%` }} />
        </div>
        <p className="mt-3 text-sm text-slate-600">At this pace, you’re building steady readiness over time.</p>

        <button
          onClick={() => setCurrentSession(predicted)}
          className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
        >
          Start Quick Session
        </button>
      </section>
    </div>
  );
}

function Card({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{note}</p>
    </div>
  );
}
