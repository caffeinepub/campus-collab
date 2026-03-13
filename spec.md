# Campus Collab

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full authentication system (sign up, log in, log out) with user profiles
- User profile: name, university major, skills offered, availability status (Looking / Busy), portfolio link
- Project feed: all projects listed with skill-based filter chips
- Project creation form: title, pitch description, skills offered, skills needed (multi-select), optional Figma URL, optional GitHub URL
- Talent/People directory: browse all users, filter by skill and major
- Async DM inbox: send and read messages between users (stored in backend, delivered on refresh)
- Notifications badge for unread messages (Cyber Pink accent)

### Modify
N/A — new project.

### Remove
N/A — new project.

## Implementation Plan

### Backend (Motoko)
- `UserProfile` record: principal, name, major, skillsOffered: [Text], availability: {#looking | #busy}, portfolioUrl: ?Text, avatarUrl: ?Text
- `Project` record: id, ownerPrincipal, title, description, skillsOffered: [Text], skillsNeeded: [Text], figmaUrl: ?Text, githubUrl: ?Text, createdAt: Int
- `Message` record: id, fromPrincipal, toPrincipal, body: Text, projectRef: ?Nat, sentAt: Int, read: Bool
- CRUD APIs: createProfile, updateProfile, getMyProfile, getProfile(principal)
- Project APIs: createProject, getProjects (all + optional skill filter), getProject(id), getMyProjects
- People APIs: getUsers (all + optional skill/major filter)
- Messaging APIs: sendMessage(to, body, ?projectRef), getConversations (list of unique threads), getThread(otherPrincipal), markRead
- Unread count query: getUnreadCount

### Frontend
- App shell with bottom nav (mobile) and sidebar nav (desktop): Feed, Discover, Post, Messages, Profile
- Auth screens: Sign Up and Log In (Internet Identity or simple username/password via authorization component)
- Feed screen: project cards with avatar, title, skill tags, "Join the Team" CTA; skill filter chips at top
- Post screen: multi-step form (Step 1: title + description, Step 2: skills offered + needed, Step 3: links)
- Discover screen: user profile cards grid with skill/major filter
- Messages screen: conversation list sidebar + thread view with message bubbles and shared links section
- Profile screen: editable profile with skills, availability toggle, portfolio link
- Neo-brutalist dark mode design: #121212 bg, #CCFF00 primary, #FF00BF notifications, #00FFFF secondary, 2px borders, hard shadows
- Responsive: mobile-first with desktop layout adjustments
- Space Grotesk or Syne font
