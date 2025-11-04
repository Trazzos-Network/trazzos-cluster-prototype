# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.9.0 or higher
- **pnpm**: Version 8.0.0 or higher (package manager)
- **Git**: For version control
- **Code Editor**: VS Code recommended with the following extensions:
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trazzos-cluster-prototype
```

### 2. Install pnpm (if not already installed)

```bash
# Using npm
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm

# Or using Chocolatey (Windows)
choco install pnpm
```

Verify installation:

```bash
pnpm --version
```

### 3. Install Dependencies

```bash
pnpm install
```

This will install all required packages listed in `package.json`.

### 4. Environment Variables (Future)

When environment variables are needed, create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your values.

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
trazzos-cluster-prototype/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
│
├── lib/                   # Utilities
│   └── utils.ts          # Helper functions
│
├── docs/                  # Documentation
│   ├── architecture/     # Architecture docs
│   ├── features/         # Feature docs
│   ├── guides/           # This file
│   └── ...
│
├── public/               # Static assets
├── .cursorrules          # Cursor IDE rules
├── AGENTS.md             # AI agent guidelines
├── components.json       # shadcn/ui config
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── next.config.ts        # Next.js config
```

## Available Scripts

### Development

```bash
# Start development server
pnpm dev

# The server will start at http://localhost:3000
# Hot reload is enabled
```

### Building

```bash
# Create production build
pnpm build

# The build output will be in .next/
```

### Production

```bash
# Start production server (after build)
pnpm start
```

### Linting

```bash
# Run ESLint
pnpm lint

# Fix auto-fixable issues
pnpm lint --fix
```

### Type Checking

```bash
# Run TypeScript compiler (check only)
pnpm type-check
```

### Adding Components

```bash
# Add shadcn/ui component
pnpm dlx shadcn@latest add <component-name>

# Example: Add table component
pnpm dlx shadcn@latest add table
```

## First Steps After Installation

### 1. Explore the Demo Page

Visit `http://localhost:3000` to see:

- Component showcase
- Theme switching (light/dark/system)
- Form examples
- UI component variants

### 2. Try Theme Switching

Click the theme toggle button in the header to switch between:

- ☀️ Light mode
- 🌙 Dark mode
- 💻 System preference

### 3. Review the Codebase

Key files to review:

- `app/page.tsx` - Home page with component demos
- `app/layout.tsx` - Root layout with theme provider
- `components/theme-toggle.tsx` - Theme switcher component
- `app/globals.css` - Global styles and theme variables

### 4. Read the Documentation

Familiarize yourself with:

- [Architecture Overview](../architecture/overview.md)
- [Technology Stack](../architecture/tech-stack.md)
- [Development Workflow](./development.md)
- [Contributing Guidelines](./contributing.md)

### 5. Check the Guidelines

For AI-assisted development:

- [.cursorrules](../../.cursorrules) - Cursor IDE rules
- [AGENTS.md](../../AGENTS.md) - Comprehensive AI agent guidelines

## Creating Your First Feature

### Step 1: Plan

1. Determine what you're building
2. Check if components already exist
3. Review [Component Patterns](../patterns/component-patterns.md)
4. Plan your folder structure

### Step 2: Create Files

Example: Creating a user profile feature

```bash
# Create component
mkdir -p components/features/user-profile
touch components/features/user-profile/user-profile.tsx

# Create types (if needed)
touch types/user.ts

# Create documentation
touch docs/features/user-profile.md
```

### Step 3: Implement

```typescript
// components/features/user-profile/user-profile.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface UserProfileProps {
  name: string;
  email: string;
  avatar?: string;
}

export function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <Avatar src={avatar} alt={name} />
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{email}</p>
      </CardContent>
    </Card>
  );
}
```

### Step 4: Document

Update `docs/features/user-profile.md` with:

- Feature overview
- Usage examples
- Props documentation
- Implementation details

### Step 5: Use

```typescript
// app/profile/page.tsx
import { UserProfile } from "@/components/features/user-profile/user-profile";

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
      <UserProfile name="John Doe" email="john@example.com" />
    </div>
  );
}
```

## Common Tasks

### Adding a New Page

```bash
# Create a new page
touch app/about/page.tsx
```

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      <p>About page content</p>
    </div>
  );
}
```

Visit: `http://localhost:3000/about`

### Adding a New Component

```bash
# Add from shadcn/ui
pnpm dlx shadcn@latest add tooltip

# Use in your code
import { Tooltip } from '@/components/ui/tooltip'
```

### Styling Components

Use Tailwind CSS utility classes:

```typescript
<div className="flex flex-col gap-4 p-6 rounded-lg bg-background border">
  <h2 className="text-2xl font-bold">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Adding Custom Utilities

```typescript
// lib/utils.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Usage
import { formatDate } from "@/lib/utils";

const formattedDate = formatDate(new Date());
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -- -p 3001
```

### Cache Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# CMD/CTRL + Shift + P -> "TypeScript: Restart TS Server"

# Check types manually
pnpm type-check
```

### Module Not Found

```bash
# Ensure path aliases are correct in tsconfig.json
# Restart dev server
# Clear cache and rebuild
```

For more troubleshooting, see [Troubleshooting Guide](./troubleshooting.md).

## Next Steps

1. ✅ Development environment set up
2. 📚 Read [Development Workflow](./development.md)
3. 🎨 Explore [Component Patterns](../patterns/component-patterns.md)
4. 🏗️ Review [Architecture Overview](../architecture/overview.md)
5. 🤝 Check [Contributing Guidelines](./contributing.md)
6. 🔨 Start building!

## Getting Help

- 📖 Check the [Documentation](../README.md)
- 🐛 Review [Troubleshooting Guide](./troubleshooting.md)
- 💬 Ask the team
- 🤖 Use AI assistants with [AGENTS.md](../../AGENTS.md) guidelines

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

**Welcome to the Trazzos Cluster Prototype!** 🚀

**Last Updated**: October 31, 2025
