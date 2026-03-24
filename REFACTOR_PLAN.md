# Mission Control Dashboard - STYLEGUIDE.md Refactor Plan

## Overview
Convert mission-control-dashboard from Tailwind CSS to inline React styles, adhering to STYLEGUIDE.md.

## Files to Refactor
1. app/layout.tsx - Remove Tailwind classes, add inline body styles
2. app/page.tsx - Convert all Tailwind to inline styles
3. app/globals.css - Remove @tailwind directives, keep reset + fonts
4. components/SystemStatusHeader.tsx
5. components/RenderAppsHealth.tsx
6. components/LocalDaemonsStatus.tsx
7. components/CronJobsSchedule.tsx
8. components/RecentAlerts.tsx
9. components/QuickActions.tsx
10. tailwind.config.js - Can remove or keep disabled

## Key Style Rules (from STYLEGUIDE.md)

### Colors
- Background gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Cards: `rgba(255,255,255,0.08)` + `backdropFilter: 'blur(12px)'`
- Border: `1px solid rgba(255,255,255,0.12)`
- Text primary: white `#FFFFFF`
- Text secondary: `rgba(255,255,255,0.6)`
- Border radius: `16px`
- Hover states: background `0.15`, border `0.25`

### Typography
- Font: System fonts `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- h1: `2rem` (32px), weight 700
- h2: `1.5rem` (24px), weight 700
- Body: `0.95rem` (15px), weight 400
- Small: `0.85rem` (13px), weight 400
- Label: `0.75rem` (12px), weight 500

### Spacing (8px base = 0.5rem)
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)
- xl: 3rem (48px)

### Buttons
- Primary: `rgba(255,255,255,0.08)` + border
- Secondary: transparent, no border
- Transition: `all 0.3s ease` on hover
- Border radius: `12px`

## Implementation Strategy
1. Create helper function for style objects to maintain DRY principle
2. Convert layout.tsx first (base styles)
3. Convert page.tsx (main dashboard)
4. Convert each component
5. Test build and visual compliance
6. Commit with proper message
