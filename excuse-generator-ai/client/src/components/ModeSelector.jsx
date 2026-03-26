/**
 * ModeSelector — Pill-style mode picker for 5 excuse modes.
 */
const MODES = [
  { id: 'normal',       label: 'Normal',       emoji: '😐' },
  { id: 'overdramatic', label: 'Overdramatic',  emoji: '🎭' },
  { id: 'professional', label: 'Professional',  emoji: '💼' },
  { id: 'funny',        label: 'Funny',         emoji: '😂' },
  { id: 'savage',       label: 'Savage',        emoji: '🔥' },
];

export default function ModeSelector({ mode, onSelect }) {
  return (
    <div className="mode-selector" id="mode-selector">
      {MODES.map((m) => (
        <button
          key={m.id}
          id={`mode-${m.id}`}
          className={`mode-pill ${mode === m.id ? 'active' : ''}`}
          onClick={() => onSelect(m.id)}
        >
          <span className="mode-pill-emoji">{m.emoji}</span>
          <span className="mode-pill-label">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
