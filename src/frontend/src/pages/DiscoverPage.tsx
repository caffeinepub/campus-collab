import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { ExternalLink, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import AvatarCircle from "../components/AvatarCircle";
import SendMessageDialog from "../components/SendMessageDialog";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllProfiles } from "../hooks/useQueries";

interface ProfileWithPrincipal {
  major: string;
  name: string;
  available: boolean;
  portfolioUrl?: string;
  skills: string[];
  principal?: Principal;
}

export default function DiscoverPage({
  onNavigateToMessages,
}: {
  onNavigateToMessages?: () => void;
}) {
  const [skillFilter, setSkillFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [messageTarget, setMessageTarget] =
    useState<ProfileWithPrincipal | null>(null);
  const { identity } = useInternetIdentity();
  const { data: profiles = [], isLoading } = useGetAllProfiles();

  const myPrincipal = identity?.getPrincipal().toString();

  const filtered = profiles.filter((p) => {
    const matchSkill =
      !skillFilter ||
      p.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()));
    const matchMajor =
      !majorFilter || p.major.toLowerCase().includes(majorFilter.toLowerCase());
    return matchSkill && matchMajor;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 border-b-2 border-border">
        <div className="flex items-baseline gap-3">
          <h1 className="text-4xl font-black tracking-tight">
            Find Your People
          </h1>
          <span className="text-3xl">🎯</span>
        </div>
        <p
          className="text-sm font-medium mt-0.5"
          style={{ color: "oklch(0.55 0 0)" }}
        >
          Browse the talent. Build your squad.
        </p>

        <div className="flex gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Filter by skill..."
              className="border-2 border-border bg-input focus:border-primary pl-9"
              data-ocid="discover.skill_filter.input"
            />
          </div>
          <Input
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            placeholder="Filter by major..."
            className="border-2 border-border bg-input focus:border-primary flex-1"
            data-ocid="discover.major_filter.input"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="neo-card p-4 space-y-3"
                data-ocid="discover.loading_state"
              >
                <Skeleton className="w-14 h-14 bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="discover.empty_state"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black mb-2">No one found</h3>
            <p
              className="text-sm font-medium"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Try different filters or be the first to join!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((profile, i) => (
              <motion.div
                key={`${profile.name}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="neo-card p-4 flex flex-col gap-3"
                data-ocid={`discover.user.item.${i + 1}`}
              >
                {/* Clickable avatar + name/major */}
                <button
                  type="button"
                  onClick={() =>
                    setMessageTarget(profile as ProfileWithPrincipal)
                  }
                  className="flex flex-col gap-2 cursor-pointer group/avatar text-left w-full"
                  data-ocid={`discover.user.profile.button.${i + 1}`}
                >
                  <AvatarCircle name={profile.name} size={48} />
                  <div>
                    <p className="font-bold text-sm leading-tight group-hover/avatar:text-primary transition-colors group-hover/avatar:underline">
                      {profile.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "oklch(0.5 0 0)" }}
                    >
                      {profile.major}
                    </p>
                  </div>
                </button>

                <div
                  className={`text-xs font-black px-2 py-0.5 self-start border-2 tracking-wide ${
                    profile.available
                      ? "border-primary text-primary"
                      : "border-secondary text-secondary"
                  }`}
                >
                  {profile.available ? "OPEN 🟢" : "BUSY 🔴"}
                </div>

                {profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 4).map((s) => (
                      <span key={s} className="skill-tag">
                        {s}
                      </span>
                    ))}
                    {profile.skills.length > 4 && (
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.5 0 0)" }}
                      >
                        +{profile.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Portfolio
                  </a>
                )}

                {myPrincipal && (
                  <button
                    type="button"
                    onClick={() =>
                      setMessageTarget(profile as ProfileWithPrincipal)
                    }
                    className="btn-primary text-xs py-1.5 px-3 w-full font-black tracking-wide"
                    data-ocid={`discover.send_message.button.${i + 1}`}
                  >
                    Send Message
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <SendMessageDialog
        open={!!messageTarget}
        onClose={() => setMessageTarget(null)}
        recipientPrincipal={messageTarget?.principal ?? null}
        recipientName={messageTarget?.name ?? "Student"}
        onAfterSend={onNavigateToMessages}
      />
    </div>
  );
}
