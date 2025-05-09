const LEVELS = ["low", "medium", "high"];

export default function QueueStatusBar({ level = "low" }) {
  return (
    <div className="queue-bar" title={`Queue: ${level}`}>
      {LEVELS.map((l) => (
        <span
          key={l}
          className={l}
          style={{
            outline: l === level ? "2px solid var(--color-ink)" : "none",
            outlineOffset: l === level ? "-2px" : "0",
          }}
        />
      ))}
    </div>
  );
}
