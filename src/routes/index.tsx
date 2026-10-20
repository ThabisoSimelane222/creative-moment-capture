import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Will you go on a date with me? 💌" },
      { name: "description", content: "A little question, just for you." },
      { property: "og:title", content: "Will you go on a date with me? 💌" },
      { property: "og:description", content: "A little question, just for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const noLines = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again 🥺",
  "Last chance!",
  "You're breaking my heart",
  "Okay fine… try clicking me 😏",
];

const foods = ["🍕 Pizza", "🍣 Sushi", "🍔 Burgers", "🍝 Pasta", "🌮 Tacos", "🍦 Dessert only"];
const activities = ["🎬 Movie night", "🌅 Sunset walk", "🎳 Bowling", "☕ Coffee & talk", "🎨 Paint & sip", "🎡 Fun fair"];

function Hearts() {
  const items = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {items.map((_, i) => (
        <span
          key={i}
          className="animate-float-up absolute bottom-[-40px] text-primary/40"
          style={{
            left: `${(i * 37) % 100}%`,
            fontSize: `${14 + ((i * 7) % 22)}px`,
            animationDuration: `${8 + (i % 6)}s`,
            animationDelay: `${(i * 0.9) % 8}s`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}

function Choice({ options, value, onPick }: { options: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onPick(o)}
          className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all ${
            value === o
              ? "border-primary bg-primary text-primary-foreground scale-[1.03]"
              : "border-border bg-card hover:border-primary/60"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Index() {
  const [step, setStep] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [date, setDate] = useState("");
  const [food, setFood] = useState("");
  const [activity, setActivity] = useState("");
  const areaRef = useRef<HTMLDivElement>(null);

  const dodge = () => {
    setNoCount((c) => c + 1);
    const w = window.innerWidth - 140;
    const h = window.innerHeight - 60;
    setNoPos({ x: Math.max(10, Math.random() * w), y: Math.max(10, Math.random() * h) });
  };

  const yesScale = 1 + Math.min(noCount, 8) * 0.18;

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-10">
      <Hearts />
      <div ref={areaRef} key={step} className="animate-pop relative z-10 w-full max-w-md rounded-xl bg-card/90 p-7 text-center shadow-soft backdrop-blur">
        {step === 0 && (
          <>
            <div className="text-6xl">🧸💌</div>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">
              Will you go on a date with me?
            </h1>
            <p className="mt-2 text-muted-foreground">Choose wisely 😌</p>
            <div className="mt-8 flex min-h-24 flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setStep(1)}
                style={{ transform: `scale(${yesScale})` }}
                className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-soft transition-transform"
              >
                Yes 💖
              </button>
              <button
                onMouseEnter={dodge}
                onClick={dodge}
                style={noPos ? { position: "fixed", left: noPos.x, top: noPos.y } : undefined}
                className="rounded-full border-2 border-border bg-secondary px-6 py-3 font-medium text-secondary-foreground transition-all duration-200"
              >
                {noLines[Math.min(noCount, noLines.length - 1)]}
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-6xl">🥹🎉</div>
            <h2 className="mt-4 font-display text-3xl font-semibold">I knew you'd say yes!</h2>
            <p className="mt-2 text-muted-foreground">When are you free?</p>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-6 w-full rounded-xl border-2 border-input bg-background px-4 py-3 outline-none focus:border-ring"
            />
            <button
              disabled={!date}
              onClick={() => setStep(2)}
              className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-40"
            >
              Next →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-6xl">😋</div>
            <h2 className="mt-4 font-display text-3xl font-semibold">What are we eating?</h2>
            <div className="mt-6"><Choice options={foods} value={food} onPick={setFood} /></div>
            <button
              disabled={!food}
              onClick={() => setStep(3)}
              className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-40"
            >
              Next →
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-6xl">✨</div>
            <h2 className="mt-4 font-display text-3xl font-semibold">And after that?</h2>
            <div className="mt-6"><Choice options={activities} value={activity} onPick={setActivity} /></div>
            <button
              disabled={!activity}
              onClick={() => setStep(4)}
              className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-40"
            >
              Seal the deal 💌
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <div className="text-6xl">💞</div>
            <h2 className="mt-4 font-display text-3xl font-semibold">It's a date!</h2>
            <div className="mt-6 space-y-2 rounded-xl bg-secondary p-5 text-left text-secondary-foreground">
              <p>📅 {new Date(date).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}</p>
              <p>{food}</p>
              <p>{activity}</p>
            </div>
            <p className="mt-5 text-muted-foreground">Screenshot this and send it to me 😘</p>
            <button
              onClick={() => { setStep(0); setNoCount(0); setNoPos(null); setDate(""); setFood(""); setActivity(""); }}
              className="mt-5 text-sm text-muted-foreground underline"
            >
              Start over
            </button>
          </>
        )}
      </div>
    </main>
  );
}
