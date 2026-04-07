# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shopify Learn is an internal learning platform for devxlabs.ai team members. It includes:
- **Knowledge Hub**: Article contribution/review system with an AI chat assistant (GPT-4o via Vercel AI SDK) that answers questions from approved articles
- **Hackathon system**: Registration, scoring, leaderboard, and admin management
- **Learning content pages**: Static pages covering Shopify CLI, Liquid, APIs, Functions, store admin, etc.
- **App Access Token Wizard**: Multi-step guided flow for generating Shopify app tokens

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Generate Prisma client + Next.js build
npm run lint         # ESLint (flat config, next/core-web-vitals + typescript)
npm run prisma:migrate  # Run Prisma migrations
npm run prisma:studio   # Open Prisma Studio GUI
npm run prisma:seed     # Seed database via tsx prisma/seed.ts
```

## Tech Stack

- **Framework**: Next.js 16 with App Router, React 19
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Database**: PostgreSQL via Prisma ORM (Neon-compatible with connection pooling)
- **Auth**: NextAuth v4 with Google OAuth, database sessions, PrismaAdapter. Only `@devxlabs.ai` emails can sign in.
- **AI Chat**: Vercel AI SDK (`ai` + `@ai-sdk/openai`) streaming GPT-4o responses
- **Animations**: Framer Motion
- **Search**: Fuse.js client-side fuzzy search
- **Path alias**: `@/*` maps to `./src/*`

## Architecture

### Authentication & Authorization
- NextAuth configured in `src/app/api/auth/[...nextauth]/route.ts` — exports `authOptions` used across API routes
- Three roles: MEMBER < ADMIN < SUPERADMIN (hierarchy-based access in `src/lib/auth/roles.ts`)
- API route auth helpers in `src/lib/auth/apiAuth.ts`: `requireAuth()` and `requireRole(role)` return `{ error, session }`
- Client-side role guard: `src/components/auth/RoleGuard.tsx`
- Session provider wraps the app via `src/app/providers.tsx`

### Knowledge Hub
- Articles managed via external API (`KB_API_BASE_URL` env var) — not stored in local DB
- `src/lib/knowledge-base.ts` fetches articles from the external knowledge base API
- Article CRUD routes at `src/app/api/knowledge-hub/articles/` proxy to the external API
- Review/approval workflow with team lead assignment
- AI chat route at `src/app/api/knowledge-hub/chat/route.ts` loads all approved articles as context

### Hackathon System
- Fully database-backed via Prisma (HackathonSettings, Score models)
- API routes under `src/app/api/hackathon/` for leaderboard, registration, scores, settings, users
- Admin panel at `/hackathon/admin`, superadmin at `/hackathon/superadmin`

### Layout
- Root layout: `src/app/layout.tsx` with Inter + Instrument Serif fonts
- `RootLayoutContent` wraps Header + Sidebar + main content
- Shared UI components in `src/components/ui/`

## Environment Variables

Required (see `.env`):
- `DATABASE_URL` — PostgreSQL connection string
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `KB_API_BASE_URL` — External knowledge base API
- `OPENAI_API_KEY` — For AI chat feature

## Key Conventions

- TypeScript strict mode enabled
- Shared types in `src/types/index.ts` (UserRole mirrors Prisma enum)
- API routes return `{ success: boolean, data?, error? }` shape
- Images only allowed from `cdn.shopify.com` (configured in `next.config.ts`)
