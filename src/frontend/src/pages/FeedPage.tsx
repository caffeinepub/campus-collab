import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Project } from "../backend.d";
import AvatarCircle from "../components/AvatarCircle";
import SendMessageDialog from "../components/SendMessageDialog";
import {
  useGetAllProjects,
  useGetProjectsBySkill,
  useGetUserProfile,
} from "../hooks/useQueries";

const SKILL_FILTERS = [
  "All",
  "React",
  "UI Design",
  "Python",
  "Machine Learning",
  "Figma",
  "Video",
  "Business",
  "Architecture",
  "Flutter",
  "Data Science",
  "Marketing",
];

function ProjectCard({
  project,
  index,
  onJoinTeam,
}: {
  project: Project;
  index: number;
  onJoinTeam: (project: Project) => void;
}) {
  const { data: ownerProfile } = useGetUserProfile(project.owner as Principal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group neo-card p-5 flex flex-col gap-3 cursor-default"
      style={{ transition: "box-shadow 0.15s, transform 0.15s" }}
      whileHover={{
        y: -2,
        boxShadow: "6px 6px 0px oklch(0.92 0.26 129 / 0.5)",
      }}
      data-ocid={`feed.project.item.${index + 1}`}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-black text-2xl leading-tight flex-1 group-hover:text-primary transition-colors">
          {project.title}
        </h2>
        <div className="flex gap-2 flex-shrink-0 pt-1">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          )}
          {project.figmaUrl && (
            <a
              href={project.figmaUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p
        className="text-sm leading-relaxed line-clamp-2"
        style={{ color: "oklch(0.68 0 0)" }}
      >
        {project.description}
      </p>

      {/* Tags */}
      {(project.skillsNeeded.length > 0 ||
        project.skillsOffered.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {project.skillsNeeded.map((s) => (
            <span key={`need-${s}`} className="skill-tag">
              {s}
            </span>
          ))}
          {project.skillsOffered.map((s) => (
            <span key={`offer-${s}`} className="skill-tag-muted">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-auto border-t-2 border-border">
        <button
          type="button"
          onClick={() => onJoinTeam(project)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group/owner"
          data-ocid={`feed.project.owner.button.${index + 1}`}
        >
          <AvatarCircle name={ownerProfile?.name || "?"} size={28} />
          <span
            className="text-xs font-semibold group-hover/owner:text-primary transition-colors"
            style={{ color: "oklch(0.72 0 0)" }}
          >
            {ownerProfile?.name || "Student"}
          </span>
        </button>
        <Button
          onClick={() => onJoinTeam(project)}
          className="btn-primary text-xs font-black px-4 py-1.5 h-auto tracking-wide"
          data-ocid={`feed.join_team.button.${index + 1}`}
        >
          Join the Team
        </Button>
      </div>
    </motion.div>
  );
}

export default function FeedPage({
  onNavigateToMessages,
}: {
  onNavigateToMessages?: () => void;
}) {
  const [activeSkill, setActiveSkill] = useState("All");
  const [messageTarget, setMessageTarget] = useState<Project | null>(null);

  const { data: allProjects = [], isLoading: allLoading } = useGetAllProjects();
  const { data: filteredProjects = [], isLoading: filterLoading } =
    useGetProjectsBySkill(activeSkill !== "All" ? activeSkill : "");

  const projects = activeSkill === "All" ? allProjects : filteredProjects;
  const isLoading = activeSkill === "All" ? allLoading : filterLoading;

  const { data: ownerProfile } = useGetUserProfile(
    messageTarget ? (messageTarget.owner as Principal) : null,
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b-2 border-border">
        <div className="flex items-baseline gap-3">
          <h1 className="text-4xl font-black tracking-tight">
            What&apos;s dropping
          </h1>
          <span className="text-3xl">🔥</span>
        </div>
        <p
          className="text-sm font-medium mt-0.5"
          style={{ color: "oklch(0.55 0 0)" }}
        >
          Find your next collab
        </p>

        {/* Skill filters */}
        <div
          className="flex gap-2 mt-3 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none" }}
        >
          {SKILL_FILTERS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => setActiveSkill(skill)}
              className={`flex-shrink-0 px-3 py-1 text-xs font-black tracking-wide border-2 transition-all ${
                activeSkill === skill
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
              style={
                activeSkill === skill
                  ? { background: "oklch(0.92 0.26 129 / 0.12)" }
                  : {}
              }
              data-ocid="feed.skill_filter.tab"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="neo-card p-5 space-y-3"
                data-ocid="feed.loading_state"
              >
                <Skeleton className="h-7 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-2/3 bg-muted" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 bg-muted" />
                  <Skeleton className="h-5 w-20 bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="feed.empty_state"
          >
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-black mb-2">No projects yet</h3>
            <p
              className="text-sm font-medium"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Be the first to post! Hit &quot;Post&quot; to pitch your idea.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id.toString()}
                project={project}
                index={i}
                onJoinTeam={setMessageTarget}
              />
            ))}
          </div>
        )}
      </div>

      <SendMessageDialog
        open={!!messageTarget}
        onClose={() => setMessageTarget(null)}
        recipientPrincipal={
          messageTarget ? (messageTarget.owner as Principal) : null
        }
        recipientName={ownerProfile?.name || "Student"}
        projectId={messageTarget?.id}
        projectTitle={messageTarget?.title}
        onAfterSend={onNavigateToMessages}
      />
    </div>
  );
}
