# Forge & Steel E-commerce Platform - AI Coding Guide

This is a Next.js 15 e-commerce platform with Prisma, PostgreSQL, NextAuth.js, and bilingual support (English/Hebrew).

## Architecture Overview

### Core Stack
- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL
- **Auth**: NextAuth.js v5 (Google OAuth + credentials)
- **State**: Zustand (cart), React Context (language, settings)
- **Styling**: Tailwind + Radix UI components

### Key Patterns

**Bilingual Data Model**: All content models have `name/nameEn/nameHe` and `description/descriptionEn/descriptionHe` fields. API routes localize content based on `lang` query param.

**Role-Based Access**: Users have `USER` or `ADMIN` roles. Admin routes in `/admin/*` use separate layout with sidebar navigation.

**Guest Checkout**: Orders support `userId: null` for guest purchases.

## Essential File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (user)/            # User-scoped routes with special layout
│   ├── admin/             # Admin dashboard with auth checks
│   └── api/               # Backend endpoints
├── components/
│   ├── admin/             # Admin-specific components
│   ├── ui/                # shadcn/ui base components
│   └── [feature]/         # Feature-grouped components
├── contexts/              # React contexts (language, settings)
├── lib/                   # Utilities (auth, prisma, utils)
├── store/                 # Zustand stores
└── types/                 # TypeScript definitions
```

## Development Workflows

### Database Management
```bash
# Development setup with Docker
docker-compose up -d

# Schema changes
npx prisma migrate dev --name "description_of_change"

# Seed data
npm run seed

# Create admin user
npm run create-admin

# View data
npx prisma studio
```

### Key Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run seed` - Populate database with sample data

## Critical Implementation Patterns

### API Route Localization
```typescript
// All product/category APIs support lang parameter
const lang = searchParams.get("lang") || "en";
const localizedName = lang === "he" && item.nameHe ? item.nameHe : item.nameEn || item.name;
```

### Cart State Management
Uses Zustand with persistence. Cart items include `productId`, `name`, `price`, `image`, `quantity`. Always sync with server-side cart for authenticated users.

### Component Architecture
- All UI components use shadcn/ui patterns
- Product cards have hover states with quick-view modals
- Form components use react-hook-form + zod validation
- Image uploads integrate with Cloudinary

### Authentication Flow
- NextAuth.js v5 with JWT strategy
- Admin routes temporarily have auth checks commented out (TODO: uncomment)
- Session includes `user.role` for role-based access
- Credentials provider for email/password, Google for OAuth

### Multilingual Support
- `LanguageContext` provides `t()` function for translations
- RTL/LTR direction handling for Hebrew
- All user-facing text goes through translation system
- Database fields support multiple languages

## Integration Points

### External Services
- **Cloudinary**: Image uploads and optimization
- **Stripe**: Payment processing (payment intents)
- **Google OAuth**: Social authentication
- **PostgreSQL**: Primary database

### Database Relationships
- Users → Orders (nullable for guest checkout)
- Products → Categories (required)
- Orders → OrderItems → Products
- Users → CartItems → Products (logged-in users only)

## Common Gotchas

1. **Admin Auth**: Currently disabled in middleware and admin layout - check TODO comments
2. **Image Paths**: Use Cloudinary URLs, not local file paths in production
3. **Price Formatting**: Uses Israeli Shekel (ILS) with Hebrew locale formatting
4. **Migrations**: Always test with `prisma migrate dev` before production deployment
5. **Cart Sync**: Local storage cart needs server sync on authentication

## Debugging Tools
- Prisma Studio: Visual database browser
- React DevTools: Component and context inspection
- NextAuth debug pages: `/api/auth/*` endpoints
- Docker logs: `docker-compose logs postgres`

When implementing new features, follow the established patterns for bilingual support, use the existing component library, and maintain consistency with the admin/user route separation.