# Campus Collab

## Current State
Full-stack campus collaboration app with Feed, Discover, Post, Messages, and Profile pages. Neo-brutalist dark mode UI. AppShell has desktop sidebar + mobile bottom nav. Unread message count is polled and shown as a badge on the Messages nav item. LandingPage has a "Get Started" button. Discover cards have "Send Message" button per user.

## Requested Changes (Diff)

### Add
- **Get Started button pop animation**: On hover, the button scales up with a bounce/glow effect (scale + neon lime glow pulse) to make it feel interactive and energetic.
- **Notifications bell dropdown in AppShell**: A bell icon in the desktop sidebar header and mobile top bar. Clicking it opens a dropdown panel showing recent notifications. Notifications are derived from unread conversation previews ("X messaged you") and are displayed with sender name, message preview, and timestamp. Clicking a notification navigates to Messages.
- **DM from anywhere via profile click**: In FeedPage, clicking a project owner's avatar/name opens a small profile popover or inline profile card showing their name, major, skills, and a "Send Message" button. In DiscoverPage, clicking the avatar/name (not just the button) opens the same flow.

### Modify
- AppShell: Add notification bell with unread badge to header area (desktop sidebar top, mobile top bar).
- LandingPage: Add hover animation (scale + glow) to the "Get Started" button.
- FeedPage: Make owner avatar/name clickable to open a mini profile card with Send Message.
- DiscoverPage: Make avatar/name clickable (already has button, ensure the card header is also clickable).

### Remove
- Nothing removed.

## Implementation Plan
1. LandingPage.tsx: Add `whileHover` motion props to the "Get Started" button for scale + glow effect using framer-motion.
2. AppShell.tsx: Add Bell icon with notification dropdown (using shadcn Popover or DropdownMenu). Fetch conversation previews to populate notification list. Show unread count badge on bell. Clicking a notification calls onNavigate("messages").
3. FeedPage.tsx: Wrap owner avatar+name in a clickable element that opens a SendMessageDialog (or reuses existing one) pre-filled with the owner's principal.
4. DiscoverPage.tsx: Wrap avatar+name in clickable trigger that also opens SendMessageDialog (complementary to existing button).
5. AppShell needs `onNavigate` accessible in notification bell -- already passed as prop.
