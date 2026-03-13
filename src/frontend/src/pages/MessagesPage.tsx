import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { ArrowLeft, Pencil, Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ConversationPreview } from "../backend.d";
import AvatarCircle from "../components/AvatarCircle";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetConversationPreviews,
  useGetMessageThread,
  useGetUserProfile,
  useMarkThreadRead,
  useSendMessage,
} from "../hooks/useQueries";

function formatTime(ts: bigint): string {
  const date = new Date(Number(ts / BigInt(1_000_000)));
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ConversationItem({
  preview,
  isActive,
  onClick,
  index,
}: {
  preview: ConversationPreview;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const { data: profile } = useGetUserProfile(preview.otherParty as Principal);
  const unread = Number(preview.unreadCount);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 border-b-2 border-border transition-colors text-left ${
        isActive ? "bg-muted border-l-2 border-l-primary" : "hover:bg-muted/50"
      }`}
      data-ocid={`messages.conversation.item.${index + 1}`}
    >
      <AvatarCircle name={profile?.name || "?"} size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm truncate">
            {profile?.name || "Student"}
          </span>
          <span
            className="text-xs flex-shrink-0"
            style={{ color: "oklch(0.45 0 0)" }}
          >
            {formatTime(preview.timestamp)}
          </span>
        </div>
        <p
          className="text-xs truncate mt-0.5"
          style={{ color: "oklch(0.5 0 0)" }}
        >
          {preview.lastMessage}
        </p>
      </div>
      {unread > 0 && (
        <span className="unread-badge flex-shrink-0">{unread}</span>
      )}
    </button>
  );
}

function ThreadView({
  otherParty,
  onBack,
}: {
  otherParty: Principal;
  onBack: () => void;
}) {
  const { identity } = useInternetIdentity();
  const { data: messages = [], isLoading } = useGetMessageThread(otherParty);
  const { data: profile } = useGetUserProfile(otherParty);
  const { mutateAsync: sendMessage, isPending } = useSendMessage();
  const { mutateAsync: markRead } = useMarkThreadRead();
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const myPrincipal = identity?.getPrincipal().toString();

  useEffect(() => {
    markRead(otherParty).catch(() => {});
  }, [otherParty, markRead]);

  const prevCountRef = useRef(0);
  if (messages.length !== prevCountRef.current) {
    prevCountRef.current = messages.length;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleSend = async () => {
    if (!body.trim()) return;
    const text = body.trim();
    setBody("");
    await sendMessage({ to: otherParty, body: text, projectId: null });
  };

  const sharedUrls = [
    ...new Set(
      messages.flatMap((m) => m.body.match(/https?:\/\/[^\s]+/g) || []),
    ),
  ].slice(0, 5);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-border">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden p-1 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <AvatarCircle name={profile?.name || "?"} size={36} />
        <div>
          <p className="font-bold">{profile?.name || "Student"}</p>
          <p className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>
            {profile?.major}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3" data-ocid="messages.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-2/3 bg-muted" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div
            className="text-center py-10"
            data-ocid="messages.empty_state"
            style={{ color: "oklch(0.5 0 0)" }}
          >
            <p className="text-3xl mb-3">💬</p>
            <p className="font-bold">No messages yet</p>
            <p className="text-sm">Start the convo!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.from.toString() === myPrincipal;
            const key = `${msg.from.toString()}-${msg.timestamp.toString()}`;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 border-2 text-sm ${
                    isMine ? "border-primary" : "border-accent"
                  }`}
                  style={{
                    background: isMine
                      ? "oklch(0.92 0.26 129 / 0.12)"
                      : "oklch(0.9 0.15 195 / 0.08)",
                    color: "oklch(0.9 0 0)",
                  }}
                >
                  <p>{msg.body}</p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.5 0 0)" }}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {sharedUrls.length > 0 && (
        <div className="px-4 py-2 border-t-2 border-border">
          <p
            className="text-xs font-black mb-2 uppercase tracking-widest"
            style={{ color: "oklch(0.45 0 0)" }}
          >
            Shared Links
          </p>
          <div className="flex flex-wrap gap-2">
            {sharedUrls.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent border border-accent px-2 py-0.5 hover:bg-accent/10 truncate max-w-[200px]"
              >
                {url.replace(/^https?:\/\//, "")}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 p-4 border-t-2 border-border">
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message..."
          className="border-2 border-border bg-input focus:border-primary flex-1"
          data-ocid="messages.message_input"
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <Button
          onClick={handleSend}
          disabled={isPending || !body.trim()}
          className="btn-primary px-4"
          data-ocid="messages.send_button"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function MessagesPage({
  onNavigateToDiscover,
}: {
  onNavigateToDiscover: () => void;
}) {
  const { data: previews = [], isLoading } = useGetConversationPreviews();
  const [activeParty, setActiveParty] = useState<Principal | null>(null);

  const showThread = !!activeParty;

  return (
    <div className="flex h-full">
      <div
        className={`w-full md:w-80 md:flex-shrink-0 border-r-2 border-border flex flex-col ${
          showThread ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="px-4 pt-5 pb-3 border-b-2 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl font-black tracking-tight">Messages</h1>
              <span className="text-3xl">💬</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToDiscover}
              className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider"
              data-ocid="messages.new_message_button"
            >
              <Pencil className="w-3.5 h-3.5" />
              New
            </button>
          </div>
          <p
            className="text-sm font-medium mt-0.5"
            style={{ color: "oklch(0.55 0 0)" }}
          >
            Your async inbox
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-0">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 border-b border-border flex items-center gap-3"
                >
                  <Skeleton className="w-10 h-10 bg-muted rounded-none" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                    <Skeleton className="h-3 w-3/4 bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : previews.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center px-4"
              data-ocid="messages.empty_state"
            >
              <div className="text-4xl mb-3">📭</div>
              <p className="font-black">No messages yet</p>
              <p className="text-sm mt-1" style={{ color: "oklch(0.5 0 0)" }}>
                Find someone to collab with!
              </p>
              <button
                type="button"
                onClick={onNavigateToDiscover}
                className="btn-primary mt-4 px-4 py-2 text-sm font-black uppercase tracking-wider"
                data-ocid="messages.find_people_button"
              >
                Browse Discover 🎯
              </button>
            </div>
          ) : (
            previews.map((preview, i) => (
              <ConversationItem
                key={preview.otherParty.toString()}
                preview={preview}
                isActive={
                  activeParty?.toString() === preview.otherParty.toString()
                }
                onClick={() => setActiveParty(preview.otherParty as Principal)}
                index={i}
              />
            ))
          )}
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col ${showThread ? "flex" : "hidden md:flex"}`}
      >
        {activeParty ? (
          <ThreadView
            otherParty={activeParty}
            onBack={() => setActiveParty(null)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
            <div className="text-5xl mb-4">✉️</div>
            <p className="font-black text-lg">Start a conversation</p>
            <p
              className="text-sm mt-1 mb-5"
              style={{ color: "oklch(0.5 0 0)" }}
            >
              Pick someone from the list, or find new people to message.
            </p>
            <button
              type="button"
              onClick={onNavigateToDiscover}
              className="btn-primary px-5 py-2 text-sm font-black uppercase tracking-wider"
              data-ocid="messages.discover_link_button"
            >
              Find People 🎯
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
