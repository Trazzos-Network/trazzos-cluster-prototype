# Contributing Guidelines

## Welcome!

Thank you for your interest in contributing to the Trazzos Cluster Prototype. This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. **Read the Documentation**
   - [Getting Started Guide](./getting-started.md)
   - [Architecture Overview](../architecture/overview.md)
   - [Development Workflow](./development.md)

2. **Set Up Your Environment**
   ```bash
   git clone <repository-url>
   cd trazzos-cluster-prototype
   pnpm install
   pnpm dev
   ```

3. **Familiarize Yourself**
   - Review existing code
   - Check open issues
   - Read the style guides

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Convention**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

Follow the project's coding standards:
- Use TypeScript with strict typing
- Follow the component patterns
- Write clean, readable code
- Add proper error handling
- Support dark mode
- Ensure accessibility

### 3. Document Your Changes

**Required Documentation**:
- Update relevant docs in `/docs` folder
- Add JSDoc comments to functions
- Update README if needed
- Create/update ADRs for architectural changes

**Documentation Checklist**:
- [ ] Feature documented in `/docs/features/`
- [ ] API changes documented in `/docs/api/`
- [ ] Architecture decisions recorded (if applicable)
- [ ] Code has JSDoc comments
- [ ] Usage examples provided

### 4. Test Your Changes

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Run tests (when available)
pnpm test

# Test in browser
pnpm dev
```

**Testing Checklist**:
- [ ] Functionality works as expected
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Works in light and dark mode
- [ ] Responsive design works
- [ ] Accessible (keyboard nav, screen readers)

### 5. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(auth): add user login component"
git commit -m "fix(button): resolve dark mode color issue"
git commit -m "docs(api): update endpoint documentation"
```

**Commit Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Good Commit Messages**:
```bash
✅ feat(auth): add login form with validation
✅ fix(theme): resolve flash on theme switch
✅ docs(components): add usage examples for Button
✅ refactor(api): extract validation logic
```

**Bad Commit Messages**:
```bash
❌ updated stuff
❌ fix bug
❌ WIP
❌ asdasd
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Create a Pull Request with:
- Clear title and description
- Reference related issues
- List of changes made
- Screenshots (if UI changes)
- Documentation updates

## Code Standards

### TypeScript

```typescript
// ✅ Good: Explicit types
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // Implementation
}

// ❌ Bad: Using 'any'
function getUser(id: any): any {
  // Implementation
}
```

### Component Structure

```typescript
// ✅ Good: Well-structured component
import * as React from "react"
import { Button } from "@/components/ui/button"

interface UserCardProps {
  name: string
  email: string
  onEdit?: () => void
}

/**
 * Displays user information in a card format
 */
export function UserCard({ name, email, onEdit }: UserCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-muted-foreground">{email}</p>
      {onEdit && (
        <Button onClick={onEdit} className="mt-2">
          Edit
        </Button>
      )}
    </div>
  )
}
```

### Styling

```typescript
// ✅ Good: Use semantic colors
<div className="bg-background text-foreground border-border">

// ❌ Bad: Hard-coded colors
<div className="bg-white text-black border-gray-200">
```

### Error Handling

```typescript
// ✅ Good: Proper error handling
try {
  const data = await fetchData()
  return data
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message)
    throw error
  }
  throw new Error('Unexpected error occurred')
}

// ❌ Bad: Silent failures
try {
  const data = await fetchData()
  return data
} catch (error) {
  return null
}
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project standards
- [ ] TypeScript types are complete
- [ ] Documentation is updated
- [ ] Tests pass (if applicable)
- [ ] No console.logs or debug code
- [ ] Linting passes
- [ ] Dark mode works
- [ ] Responsive design works
- [ ] Accessibility is maintained

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Changes Made
- Change 1
- Change 2
- Change 3

## Documentation
- [ ] Documentation updated in /docs
- [ ] JSDoc comments added
- [ ] ADR created (if architectural change)

## Testing
- [ ] Tested locally
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Works in light/dark mode
- [ ] Responsive design verified

## Screenshots
(If applicable)

## Related Issues
Closes #123

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have documented my changes
- [ ] I have added tests (if applicable)
- [ ] All tests pass
- [ ] I have checked for accessibility
```

### Review Process

1. **Automated Checks**: CI runs linting and type checking
2. **Code Review**: Team member reviews the code
3. **Feedback**: Address review comments
4. **Approval**: Once approved, PR can be merged
5. **Merge**: Squash and merge to main branch

## Package Management

### Installing Dependencies

```bash
# ✅ Always use pnpm
pnpm add <package>
pnpm add -D <dev-package>

# ❌ Never use npm or yarn
npm install <package>  # NO!
yarn add <package>     # NO!
```

### Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

## Documentation Standards

### Feature Documentation

Create documentation in `/docs/features/`:

```markdown
# Feature: [Name]

## Overview
What does this feature do?

## Usage
How to use this feature with code examples

## API Reference
Props, parameters, types

## Implementation Details
Technical details

## Dependencies
What does this depend on?
```

### API Documentation

Document in `/docs/api/`:

```markdown
# API Endpoint: [Name]

## Endpoint
`POST /api/users`

## Request
\`\`\`typescript
{
  name: string
  email: string
}
\`\`\`

## Response
\`\`\`typescript
{
  success: boolean
  data: User
}
\`\`\`

## Error Codes
- 400: Validation error
- 401: Unauthorized
- 500: Server error
```

## Common Tasks

### Adding a New Page

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="mt-4 text-muted-foreground">About content</p>
    </div>
  )
}
```

### Adding a New Component

```typescript
// components/features/user-profile/user-profile.tsx
import { Card } from '@/components/ui/card'

export interface UserProfileProps {
  // Props
}

/**
 * Displays user profile information
 */
export function UserProfile(props: UserProfileProps) {
  // Implementation
}
```

### Adding Types

```typescript
// types/user.ts
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export type UserRole = 'admin' | 'user' | 'guest'
```

## Communication

### Asking Questions

- Check documentation first
- Search existing issues
- Ask in team chat
- Create a discussion issue

### Reporting Bugs

Use the bug report template:

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen?

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 98]
- Node version: [e.g., 20.10.0]
```

### Suggesting Features

Use the feature request template:

```markdown
**Feature Description**
Clear description of the feature.

**Use Case**
Why is this needed?

**Proposed Solution**
How could this work?

**Alternatives**
Other solutions considered?
```

## Resources

- [Getting Started](./getting-started.md)
- [Development Workflow](./development.md)
- [Architecture Overview](../architecture/overview.md)
- [Component Patterns](../patterns/component-patterns.md)
- [.cursorrules](../../.cursorrules)
- [AGENTS.md](../../AGENTS.md)

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing! 🎉

---

**Last Updated**: October 31, 2025

