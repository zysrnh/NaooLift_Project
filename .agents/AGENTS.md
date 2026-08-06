# NaooLift System Architecture & Design Guidelines

## 1. Page Entrance Animations
- All page route transitions (Landing Page, Login, Register, Routines, Logger, History, and all Admin Dashboard pages) MUST feature smooth 0.4s-0.5s CSS / Framer Motion entrance animations (`pageEntranceFadeInUp` / `animate-page-entrance`).
- On route mount, elements fade in smoothly from `translateY(16px)` to `translateY(0)` with a subtle cubic-bezier curve `(0.16, 1, 0.3, 1)`.

## 2. Sharp & Modern Aesthetics (Strict Anti-Overly-Rounded Rule)
- Cards, Modals, HTML Email Templates, and Container surfaces MUST use sleek, sharp, modern corners (**maximum 8px border-radius**).
- Avoid overly rounded pill containers (such as 20px+ rounded dialog cards or 24px rounded input shapes) unless specifically requested for small pill badges.
- All email HTML templates sent via Gmail SMTP MUST use clean `border-radius: 8px` cards with sharp 6px message containers and 4px tag badges.

## 3. Real-Time Admin Avatar & Profile Sync
- Admin profile photo uploads in `ProfilePage.tsx` automatically save to `localStorage.setItem('naoolift_admin_avatar', base64Data)`.
- Trigger `window.dispatchEvent(new Event('storage'))` to immediately sync the avatar photo across the Topbar User Dropdown (`UserDropdown.tsx`) and the Zaki Naoo contact card (`ContactsPage.tsx`).
