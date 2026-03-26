/**
 * ModeToggle — Sliding toggle between Normal 😐 and Overdramatic 🎭.
 */
export default function ModeToggle({ mode, onToggle }) {
  const isOverdramatic = mode === 'overdramatic';

  return (
    <div className="mode-toggle-wrapper">
      <span className={`mode-label ${!isOverdramatic ? 'active' : ''}`}>
        😐 Normal
      </span>

      <button
        id="mode-toggle"
        type="button"
        className={`toggle-switch ${isOverdramatic ? 'on' : ''}`}
        onClick={onToggle}
        aria-label="Toggle excuse mode"
      >
        <span className="toggle-knob" />
      </button>

      <span className={`mode-label ${isOverdramatic ? 'active' : ''}`}>
        🎭 Overdramatic
      </span>
    </div>
  );
}
