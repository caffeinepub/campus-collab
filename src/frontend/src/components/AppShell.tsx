import {
  Home,
  MessageSquare,
  PlusSquare,
  Search,
  User,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useGetUnreadCount } from "../hooks/useQueries";

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
  { id: "post", label: "The Ask", icon: PlusSquare, ocid: "nav.post_link" },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    ocid: "nav.messages_link",
  },
  { id: "profile", label: "Profile", icon: User, ocid: "nav.profile_link" },
];

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
