/**
 * Loader — Animated "Generating excuse…" indicator.
 */
export default function Loader() {
  return (
    <div className="loader" id="loader">
      <span className="loader-text">Synthesizing</span>
      <span className="loader-dots">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </span>
    </div>
  );
}
