import { Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const TICKER_ITEMS = [
  "FIND YOUR PEOPLE",
  "★",
  "CROSS-DISCIPLINE",
  "★",
  "THE ASK",
  "★",
  "CAMPUS COLLAB",
  "★",
  "BUILD SOMETHING WILD",
  "★",
  "JOIN THE TEAM",
  "★",
];

const TICKER_DOUBLED = [
  ...TICKER_ITEMS.map((t, i) => ({ t, id: `a${i}` })),
  ...TICKER_ITEMS.map((t, i) => ({ t, id: `b${i}` })),
];

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoading = loginStatus === "logging-in";

  const words = ["Build", "something", "wild"];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial color bleed */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 15% 30%, oklch(0.92 0.26 129 / 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 75%, oklch(0.62 0.32 328 / 0.07) 0%, transparent 60%)",
        }}
      />

      {/* Top nav strip */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2">
          <div
            className="border-2 border-primary p-1"
            style={{ boxShadow: "2px 2px 0px oklch(0.92 0.26 129)" }}
          >
            <Zap className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-bold text-sm tracking-widest uppercase text-primary">
            Campus Collab
          </span>
        </div>
        <span className="text-xs text-muted-foreground border border-border px-2 py-1 font-mono">
          BETA
        </span>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-8 pt-12 max-w-3xl">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px flex-1 max-w-8 bg-primary" />
          <span
            className="text-xs font-bold tracking-[0.25em] uppercase"
            style={{ color: "oklch(0.92 0.26 129)" }}
          >
            University Collab Network
          </span>
        </motion.div>

        {/* Headline — staggered words */}
        <h1 className="font-black leading-[0.95] mb-6 tracking-tight">
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`block ${
                i === 0
                  ? "text-7xl sm:text-8xl lg:text-9xl text-foreground"
                  : i === 1
                    ? "text-7xl sm:text-8xl lg:text-9xl text-foreground"
                    : "text-7xl sm:text-8xl lg:text-9xl text-primary"
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Body + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <p
            className="text-base font-medium max-w-xs"
            style={{ color: "oklch(0.72 0 0)" }}
          >
            CS meets Design meets Business.
            <br />
            Find the people your idea needs.
          </p>

          <button
            type="button"
            onClick={login}
            disabled={isLoading}
            className="btn-primary flex-shrink-0 px-8 py-4 text-base font-black tracking-wide flex items-center gap-2"
            data-ocid="landing.primary_button"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            {isLoading ? "Connecting..." : "Get Started"}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs mt-5"
          style={{ color: "oklch(0.45 0 0)" }}
        >
          No password. No CV. Just your skills and ideas.
        </motion.p>
      </main>

      {/* Ticker strip */}
      <div
        className="relative z-10 border-y-2 border-border py-3 overflow-hidden flex-shrink-0"
        style={{ background: "oklch(0.13 0 0)" }}
      >
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {TICKER_DOUBLED.map(({ t, id }) => (
            <span
              key={id}
              className={`text-xs font-black tracking-[0.2em] uppercase flex-shrink-0 ${
                t === "★" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 flex items-center justify-between">
        <p className="text-xs" style={{ color: "oklch(0.4 0 0)" }}>
          © {new Date().getFullYear()} Campus Collab
        </p>
        <p className="text-xs" style={{ color: "oklch(0.4 0 0)" }}>
          Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
