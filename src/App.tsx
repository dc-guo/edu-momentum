import Dashboard from './components/Dashboard';
import PracticeSession from './components/PracticeSession';
import SessionSummary from './components/SessionSummary';
import { useStore } from './store/useStore';

export default function App() {
  const currentSession = useStore((s) => s.currentSession);
  const lastResult = useStore((s) => s.lastResult);

  return (
    <main className="min-h-screen">
      {!currentSession && !lastResult && <Dashboard />}
      {currentSession && <PracticeSession />}
      {!currentSession && lastResult && <SessionSummary />}
    </main>
  );
}
