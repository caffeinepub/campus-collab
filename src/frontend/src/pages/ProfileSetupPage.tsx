import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import TagInput from "../components/TagInput";
import { useSaveProfile } from "../hooks/useQueries";

export default function ProfileSetupPage() {
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [available, setAvailable] = useState(true);
  const { mutateAsync, isPending } = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !major.trim()) {
      toast.error("Name and major are required");
      return;
    }
    try {
      await mutateAsync({
        name: name.trim(),
        major: major.trim(),
        skills,
        portfolioUrl: portfolioUrl.trim() || undefined,
        available,
      });
      toast.success("Profile saved! Welcome to Campus Collab 🎉");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">
              Campus Collab
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Set up your profile</h1>
          <p className="text-muted-foreground">
            Tell us who you are so the right people can find you 🔥
          </p>
        </div>

        <form onSubmit={handleSubmit} className="neo-card p-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="font-semibold">
              Full Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="border-2 border-border bg-input focus:border-primary"
              data-ocid="profile.name_input"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="major" className="font-semibold">
              University Major *
            </Label>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="Interaction Design, Computer Science..."
              className="border-2 border-border bg-input focus:border-primary"
              data-ocid="profile.major_input"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-semibold">Your Skills</Label>
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add a skill
            </p>
            <TagInput
              tags={skills}
              onChange={setSkills}
              placeholder="React, Figma, Python..."
              data-ocid="profile.skills_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="portfolio" className="font-semibold">
              Portfolio / GitHub URL
            </Label>
            <Input
              id="portfolio"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://yourportfolio.com"
              className="border-2 border-border bg-input focus:border-primary"
              data-ocid="profile.portfolio_input"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <p className="font-semibold text-sm">Open to Collab</p>
              <p className="text-xs text-muted-foreground">
                Let others know you&apos;re available
              </p>
            </div>
            <Switch
              checked={available}
              onCheckedChange={setAvailable}
              data-ocid="profile.availability_switch"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !name.trim() || !major.trim()}
            className="btn-primary w-full py-3 font-bold text-base"
            data-ocid="profile.save_button"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Let&apos;s Go 🚀
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
