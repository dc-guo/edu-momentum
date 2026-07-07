import Dashboard from './components/Dashboard';
import PracticeSession from './components/PracticeSession';
import SessionSummary from './components/SessionSummary';
import { useStore } from './store/useStore';

const navItems = [
  { emoji: '🏠', label: 'Home' },
  { emoji: '📚', label: 'Practice' },
  { emoji: '📊', label: 'Progress' },
  { emoji: '🔥', label: 'Streak' },
  { emoji: '⚙️', label: 'Settings' }
];

export default function App() {
  const currentSession = useStore((s) => s.currentSession);
  const lastResult = useStore((s) => s.lastResult);

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col items-center gap-3 border-r border-slate-100 bg-white py-6 shadow-sm md:flex">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl shadow-md">
          ⚡
        </div>
        {navItems.map((item) => (
          <div
            key={item.label}
            title={item.label}
            className="flex h-11 w-11 cursor-default items-center justify-center rounded-2xl text-xl transition hover:bg-indigo-50"
          >
            {item.emoji}
          </div>
        ))}
      </aside>

      <main className="min-h-screen md:pl-20">
        {!currentSession && !lastResult && <Dashboard />}
        {currentSession && <PracticeSession />}
        {!currentSession && lastResult && <SessionSummary />}
      </main>
    </div>
  );
}
