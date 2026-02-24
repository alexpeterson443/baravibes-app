# BaraVibes App TODO

## Migration
- [x] Set up theming (warm beige/green/brown palette, casual fonts)
- [x] Migrate all static images to CDN URLs
- [x] Build Hero section component
- [x] Build About section component
- [x] Build Fun Facts section component
- [x] Build Photo Gallery with filters and lightbox
- [x] Build Multi-level Quiz component
- [x] Build 50-state Pet Laws section with interactive map
- [x] Build YouTube Soundboard section
- [x] Build Capybara of the Week section
- [x] Build Photo Filter (Capy-fy) tool
- [x] Build Capy News section
- [x] Build Support/Adopt section
- [x] Build Addy Cole dedication section
- [x] Build Footer with newsletter signup
- [x] Build BackToTop component
- [x] Build CursorTrail paw print effect

## Authentication
- [x] Add auth state to navbar (login button vs user avatar)
- [x] Session management via Manus OAuth

## Backend
- [x] Newsletter subscriber database table and API
- [x] User accounts database schema
- [x] Newsletter subscribe tRPC endpoint

## Testing
- [x] Write vitest tests for auth and newsletter endpoints (6 tests passing)

## Polish
- [x] Mobile responsiveness for all sections
- [x] Casual lowercase tone throughout
- [x] Preserve all existing functionality

## User Account & Settings
- [x] Add user preferences database table (theme, accent color, font size)
- [x] Create tRPC endpoints for saving/loading user preferences
- [x] Build Account/Profile page showing user info (name, email, avatar, sign-in method)
- [x] Build Settings page with appearance customization (dark/light theme, accent colors, font size)
- [x] Update Navbar with proper signed-in state (avatar, dropdown with account/settings links)
- [x] Apply saved preferences site-wide on page load
- [x] Add routes for /account and /settings pages
- [x] Write vitest tests for preferences endpoints

## Admin Features
- [x] Promote alexpeterson443 to admin role in database
- [x] Show admin badge on account page for admin users
- [x] Add admin tRPC endpoints (list users, manage roles, view stats, list subscribers)
- [x] Build Admin Panel page (/admin) with user management, site stats, newsletter subscribers
- [x] Add admin panel link in Navbar dropdown for admin users
- [x] Write vitest tests for admin endpoints

## Admin User Visibility
- [x] Ensure all users who sign in appear in admin panel user list with name and info
- [x] Add auto-refresh/polling to admin panel so new logins appear without manual refresh

## Remove Manus / Add Google & Apple Sign-In
- [ ] Remove all Manus OAuth references and branding from the codebase
- [ ] Replace sign-in buttons with Google and Apple sign-in options
- [ ] Update auth flow for Google and Apple OAuth
- [ ] Remove any Manus-related text or links from the UI
