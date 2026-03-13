import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { Edit3, ExternalLink, Loader2, LogOut, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AvatarCircle from "../components/AvatarCircle";
import TagInput from "../components/TagInput";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useSaveProfile } from "../hooks/useQueries";

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { clear } = useInternetIdentity();
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useSaveProfile();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setMajor(profile.major);
      setSkills(profile.skills);
      setPortfolioUrl(profile.portfolioUrl || "");
      setAvailable(profile.available);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await mutateAsync({
        name,
        major,
        skills,
        portfolioUrl: portfolioUrl || undefined,
        available,
      });
      toast.success("Profile updated! 🎉");
      setEditing(false);
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const handleLogout = async () => {
    await clear();
    qc.clear();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-16 w-16 bg-muted" />
        <Skeleton className="h-6 w-1/3 bg-muted" />
        <Skeleton className="h-4 w-1/2 bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-5 pb-3 border-b-2 border-border">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl font-black tracking-tight">
                Your Profile
              </h1>
              <span className="text-3xl">👤</span>
            </div>
            <p
              className="text-sm font-medium mt-0.5"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              {profile?.name} · {profile?.major}
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-outline px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1"
                data-ocid="profile.edit_button"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="btn-primary px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1"
                data-ocid="profile.save_button"
              >
                {isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="border-2 px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
              style={{
                borderColor: "oklch(0.62 0.32 328)",
                color: "oklch(0.62 0.32 328)",
              }}
              data-ocid="profile.logout_button"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-lg">
        {/* Avatar + availability */}
        <div className="flex items-center gap-4 mb-6">
          <AvatarCircle name={profile?.name || "?"} size={64} />
          <div>
            <h2 className="text-2xl font-black">{profile?.name}</h2>
            <p style={{ color: "oklch(0.55 0 0)" }} className="text-sm">
              {profile?.major}
            </p>
            <div
              className={`inline-flex text-xs font-black px-2 py-0.5 border-2 mt-2 uppercase tracking-wider ${
                profile?.available
                  ? "border-primary text-primary"
                  : "border-secondary text-secondary"
              }`}
            >
              {profile?.available ? "Open to Collab" : "Busy"}
            </div>
          </div>
        </div>

        {editing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="neo-card p-5 space-y-5"
          >
            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider">
                Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-border bg-input focus:border-primary"
                data-ocid="profile.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider">
                Major
              </Label>
              <Input
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="border-2 border-border bg-input focus:border-primary"
                data-ocid="profile.major_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider">
                Skills
              </Label>
              <TagInput
                tags={skills}
                onChange={setSkills}
                placeholder="Add skills..."
                data-ocid="profile.skills_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-xs uppercase tracking-wider">
                Portfolio URL
              </Label>
              <Input
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://..."
                className="border-2 border-border bg-input focus:border-primary"
                data-ocid="profile.portfolio_input"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-black text-xs uppercase tracking-wider">
                Open to Collab
              </Label>
              <Switch
                checked={available}
                onCheckedChange={setAvailable}
                data-ocid="profile.availability_switch"
              />
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="neo-card p-5">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">
                Skills
              </p>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span key={s} className="skill-tag px-3 py-1">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "oklch(0.5 0 0)" }}>
                  No skills added yet
                </p>
              )}
            </div>

            {profile?.portfolioUrl && (
              <div className="neo-card p-5">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">
                  Portfolio
                </p>
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-accent hover:underline text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  {profile.portfolioUrl}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto p-4 border-t-2 border-border">
        <p className="text-xs text-center" style={{ color: "oklch(0.4 0 0)" }}>
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
