---
name: profile
description: User profile page with avatar upload, inline editing, and activity feed
when-to-use: Designing user profile pages, account pages with editable fields
keywords: profile, avatar, user, inline-edit, activity, upload
priority: high
related: settings.md, auth-register.md
---

# Profile Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Cover | Cover image (h-48) with edit overlay | Shorter on mobile (h-32) |
| Avatar | Profile photo overlapping cover bottom | Centered on mobile |
| Info | Name, role, bio, location | Stack on mobile |
| Tabs | Activity / Projects / Settings | Horizontal scroll on mobile |
| Content | Tab-specific content area | Full width |

## Components (shadcn/ui)

- `Avatar` - Profile photo with fallback initials
- `Button` - Edit profile, follow, message
- `Tabs` - Content sections
- `Card` - Activity feed items
- `Badge` - Role, status indicators
- `Input` - Inline edit fields
- `Dialog` - Avatar crop modal

## Inline Editing Pattern

| Interaction | Behavior |
|-------------|----------|
| Click text | Transform to input field |
| Enter / blur | Save changes |
| Escape | Cancel edit, restore original |
| Visual cue | Pencil icon on hover |

## Avatar Upload

1. Click avatar -> file picker opens
2. Select image -> crop modal appears
3. Crop to circle -> preview shown
4. Confirm -> upload with progress indicator
5. Success -> avatar updates immediately

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --cover-height | 192px (desktop) / 128px (mobile) | Cover image |
| --avatar-size | 120px (desktop) / 80px (mobile) | Profile avatar |
| --avatar-offset | -60px | Avatar overlap on cover |
| --profile-max-width | 768px | Content area max width |

## Animation (Framer Motion)

- Cover image: parallax scroll effect (subtle)
- Avatar: scale-up entrance from 0.8
- Inline edit: smooth height transition on field swap
- Activity items: stagger entrance

## Gemini Design Prompt

```
Create a profile page with cover image, overlapping avatar (120px), name and bio below,
horizontal tabs for Activity/Projects/Settings. Inline editing on name and bio fields.
Avatar click opens crop modal. Use design-system.md tokens.
Activity feed shows recent actions in Card components.
```

## Multi-Stack Adaptation

| Stack | Upload | Inline Edit |
|-------|--------|------------|
| Next.js | Server Action + S3/R2 | Optimistic update + revalidate |
| React SPA | TanStack Mutation + presigned URL | Optimistic update |
| Laravel | Controller + Storage facade | Livewire or Inertia partial |

## Validation Checklist

- [ ] Avatar has fallback (initials) when no image
- [ ] Cover image is editable
- [ ] Inline edit shows visual cue on hover
- [ ] Escape cancels inline edit
- [ ] Avatar upload has crop functionality
- [ ] Upload shows progress indicator
- [ ] Tabs work with URL state (shareable links)
- [ ] Activity feed has pagination or infinite scroll
