import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import AppShell, { type Page } from "./components/AppShell";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import DiscoverPage from "./pages/DiscoverPage";
import FeedPage from "./pages/FeedPage";
import LandingPage from "./pages/LandingPage";
import MessagesPage from "./pages/MessagesPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isFetched: profileFetched } =
    useGetCallerUserProfile();

  const [activePage, setActivePage] = useState<Page>("feed");

  // Initializing
  if (isInitializing || (isAuthenticated && !profileFetched)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="border-2 border-primary p-4"
            style={{ boxShadow: "4px 4px 0px oklch(0.92 0.26 129)" }}
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground font-semibold text-sm">
            Loading Campus Collab...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage />
        <Toaster position="top-center" />
      </>
    );
  }

  // Logged in but no profile
  if (isAuthenticated && profileFetched && userProfile === null) {
    return (
      <>
        <ProfileSetupPage />
        <Toaster position="top-center" />
      </>
    );
  }

  // Main app
  return (
    <>
      <AppShell activePage={activePage} onNavigate={setActivePage}>
        {activePage === "feed" && (
          <FeedPage onNavigateToMessages={() => setActivePage("messages")} />
        )}
        {activePage === "discover" && (
          <DiscoverPage
            onNavigateToMessages={() => setActivePage("messages")}
          />
        )}
        {activePage === "post" && (
          <PostPage onSuccess={() => setActivePage("feed")} />
        )}
        {activePage === "messages" && (
          <MessagesPage
            onNavigateToDiscover={() => setActivePage("discover")}
          />
        )}
        {activePage === "profile" && <ProfilePage />}
      </AppShell>
      <Toaster position="top-center" />
    </>
  );
}
