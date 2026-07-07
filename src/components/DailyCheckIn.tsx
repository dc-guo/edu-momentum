import type { Level } from '../lib/engine';

type Props = {
  readiness: Level;
  confidence: Level;
  onChangeReadiness: (value: Level) => void;
  onChangeConfidence: (value: Level) => void;
};

export default function DailyCheckIn({
  readiness,
  confidence,
  onChangeReadiness,
  onChangeConfidence
}: Props) {
  return (
    <div className="rounded-2xl bg-indigo-50/60 p-4">
      <h3 className="font-semibold">📝 Daily check-in</h3>
      <p className="mt-1 text-sm text-slate-600">This adjusts the type of practice, not pressure.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Select label="How ready do you feel today?" value={readiness} onChange={onChangeReadiness} />
        <Select label="How confident do you feel?" value={confidence} onChange={onChangeConfidence} />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange
}: {
  label: string;
  value: Level;
  onChange: (value: Level) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <select
        className="mt-2 w-full rounded-xl border border-indigo-100 bg-white px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value as Level)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </label>
  );
}
