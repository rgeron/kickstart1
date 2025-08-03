# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Next.js project using TypeScript, Prisma, and PostgreSQL with better-auth for authentication.

### Core Development Commands

- `npm run dev` - Start development server with Turbopack (requires `prisma generate` first)
- `npm run build` - Build for production (includes `prisma generate`)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `prisma generate` - Generate Prisma client (required before dev/build)
- `prisma db push` - Push schema changes to database
- `prisma db pull` - Pull schema from database
- `prisma studio` - Open Prisma Studio for database inspection
- `prisma migrate dev` - Create and apply migrations in development

## Architecture Overview

### Authentication System

This project uses **better-auth** with the following configuration:

- Database adapter: Prisma with PostgreSQL
- Email verification required for registration
- Magic link authentication supported
- OAuth providers: Google
- Role-based access control (USER/ADMIN roles)
- Password hashing with Argon2
- Custom session management with 30-day expiration

Key files:

- `src/lib/auth/auth.ts` - Main authentication configuration
- `src/lib/auth/auth-client.ts` - Client-side auth utilities
- `src/lib/permissions.ts` - Access control and role definitions
- `src/middleware.ts` - Route protection middleware

### Database Schema

Using Prisma with PostgreSQL. Core entities:

- **User** - Authentication, roles (USER/ADMIN), profile data
- **Post** - User-generated content with voting/liking system
- **Comment** - Comments on posts
- **PostLike/PostVote** - User interactions with posts
- **Session/Account** - Authentication session management
- **Verification** - Email verification tokens

Prisma client is generated to `src/generated/prisma/` (not the default location).

- **Prisma Integration**: Always use `import { prisma } from "@/lib/prisma";` for database interactions

- **Prisma Client**: Always use `import { prisma } from "@/lib/prisma";`

### File Upload System

- AWS S3 integration via `@aws-sdk/client-s3`
- Files organized by user ID prefix: `users/{userId}/{filename}`
- Upload actions in `src/features/r2-bucket/`

### Email System

- Uses Resend for email delivery
- React Email for template rendering
- Email verification, password reset, and magic links
- Send actions in `src/actions/emails/`

### Component Architecture

- **UI Components**: Located in `src/components/ui/` (shadcn/ui based)
- **Auth Components**: Login, register, password reset forms in `src/components/auth-management/`
- **Feature Components**: Organized by functionality (profile, file management, etc.)
- Uses Radix UI primitives with custom styling

### State Management

- React hooks for local state
- Custom hooks in `src/hooks/` for common patterns
- No global state management library detected

### Styling

- Tailwind CSS with custom configuration
- Dark/light theme support via `next-themes`
- Geist font family (Google Fonts)

## Key Configuration Files

- `prisma/schema.prisma` - Database schema definition
- `src/lib/auth/auth.ts` - Authentication configuration
- `src/lib/permissions.ts` - Role-based access control
- `src/middleware.ts` - Next.js middleware for route protection

## Environment Variables Required

Based on the authentication configuration, these environment variables are needed:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `RESEND_API_KEY` - Email service API key
- `ADMIN_EMAILS` - Semicolon-separated list of admin email addresses
- AWS S3 credentials for file upload functionality

## Development Workflow

1. Always run `prisma generate` before starting development
2. For database changes, update `prisma/schema.prisma` then run `prisma db push` or create migrations
3. Authentication is handled through better-auth API routes at `/api/auth/*`
4. Role-based permissions are enforced through the access control system
5. File uploads go through server actions with S3 integration

## Testing

No specific test configuration found in the project. Tests would need to be set up if required.
