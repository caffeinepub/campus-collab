import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import TagInput from "../components/TagInput";
import { useCreateProject } from "../hooks/useQueries";

const STEPS = ["Pitch it", "Skills", "Links"];

export default function PostPage({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsNeeded, setSkillsNeeded] = useState<string[]>([]);
  const [figmaUrl, setFigmaUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const { mutateAsync, isPending } = useCreateProject();

  const canNext = () => {
    if (step === 0)
      return title.trim().length > 0 && description.trim().length > 0;
    if (step === 1) return skillsNeeded.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    try {
      await mutateAsync({
        title: title.trim(),
        description: description.trim(),
        skillsOffered,
        skillsNeeded,
        figmaUrl: figmaUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
      });
      toast.success("Project posted! 🎉 Go find your team.");
      onSuccess();
    } catch {
      toast.error("Failed to post project");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 border-b-2 border-border">
        <div className="flex items-baseline gap-3">
          <h1 className="text-4xl font-black tracking-tight">The Ask</h1>
          <span className="text-3xl">✍️</span>
        </div>
        <p
          className="text-sm font-medium mt-0.5"
          style={{ color: "oklch(0.55 0 0)" }}
        >
          Pitch your project. Find your team.
        </p>

        {/* Progress */}
        <div className="flex gap-3 mt-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1.5 transition-all duration-300 ${
                  i < step
                    ? "bg-primary"
                    : i === step
                      ? "bg-primary"
                      : "bg-border"
                }`}
                style={i === step ? { background: "oklch(0.92 0.26 129)" } : {}}
              />
              <p
                className={`text-xs mt-1.5 font-black tracking-wide uppercase ${
                  i === step ? "text-primary" : "text-muted-foreground"
                }`}
                style={i < step ? { color: "oklch(0.5 0 0)" } : {}}
              >
                {i + 1}. {s}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 max-w-xl"
            >
              <div className="space-y-1.5">
                <Label
                  htmlFor="title"
                  className="font-black text-base uppercase tracking-wider"
                >
                  Project Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Campus Map AR Experience"
                  className="border-2 border-border bg-input focus:border-primary text-lg h-12"
                  data-ocid="post.title_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="desc"
                  className="font-black text-base uppercase tracking-wider"
                >
                  The Pitch *
                </Label>
                <p className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>
                  What are you building? Sell it! Be informal, be real.
                </p>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="So basically I want to build... and it's gonna be sick because..."
                  className="border-2 border-border bg-input focus:border-primary min-h-[180px] resize-none"
                  data-ocid="post.description_textarea"
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 max-w-xl"
            >
              <div className="space-y-1.5">
                <Label className="font-black text-base uppercase tracking-wider">
                  What you bring 💪
                </Label>
                <p className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>
                  Skills you already have (press Enter to add)
                </p>
                <TagInput
                  tags={skillsOffered}
                  onChange={setSkillsOffered}
                  placeholder="React, UI Design, Python..."
                  data-ocid="post.skills_offered_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-black text-base uppercase tracking-wider">
                  What you need 🙏 *
                </Label>
                <p className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>
                  Skills you&apos;re looking for in a collaborator
                </p>
                <TagInput
                  tags={skillsNeeded}
                  onChange={setSkillsNeeded}
                  placeholder="Backend Dev, Video Editing..."
                  data-ocid="post.skills_needed_input"
                />
                {skillsNeeded.length === 0 && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.62 0.32 328)" }}
                  >
                    Add at least one skill you need
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 max-w-xl"
            >
              <div
                className="neo-card p-4"
                style={{
                  borderColor: "oklch(0.92 0.26 129)",
                  boxShadow: "4px 4px 0px oklch(0.92 0.26 129)",
                }}
              >
                <p className="font-black text-lg mb-1">{title}</p>
                <p
                  className="text-sm line-clamp-2"
                  style={{ color: "oklch(0.6 0 0)" }}
                >
                  {description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skillsNeeded.map((s) => (
                    <span key={s} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="figma"
                  className="font-black text-sm uppercase tracking-wider flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Figma Link
                  <span
                    className="text-xs font-normal normal-case"
                    style={{ color: "oklch(0.5 0 0)" }}
                  >
                    (optional)
                  </span>
                </Label>
                <Input
                  id="figma"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://figma.com/file/..."
                  className="border-2 border-border bg-input focus:border-primary"
                  data-ocid="post.figma_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="github"
                  className="font-black text-sm uppercase tracking-wider flex items-center gap-2"
                >
                  <Github className="w-4 h-4" /> GitHub Repo
                  <span
                    className="text-xs font-normal normal-case"
                    style={{ color: "oklch(0.5 0 0)" }}
                  >
                    (optional)
                  </span>
                </Label>
                <Input
                  id="github"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="border-2 border-border bg-input focus:border-primary"
                  data-ocid="post.github_input"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t-2 border-border flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="btn-outline flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        )}
        {step < 2 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="btn-primary flex-1 flex items-center justify-center gap-1 font-black tracking-wide"
            data-ocid="post.next_button"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="btn-primary flex-1 flex items-center justify-center gap-2 font-black tracking-wide"
            data-ocid="post.submit_button"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isPending ? "Posting..." : "Post The Ask 🚀"}
          </Button>
        )}
      </div>
    </div>
  );
}
