/**
 * InputBox — Rounded text input for typing the situation.
 */
export default function InputBox({ value, onChange, disabled }) {
  return (
    <div className="input-box-wrapper">
      <input
        id="situation-input"
        type="text"
        className="input-box"
        placeholder="Enter your predicament..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete="off"
      />
    </div>
  );
}
