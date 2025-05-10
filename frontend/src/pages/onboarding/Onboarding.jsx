import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo.jsx";

const SLIDES = [
  {
    emoji: "🍛",
    title: "Discover restaurants near you",
    body: "Browse every restaurant on campus and see what's cooking, all in one place.",
  },
  {
    emoji: "🚦",
    title: "Check the queue before you go",
    body: "Live queue status means you never wait in line without knowing what you're in for.",
  },
  {
    emoji: "🔔",
    title: "Stay in the loop",
    body: "Get notified about new menu items, order history and restaurant updates.",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ marginBottom: 40 }}>
        <Logo />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 96, marginBottom: 24 }}>{slide.emoji}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>{slide.title}</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>{slide.body}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
        {SLIDES.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === step ? 22 : 8,
              height: 8,
              borderRadius: 999,
              background: i === step ? "var(--color-primary)" : "var(--color-muted-bg)",
              transition: "width 0.2s ease",
            }}
          />
        ))}
      </div>

      <button
        className="btn btn-primary"
        onClick={() => (isLast ? navigate("/sign-in") : setStep((s) => s + 1))}
      >
        {isLast ? "Get Started" : "Next"}
      </button>
    </div>
  );
}
