# Theme System (Dark/Light Mode)

## Overview

The Trazzos Cluster Prototype includes a comprehensive theme system that supports light mode, dark mode, and automatic system preference detection.

## Implementation

### Core Components

#### 1. ThemeProvider

Location: `components/theme-provider.tsx`

A client-side wrapper component that provides theme context to the entire application.

```typescript
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = Parameters<typeof NextThemesProvider>[0];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Features**:

- Wraps the entire application
- Handles theme persistence
- Prevents flash of unstyled content
- Provides theme context

#### 2. ThemeToggle

Location: `components/theme-toggle.tsx`

An interactive dropdown component that allows users to switch themes.

```typescript
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Features**:

- Icon animation on theme change
- Dropdown menu with three options
- Accessible keyboard navigation
- Screen reader support

### Configuration

#### Root Layout

Location: `app/layout.tsx`

```typescript
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Configuration Options**:

- `attribute="class"`: Uses class-based theme switching (adds `.dark` class)
- `defaultTheme="system"`: Defaults to user's system preference
- `enableSystem`: Allows system preference detection
- `disableTransitionOnChange`: Prevents flash during theme change
- `suppressHydrationWarning`: Prevents hydration mismatch warnings

#### Global Styles

Location: `app/globals.css`

The theme system uses CSS variables for colors, which are automatically swapped based on the theme.

**Light Mode Variables**:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  /* ... more variables */
}
```

**Dark Mode Variables**:

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --secondary: oklch(0.269 0 0);
  /* ... more variables */
}
```

**Color System**:

- Uses OKLCH color space for better color consistency
- Automatic contrast adjustments
- Semantic color naming (primary, secondary, muted, etc.)
- All components inherit these colors

### Usage

#### In Components

##### Using Theme Context

```typescript
"use client";

import { useTheme } from "next-themes";

export function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
    </div>
  );
}
```

##### Using Tailwind Dark Mode Classes

```typescript
export function Card() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <h2>This card adapts to the theme</h2>
    </div>
  );
}
```

##### Using CSS Variables

```typescript
export function CustomComponent() {
  return (
    <div className="bg-background text-foreground border-border">
      <h2 className="text-primary">Title</h2>
      <p className="text-muted-foreground">Description</p>
    </div>
  );
}
```

#### Adding Theme Toggle to Pages

```typescript
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

## Theme Options

### 1. Light Mode

- Bright, clean appearance
- High contrast for readability
- Suitable for well-lit environments

### 2. Dark Mode

- Reduced eye strain in low-light
- OLED-friendly (pure blacks)
- Modern aesthetic

### 3. System Mode

- Follows OS preference
- Automatic switching based on time of day
- Respects user's system settings

## Customization

### Adding New Colors

1. **Define CSS Variables**:

```css
/* app/globals.css */
:root {
  --custom-color: oklch(0.6 0.2 200);
}

.dark {
  --custom-color: oklch(0.4 0.2 200);
}
```

2. **Add to Tailwind Theme**:

```css
@theme inline {
  --color-custom: var(--custom-color);
}
```

3. **Use in Components**:

```typescript
<div className="bg-custom text-custom">Custom themed content</div>
```

### Modifying Existing Colors

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --primary: oklch(0.5 0.2 250); /* Change primary color */
}
```

### Creating Custom Theme Toggle

```typescript
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button onClick={toggleTheme}>{theme === "dark" ? "☀️" : "🌙"}</Button>
  );
}
```

## Best Practices

### 1. Always Use Semantic Colors

✅ Good:

```typescript
<div className="bg-background text-foreground">
```

❌ Bad:

```typescript
<div className="bg-white text-black dark:bg-black dark:text-white">
```

### 2. Test Both Themes

- Always test your components in both light and dark mode
- Check color contrast for accessibility
- Ensure images/icons work in both themes

### 3. Use Theme-Aware Icons

```typescript
import { Sun, Moon } from 'lucide-react'

// Icons that adapt to theme
<Sun className="dark:hidden" />
<Moon className="hidden dark:block" />
```

### 4. Avoid Hard-Coded Colors

✅ Good:

```typescript
<div className="bg-card text-card-foreground">
```

❌ Bad:

```typescript
<div className="bg-white text-black">
```

## Accessibility

### Screen Readers

- Theme toggle has `aria-label` attribute
- Current theme is announced to screen readers
- Keyboard navigation fully supported

### Keyboard Navigation

- `Tab` to focus theme toggle
- `Enter` or `Space` to open dropdown
- Arrow keys to navigate options
- `Enter` to select theme

### Visual Indicators

- Clear icon changes (sun/moon)
- Smooth transitions
- High contrast in both themes

## Performance

### Zero Flash

- Theme is stored in localStorage
- Applied before page render
- No flash of unstyled content

### Bundle Size

- `next-themes`: ~2KB gzipped
- Minimal performance impact
- CSS variables are native

### Optimization

- Theme is applied via CSS class (fast)
- No JavaScript required for styling
- Leverages CSS cascade

## Browser Support

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support

## Troubleshooting

### Theme Not Persisting

- Check localStorage is enabled
- Verify ThemeProvider is wrapping app
- Ensure cookies are not blocked

### Flash on Page Load

- Add `suppressHydrationWarning` to `<html>` tag
- Verify theme script runs before render
- Check for conflicting CSS

### Colors Not Changing

- Verify CSS variables are defined
- Check Tailwind config includes dark mode
- Ensure `dark:` prefix is used correctly

## Future Enhancements

- [ ] Multiple color scheme presets
- [ ] Custom theme builder UI
- [ ] Per-page theme override
- [ ] Animated theme transitions
- [ ] Theme scheduling (auto-switch by time)

## Dependencies

- **next-themes**: 0.4.6
- **lucide-react**: For icons
- **Tailwind CSS**: For dark mode utilities

## References

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [OKLCH Colors](https://oklch.com)

---

**Status**: ✅ Complete  
**Last Updated**: October 31, 2025  
**Maintained By**: Frontend Team
