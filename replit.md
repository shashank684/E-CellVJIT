# E-Cell VJIT Website

## Overview

E-Cell VJIT is a modern, highly animated website for the entrepreneurship cell of Vignan's Institute of Information Technology. The project features a responsive frontend with advanced animations, a backend API for contact form management, and an admin dashboard for managing inquiries. The website showcases the organization's mission "Where Ideas Take Off" through a dark-themed, tech startup-inspired design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 using Vite as the build tool. The architecture follows a component-based design with:

- **Component Library**: Custom components built on top of Radix UI primitives with shadcn/ui styling
- **Animation System**: Framer Motion for UI animations and GSAP for advanced timeline control
- **Styling**: Tailwind CSS with a custom design system featuring dark theme (#000000 background) and red accent colors (#d82032)
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
The backend follows a REST API architecture using:

- **Server Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Session-based authentication with jsonwebtoken for admin access
- **Email Service**: SendGrid integration for contact form notifications
- **Security**: CORS, helmet, and cookie-parser middleware for security

### Design System
The project implements a comprehensive design system inspired by modern tech startups:

- **Typography**: Inter font family with hierarchical sizing (56px H1, 36px H2, 16px body)
- **Color Palette**: Black background (#000000), red accents (#d82032), and grayscale supporting colors
- **Component Variants**: Consistent button, card, and form component styling with hover effects
- **Animation Standards**: Respects prefers-reduced-motion accessibility preferences

### Data Management
The application uses a hybrid approach for data:

- **Static Data**: Team members, events, and announcements stored in JSON files during development
- **Dynamic Data**: Contact form submissions stored in PostgreSQL database
- **Form Validation**: Zod schemas for both client and server-side validation

### Responsive Design
Mobile-first responsive design with breakpoints:
- Mobile: ≤640px
- Tablet: 641-1024px  
- Desktop: ≥1025px

## External Dependencies

### Database
- **Neon Database**: PostgreSQL-compatible serverless database
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Connection Pool**: @neondatabase/serverless for efficient connection management

### UI Components
- **Radix UI**: Headless UI primitives for accessibility and keyboard navigation
- **shadcn/ui**: Pre-built components with consistent styling
- **Lucide React**: Icon library for consistent iconography

### Animation Libraries
- **Framer Motion**: Primary animation library for React components
- **GSAP**: Advanced timeline-based animations (planned for complex sequences)

### Development Tools
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **Vite**: Fast development server and build tool with HMR
- **ESBuild**: Fast JavaScript bundler for production builds
- **Tailwind CSS**: Utility-first CSS framework with custom configuration

### Communication Services
- **SendGrid**: Email service for contact form notifications and admin alerts
- **CORS**: Cross-origin resource sharing for API security

### Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation for type-safe form handling
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Build and Deployment
- **Replit Integration**: Development environment optimizations with runtime error modal
- **Environment Variables**: Secure configuration management for database URLs and API keys
- **Production Build**: Optimized bundling with static asset generation