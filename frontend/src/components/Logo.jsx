export default function Logo({ light = false }) {
  return (
    <span className="logo-wordmark" style={{ color: light ? "#fff" : "var(--color-ink)" }}>
      CAF APP
    </span>
  );
}
