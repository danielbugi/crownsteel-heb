# Crown Steel - Premium Men's Jewelry E-Commerce

A full-stack e-commerce platform for premium men's jewelry, built with Next.js 15, React 19, and TypeScript. Features RTL support for Hebrew, AI-powered chatbot, comprehensive admin dashboard, and modern UI/UX.

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, TailwindCSS |
| **UI Components** | Radix UI, Lucide Icons, React Hook Form |
| **State Management** | Zustand |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | NextAuth.js v5 (credentials + Google OAuth) |
| **AI** | OpenAI API (chatbot) |
| **Images** | Cloudinary |
| **Email** | Resend + React Email |
| **Payments** | Tranzila |

## Features

### Customer Features
- Product catalog with filtering and sorting
- Product variants (sizes, styles)
- Shopping cart with persistence
- Wishlist management
- User accounts and order history
- Product reviews and ratings
- AI chatbot assistant (Hebrew)
- Newsletter subscription

### Admin Dashboard
- Product & category management
- Order management with status tracking
- Customer management
- Inventory tracking with alerts
- Coupon/discount system
- Review moderation
- Blog CMS
- Newsletter management
- Site settings
- Performance analytics

### Technical Features
- RTL (Right-to-Left) Hebrew support
- SEO optimized (structured data, Open Graph, sitemap)
- Web Vitals monitoring
- Responsive design
- Role-based access control

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account
- OpenAI API key (for chatbot)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-com-plat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure `.env.local`**
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/crownsteel"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Email (Resend)
   RESEND_API_KEY="your-resend-api-key"
   FROM_EMAIL="noreply@yourdomain.com"
   ADMIN_EMAIL="admin@yourdomain.com"

   # OpenAI (for chatbot)
   OPENAI_API_KEY="your-openai-api-key"

   # App
   NEXT_PUBLIC_URL="http://localhost:3000"
   ```

5. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

6. **Create an admin user**
   ```bash
   npm run create-admin
   ```

7. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```

8. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (user)/            # Protected user routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── shop/              # Product catalog
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   └── blog/              # Blog pages
├── components/
│   ├── admin/             # Admin components
│   ├── shop/              # Product components
│   ├── cart/              # Cart components
│   ├── chat/              # AI chatbot
│   ├── layout/            # Header, footer, nav
│   └── ui/                # Reusable UI components
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Database client
│   ├── cloudinary.ts      # Image service
│   └── agent/             # AI chatbot tools
├── store/                 # Zustand stores
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
└── emails/                # Email templates
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |
| `npm run create-admin` | Create admin user |

## API Routes

### Public
- `GET /api/products` - List products
- `GET /api/categories` - List categories
- `POST /api/auth/register` - User registration
- `POST /api/newsletter` - Subscribe to newsletter
- `POST /api/contact` - Contact form

### Protected (User)
- `GET /api/wishlist` - Get wishlist
- `POST /api/reviews` - Submit review
- `POST /api/orders` - Create order

### Admin
- `/api/admin/products` - Product CRUD
- `/api/admin/orders` - Order management
- `/api/admin/customers` - Customer management
- `/api/admin/inventory` - Stock management
- `/api/admin/coupons` - Coupon management

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Options
- **Neon** - Serverless PostgreSQL
- **Supabase** - PostgreSQL with extras
- **Vercel Postgres** - Native integration

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | NextAuth encryption key |
| `NEXTAUTH_URL` | Yes | App URL |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `RESEND_API_KEY` | Yes | Resend email API key |
| `OPENAI_API_KEY` | No | OpenAI API key (for chatbot) |

## License

This project is proprietary software. All rights reserved.
