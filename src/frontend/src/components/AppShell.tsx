import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Home,
  MessageSquare,
  PlusSquare,
  Search,
  User,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  useGetConversationPreviews,
  useGetUnreadCount,
} from "../hooks/useQueries";

export type Page = "feed" | "discover" | "post" | "messages" | "profile";

const NAV_ITEMS: {
  id: Page;
  label: string;
  icon: typeof Home;
  ocid: string;
}[] = [
  { id: "feed", label: "Feed", icon: Home, ocid: "nav.feed_link" },
  {
    id: "discover",
    label: "Discover",
    icon: Search,
    ocid: "nav.discover_link",
  },
  { id: "post", label: "Post", icon: PlusSquare, ocid: "nav.post_link" },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    ocid: "nav.messages_link",
  },
  { id: "profile", label: "Profile", icon: User, ocid: "nav.profile_link" },
];

function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function NotificationBell({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const { data: unreadCount } = useGetUnreadCount();
  const { data: previews = [] } = useGetConversationPreviews();
  const unread = Number(unreadCount ?? 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex items-center justify-center w-8 h-8 border-2 border-border hover:border-primary transition-colors"
          data-ocid="nav.notifications.button"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          {unread > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 text-[9px] font-black leading-none flex items-center justify-center"
              style={{
                minWidth: 16,
                height: 16,
                background: "oklch(0.62 0.32 328)",
                color: "#fff",
                padding: "0 3px",
              }}
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 border-2 border-border bg-card p-0 shadow-[4px_4px_0px_oklch(0.92_0.26_129_/_0.3)]"
        data-ocid="nav.notifications.dropdown_menu"
      >
        <div className="px-4 py-3 border-b-2 border-border flex items-center justify-between">
          <span className="text-sm font-black tracking-wide uppercase">
            Notifications
          </span>
          {unread > 0 && (
            <span
              className="text-xs font-black px-2 py-0.5"
              style={{ background: "oklch(0.62 0.32 328)", color: "#fff" }}
            >
              {unread} new
            </span>
          )}
        </div>
        {previews.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="text-3xl mb-2">🔔</div>
            <p className="text-xs font-semibold text-muted-foreground">
              No new notifications
            </p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {previews.map((preview, idx) => {
              const principal = preview.otherParty.toString();
              const displayName = `${principal.slice(0, 8)}...`;
              const lastMsg = preview.lastMessage
                ? preview.lastMessage.length > 50
                  ? `${preview.lastMessage.slice(0, 50)}\u2026`
                  : preview.lastMessage
                : "New message";
              const hasUnread = preview.unreadCount > BigInt(0);
              return (
                <DropdownMenuItem
                  key={principal}
                  onClick={() => onNavigate("messages")}
                  className="flex flex-col items-start gap-0.5 px-4 py-3 cursor-pointer border-b border-border last:border-b-0 focus:bg-primary/10 rounded-none"
                  data-ocid={`nav.notifications.item.${idx + 1}`}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span
                      className={`text-xs font-black ${
                        hasUnread ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {timeAgo(preview.timestamp)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground leading-snug">
                    {lastMsg}
                  </span>
                  {hasUnread && (
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 mt-0.5"
                      style={{
                        background: "oklch(0.62 0.32 328)",
                        color: "#fff",
                      }}
                    >
                      {preview.unreadCount.toString()} unread
                    </span>
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AppShell({
  children,
  activePage,
  onNavigate,
}: {
  children: ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
}) {
  const { data: unreadCount } = useGetUnreadCount();
  const unread = Number(unreadCount ?? 0);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r-2 border-border bg-sidebar flex-shrink-0">
        <div className="p-5 border-b-2 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="border-2 border-primary p-1.5"
                style={{ boxShadow: "3px 3px 0px oklch(0.92 0.26 129)" }}
              >
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Campus Collab
              </span>
            </div>
            <NotificationBell onNavigate={onNavigate} />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon, ocid }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              data-ocid={ocid}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all border-2 ${
                activePage === id
                  ? "border-primary text-primary bg-primary/10"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {id === "messages" && unread > 0 && (
                <span className="unread-badge">{unread}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}{" "}
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
      </aside>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile top bar with notifications */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 border-b-2 border-border bg-sidebar flex-shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm tracking-tight">
              Campus Collab
            </span>
          </div>
          <NotificationBell onNavigate={onNavigate} />
        </div>

        <div className="flex-1 overflow-hidden">{children}</div>

        <nav className="md:hidden flex border-t-2 border-border bg-sidebar flex-shrink-0">
          {NAV_ITEMS.map(({ id, label, icon: Icon, ocid }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              data-ocid={ocid}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-semibold transition-colors relative ${
                activePage === id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
              {id === "messages" && unread > 0 && (
                <span
                  className="absolute top-1.5 right-1/2 translate-x-3 unread-badge text-[9px]"
                  style={{ minWidth: 14, height: 14 }}
                >
                  {unread}
                </span>
              )}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
