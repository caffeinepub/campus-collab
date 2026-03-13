const COLORS = [
  "oklch(0.92 0.26 129)", // lime
  "oklch(0.62 0.32 328)", // pink
  "oklch(0.9 0.15 195)", // cyan
  "oklch(0.7 0.2 90)", // yellow-green
  "oklch(0.65 0.25 260)", // purple
  "oklch(0.7 0.22 50)", // orange
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % COLORS.length;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function AvatarCircle({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const bg = getColor(name);
  const isLight =
    bg.includes("0.92") || bg.includes("0.9") || bg.includes("0.7 0.2 90");
  return (
    <div
      style={{
        width: size,
        height: size,
        background: bg,
        color: isLight ? "oklch(0.1 0 0)" : "oklch(1 0 0)",
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0,
      }}
      className="flex items-center justify-center border-2 border-border font-space"
    >
      {getInitials(name || "?")}
    </div>
  );
}
