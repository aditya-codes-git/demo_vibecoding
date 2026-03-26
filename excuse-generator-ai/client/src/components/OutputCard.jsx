/**
 * OutputCard — Displays the generated excuse with a mode-specific label.
 */
const MODE_META = {
  normal:       { emoji: '😐', label: 'Normal' },
  overdramatic: { emoji: '🎭', label: 'Overdramatic' },
  professional: { emoji: '💼', label: 'Professional' },
  funny:        { emoji: '😂', label: 'Funny' },
  savage:       { emoji: '🔥', label: 'Savage' },
};

export default function OutputCard({ excuse, mode }) {
  if (!excuse) return null;

  const { emoji, label } = MODE_META[mode] || MODE_META.normal;

  return (
    <div className="output-card" id="output-card">
      <div className="output-card-header">
        <span className="output-emoji">{emoji}</span>
        <span className="output-mode-label">{label} Synthesis</span>
      </div>
      <p className="output-text">{excuse}</p>
    </div>
  );
}
