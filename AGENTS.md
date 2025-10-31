# AI Agent Guidelines - Trazzos Cluster Prototype

## Introduction

This document provides comprehensive guidelines for AI agents (including Cursor, GitHub Copilot, and other AI assistants) working on the Trazzos Cluster Prototype project. Following these guidelines ensures consistency, maintainability, and high code quality.

## Core Philosophy

### System 2 Thinking

- **Analyze before acting**: Break down requirements into smaller, manageable parts
- **Consider multiple approaches**: Evaluate different solutions before implementation
- **Think through edge cases**: Identify potential issues before they occur
- **Plan architecture**: Design the solution before writing code

### Tree of Thoughts

- Explore multiple solution paths simultaneously
- Evaluate pros and cons of each approach
- Select the optimal solution based on:
  - Performance implications
  - Maintainability
  - Scalability
  - Code reusability
  - Security considerations

### Iterative Refinement

- Implement initial solution
- Review and identify improvements
- Optimize for edge cases
- Refine for better performance
- Ensure comprehensive error handling

## Project Context

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5+
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand + TanStack Query
- **Validation**: Zod
- **Icons**: Lucide React
- **Theme**: next-themes
- **Package Manager**: **pnpm (REQUIRED)**

### Key Features

- Server-side rendering (SSR)
- Dark/Light mode with system preference
- Type-safe API routes
- Component-driven architecture
- Responsive design
- Accessibility-first approach

## Documentation Protocol

### Critical Rule: Document as You Build

**Every significant change requires documentation updates in `/docs`**

### Documentation Workflow

1. **Before Implementation**

   - Create feature documentation outline in `/docs/features/`
   - Document architectural decisions in `/docs/architecture/decisions/`
   - Plan API contracts in `/docs/api/`

2. **During Implementation**

   - Add inline comments for complex logic
   - Write JSDoc for public functions
   - Document type definitions

3. **After Implementation**
   - Complete feature documentation
   - Add usage examples
   - Update API documentation
   - Create/update relevant guides

### Documentation Structure

```
docs/
├── README.md                           # Documentation overview
├── architecture/
│   ├── overview.md                     # System architecture
│   ├── decisions/                      # Architecture Decision Records
│   │   ├── 001-state-management.md
│   │   ├── 002-authentication.md
│   │   └── template.md
│   ├── diagrams/                       # System diagrams
│   └── tech-stack.md                   # Technology choices
├── features/
│   ├── authentication.md               # Feature documentation
│   ├── user-management.md
│   ├── theme-system.md
│   └── [feature-name].md
├── api/
│   ├── overview.md                     # API overview
│   ├── endpoints/                      # Endpoint documentation
│   │   ├── auth.md
│   │   └── users.md
│   ├── schemas.md                      # Data schemas
│   └── error-codes.md                  # Error handling
├── components/
│   ├── ui-components.md                # UI component guide
│   ├── feature-components.md           # Feature components
│   └── custom-hooks.md                 # Custom hooks
├── guides/
│   ├── getting-started.md              # Setup and installation
│   ├── development.md                  # Development workflow
│   ├── contributing.md                 # Contribution guidelines
│   ├── testing.md                      # Testing guide
│   ├── deployment.md                   # Deployment guide
│   └── troubleshooting.md              # Common issues
└── patterns/
    ├── component-patterns.md           # Component best practices
    ├── state-management.md             # State patterns
    ├── error-handling.md               # Error handling patterns
    └── performance.md                  # Performance patterns
```

### Documentation Templates

#### Architecture Decision Record (ADR)

```markdown
# ADR-XXX: [Decision Title]

## Date

YYYY-MM-DD

## Status

Proposed | Accepted | Deprecated | Superseded

## Context

What is the issue we're trying to solve? What are the constraints?

## Decision

What decision did we make?

## Rationale

Why did we make this decision? What alternatives did we consider?

## Consequences

What are the positive and negative implications of this decision?

## Implementation

How will this be implemented?

## References

- Links to relevant resources
- Related ADRs
```

#### Feature Documentation

````markdown
# Feature: [Feature Name]

## Overview

Brief description of the feature.

## Business Value

Why this feature exists and what problem it solves.

## User Stories

- As a [user type], I want to [action] so that [benefit]

## Technical Implementation

### Architecture

- Component structure
- Data flow
- State management approach

### Components

List of components with descriptions

### API Endpoints

List of API endpoints used

### Data Models

```typescript
// Type definitions
```
````

## Usage Examples

### Basic Usage

```typescript
// Code example
```

### Advanced Usage

```typescript
// Advanced example
```

## Dependencies

- List of external dependencies
- Internal dependencies

## Testing

- Test coverage
- Test scenarios
- How to run tests

## Security Considerations

- Authentication/Authorization
- Data validation
- Potential vulnerabilities addressed

## Performance Considerations

- Optimization techniques used
- Performance metrics
- Caching strategy

## Accessibility

- WCAG compliance level
- Keyboard navigation
- Screen reader support

## Browser Support

- Minimum browser versions
- Known issues

## Future Enhancements

- Planned improvements
- Known limitations
- Technical debt

## Changelog

- Version history
- Major changes

````

## Code Standards

### TypeScript Guidelines

#### Type Safety
```typescript
// ✅ Good: Explicit types
interface UserProfile {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

function updateUser(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
  // Implementation
}

// ❌ Bad: Using 'any'
function updateUser(userId: any, data: any): any {
  // Implementation
}
````

#### Type Guards

```typescript
// ✅ Good: Proper type guards
function isUser(value: unknown): value is UserProfile {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value
  );
}

// Usage
if (isUser(data)) {
  console.log(data.email); // Type-safe
}
```

#### Discriminated Unions

```typescript
// ✅ Good: Discriminated unions for state
type LoadingState = { status: "loading" };
type SuccessState<T> = { status: "success"; data: T };
type ErrorState = { status: "error"; error: string };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function handleState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case "loading":
      return <Spinner />;
    case "success":
      return <DataDisplay data={state.data} />;
    case "error":
      return <ErrorMessage error={state.error} />;
  }
}
```

### Component Patterns

#### Server Components (Default)

```typescript
// app/users/page.tsx
// Server Component by default
import { getUsers } from "@/lib/api/users";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

#### Client Components (When Needed)

```typescript
// components/features/interactive-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface InteractiveFormProps {
  onSubmit: (data: FormData) => Promise<void>;
}

export function InteractiveForm({ onSubmit }: InteractiveFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive logic here

  return <form>{/* Form elements */}</form>;
}
```

#### Compound Components

```typescript
// components/ui/data-table.tsx
interface DataTableProps<T> {
  data: T[];
  children: React.ReactNode;
}

function DataTable<T>({ data, children }: DataTableProps<T>) {
  return <table>{children}</table>;
}

function DataTableHeader({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

function DataTableBody<T>({
  data,
  renderRow,
}: {
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}) {
  return <tbody>{data.map(renderRow)}</tbody>;
}

// Usage
<DataTable data={users}>
  <DataTableHeader>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </DataTableHeader>
  <DataTableBody
    data={users}
    renderRow={(user) => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
      </tr>
    )}
  />
</DataTable>;
```

### Error Handling

#### Custom Error Classes

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields: Record<string, string>) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthenticationError";
  }
}
```

#### Error Handling Pattern

```typescript
// lib/api/client.ts
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new AppError(
        error.message || "Request failed",
        error.code || "API_ERROR",
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Network error occurred", "NETWORK_ERROR", 0);
  }
}
```

### State Management

#### Zustand Store Pattern

```typescript
// stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await loginApi(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        await logoutApi();
        set({ user: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        const user = await getCurrentUser();
        set({ user, isAuthenticated: !!user });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

#### React Query Pattern

```typescript
// lib/hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

### Validation with Zod

```typescript
// lib/validations/user.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old").optional(),
  role: z.enum(["admin", "user", "guest"]),
});

export type UserInput = z.infer<typeof userSchema>;

// Usage in API route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    // Process validatedData

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    throw error;
  }
}
```

## Package Management with pnpm

### Why pnpm?

- **Faster**: Up to 2x faster than npm
- **Efficient**: Uses hard links to save disk space
- **Strict**: Better dependency management
- **Monorepo-friendly**: Excellent workspace support

### Common Commands

```bash
# Install dependencies
pnpm install

# Add dependency
pnpm add <package>

# Add dev dependency
pnpm add -D <package>

# Remove dependency
pnpm remove <package>

# Update dependencies
pnpm update

# Run script
pnpm <script-name>

# Add shadcn component
pnpm dlx shadcn@latest add <component>
```

### Never Use

- ❌ `npm install`
- ❌ `npm add`
- ❌ `yarn add`
- ✅ Always use `pnpm`

## Testing Strategy

### Unit Tests

```typescript
// components/ui/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Integration Tests

```typescript
// tests/integration/auth-flow.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "@/app/login/page";

describe("Authentication Flow", () => {
  it("successfully logs in user", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
  });
});
```

## AI Agent Workflow

### Step 1: Understand the Requirement

1. Read the user's request carefully
2. Identify the core functionality needed
3. Consider edge cases and error scenarios
4. Ask clarifying questions if needed

### Step 2: Plan the Implementation

1. Determine which files need to be created/modified
2. Identify dependencies required
3. Plan the folder structure
4. Design the component/feature architecture
5. Outline documentation needs

### Step 3: Implement

1. Create necessary files following the folder structure
2. Write type-safe TypeScript code
3. Implement error handling
4. Add proper validation
5. Ensure accessibility
6. Support dark mode
7. Write JSDoc comments

### Step 4: Document

1. Create/update feature documentation in `/docs/features/`
2. Update API documentation if applicable
3. Add usage examples
4. Document architectural decisions
5. Update relevant guides

### Step 5: Test

1. Write unit tests
2. Consider integration tests for complex features
3. Manually test the functionality
4. Verify dark mode works
5. Check responsive design

### Step 6: Review

1. Check for linting errors
2. Verify type safety
3. Ensure code follows project conventions
4. Confirm documentation is complete
5. Validate all tests pass

## Common Patterns

### API Route Pattern

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Process request
    const user = await createUser(validatedData);

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Custom Hook Pattern

```typescript
// lib/hooks/use-async.ts
import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const data = await asyncFunction();
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      setState({ data: null, error: errorObj, isLoading: false });
      throw errorObj;
    }
  }, []);

  return { ...state, execute };
}
```

## Success Checklist

Before marking any task as complete, verify:

- [ ] Code is TypeScript with full type safety
- [ ] Error handling is implemented
- [ ] Validation is in place
- [ ] Components support dark mode
- [ ] Responsive design is implemented
- [ ] Accessibility is considered (ARIA labels, keyboard nav)
- [ ] JSDoc comments are added
- [ ] Feature documentation created/updated in `/docs`
- [ ] Tests are written (if applicable)
- [ ] Code follows project conventions
- [ ] pnpm was used (not npm or yarn)
- [ ] No console.logs or debug code remains
- [ ] Linting passes
- [ ] Types are correct

## Getting Help

If you're unsure about:

- **Architecture decisions**: Check `/docs/architecture/`
- **Component patterns**: Check `/docs/patterns/`
- **API structure**: Check `/docs/api/`
- **Existing features**: Check `/docs/features/`

When in doubt, ask the user for clarification rather than making assumptions.

## Conclusion

These guidelines ensure that every AI agent working on this project:

- Produces consistent, high-quality code
- Creates comprehensive documentation
- Follows best practices
- Maintains the project's architecture
- Uses the correct tools (pnpm)
- Prioritizes user experience and accessibility

Remember: **Documentation is not optional—it's a core part of every feature implementation.**
