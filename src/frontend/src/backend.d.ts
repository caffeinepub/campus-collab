import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    to: Principal;
    body: string;
    from: Principal;
    read: boolean;
    projectId?: bigint;
    timestamp: Time;
}
export type Time = bigint;
export interface Project {
    id: bigint;
    figmaUrl?: string;
    title: string;
    skillsOffered: Array<string>;
    owner: Principal;
    description: string;
    githubUrl?: string;
    timestamp: Time;
    skillsNeeded: Array<string>;
}
export interface ConversationPreview {
    lastMessage: string;
    otherParty: Principal;
    unreadCount: bigint;
    timestamp: Time;
}
export interface UserProfile {
    major: string;
    name: string;
    available: boolean;
    portfolioUrl?: string;
    skills: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(title: string, description: string, skillsOffered: Array<string>, skillsNeeded: Array<string>, figmaUrl: string | null, githubUrl: string | null): Promise<bigint>;
    getAllProfiles(): Promise<Array<UserProfile>>;
    getAllProjects(): Promise<Array<Project>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversationPreview(): Promise<Array<ConversationPreview>>;
    getMessageThread(otherParty: Principal): Promise<Array<Message>>;
    getProject(projectId: bigint): Promise<Project | null>;
    getProjectsBySkill(skill: string): Promise<Array<Project>>;
    getUnreadMessageCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markThreadRead(otherParty: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(to: Principal, body: string, projectId: bigint | null): Promise<void>;
}
