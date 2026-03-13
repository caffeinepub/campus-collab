import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ConversationPreview,
  Message,
  Project,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["allProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProjectsBySkill(skill: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projectsBySkill", skill],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjectsBySkill(skill);
    },
    enabled: !!actor && !isFetching && !!skill,
  });
}

export function useGetAllProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["allProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useGetConversationPreviews() {
  const { actor, isFetching } = useActor();
  return useQuery<ConversationPreview[]>({
    queryKey: ["conversationPreviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversationPreview();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMessageThread(otherParty: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messageThread", otherParty?.toString()],
    queryFn: async () => {
      if (!actor || !otherParty) return [];
      return actor.getMessageThread(otherParty);
    },
    enabled: !!actor && !isFetching && !!otherParty,
    refetchInterval: 10000,
  });
}

export function useGetUnreadCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["unreadCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getUnreadMessageCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      skillsOffered: string[];
      skillsNeeded: string[];
      figmaUrl: string | null;
      githubUrl: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProject(
        data.title,
        data.description,
        data.skillsOffered,
        data.skillsNeeded,
        data.figmaUrl,
        data.githubUrl,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProjects"] });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      to: Principal;
      body: string;
      projectId: bigint | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage(data.to, data.body, data.projectId);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["messageThread", vars.to.toString()] });
      qc.invalidateQueries({ queryKey: ["conversationPreviews"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });
}

export function useMarkThreadRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (otherParty: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.markThreadRead(otherParty);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversationPreviews"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });
}
