# UI Components Guide

## Overview

This project uses [shadcn/ui](https://ui.shadcn.com), a collection of re-usable components built with Radix UI and Tailwind CSS. Components are copied into your project, giving you full control over the code.

## Installed Components

The following components are currently installed and ready to use:

### Navigation Components

#### Sidebar

**Location**: `components/ui/sidebar.tsx`

A collapsible navigation sidebar with icon mode support.

**Sub-components**:

- `Sidebar`: Root container with collapsible functionality
- `SidebarProvider`: Context provider for sidebar state
- `SidebarTrigger`: Button to toggle sidebar
- `SidebarContent`: Main content area
- `SidebarHeader`: Top section (optional)
- `SidebarFooter`: Bottom section (optional)
- `SidebarGroup`: Group of related items
- `SidebarGroupLabel`: Label for a group
- `SidebarGroupContent`: Content container for groups
- `SidebarMenu`: Menu container
- `SidebarMenuItem`: Individual menu item
- `SidebarMenuButton`: Button for menu items

**Usage**:

```typescript
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/home">Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
```

**Features**:

- Collapsible to icon-only mode
- Responsive behavior
- State management via context
- Smooth animations
- Keyboard accessible

---

### Form & Input Components

### 1. Button

**Location**: `components/ui/button.tsx`

A versatile button component with multiple variants and sizes.

**Variants**:

- `default`: Primary button style
- `secondary`: Secondary button style
- `outline`: Outlined button
- `ghost`: Transparent button
- `destructive`: For dangerous actions
- `link`: Styled as a link

**Sizes**:

- `sm`: Small
- `default`: Medium
- `lg`: Large
- `icon`: Square button for icons

**Usage**:

```typescript
import { Button } from '@/components/ui/button'

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline" size="sm">Small Outline</Button>
<Button variant="destructive">Delete</Button>
<Button size="icon">🔍</Button>
```

---

### 2. Input

**Location**: `components/ui/input.tsx`

A styled text input component.

**Usage**:

```typescript
import { Input } from '@/components/ui/input'

<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled" />
```

---

### 3. Card

**Location**: `components/ui/card.tsx`

A container component for grouping related content.

**Sub-components**:

- `Card`: Main container
- `CardHeader`: Top section
- `CardTitle`: Header title
- `CardDescription`: Header description
- `CardContent`: Main content area
- `CardFooter`: Bottom section

**Usage**:

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

---

### 4. Dialog

**Location**: `components/ui/dialog.tsx`

A modal dialog component for important interactions.

**Sub-components**:

- `Dialog`: Root component
- `DialogTrigger`: Opens the dialog
- `DialogContent`: Dialog content
- `DialogHeader`: Dialog header
- `DialogTitle`: Dialog title
- `DialogDescription`: Dialog description
- `DialogFooter`: Dialog footer

**Usage**:

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

---

### 5. Dropdown Menu

**Location**: `components/ui/dropdown-menu.tsx`

A dropdown menu component for actions and navigation.

**Sub-components**:

- `DropdownMenu`: Root
- `DropdownMenuTrigger`: Opens the menu
- `DropdownMenuContent`: Menu content
- `DropdownMenuItem`: Menu item
- `DropdownMenuSeparator`: Visual separator
- `DropdownMenuLabel`: Section label

**Usage**:

```typescript
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

---

### 6. Label

**Location**: `components/ui/label.tsx`

A styled label component for form inputs.

**Usage**:

```typescript
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>;
```

---

### 7. Select

**Location**: `components/ui/select.tsx`

A styled select/dropdown component.

**Sub-components**:

- `Select`: Root
- `SelectTrigger`: Opens the select
- `SelectContent`: Select options
- `SelectItem`: Individual option
- `SelectValue`: Displays selected value

**Usage**:

```typescript
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>;
```

---

### 8. Textarea

**Location**: `components/ui/textarea.tsx`

A multi-line text input component.

**Usage**:

```typescript
import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Enter your message..." rows={4} />;
```

---

### 9. Badge

**Location**: `components/ui/badge.tsx`

A small label component for status and categorization.

**Variants**:

- `default`: Primary style
- `secondary`: Secondary style
- `outline`: Outlined style
- `destructive`: For errors/warnings

**Usage**:

```typescript
import { Badge } from '@/components/ui/badge'

<Badge>New</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="outline">Optional</Badge>
<Badge variant="destructive">Error</Badge>
```

---

### 10. Switch

**Location**: `components/ui/switch.tsx`

A toggle switch component.

**Usage**:

```typescript
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<div className="flex items-center space-x-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>;
```

---

### 11. Tabs

**Location**: `components/ui/tabs.tsx`

A tabs component for organizing content.

**Sub-components**:

- `Tabs`: Root container
- `TabsList`: Container for tab triggers
- `TabsTrigger`: Individual tab button
- `TabsContent`: Content for each tab

**Usage**:

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Content for tab 1</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Content for tab 2</p>
  </TabsContent>
</Tabs>;
```

---

### 12. Avatar

**Location**: `components/ui/avatar.tsx`

A component for displaying user avatars.

**Sub-components**:

- `Avatar`: Root container
- `AvatarImage`: Avatar image
- `AvatarFallback`: Fallback content

**Usage**:

```typescript
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>;
```

---

### 13. Separator

**Location**: `components/ui/separator.tsx`

A visual divider component.

**Usage**:

```typescript
import { Separator } from "@/components/ui/separator";

<div>
  <p>Content above</p>
  <Separator className="my-4" />
  <p>Content below</p>
</div>;

{
  /* Vertical separator */
}
<div className="flex items-center">
  <span>Left</span>
  <Separator orientation="vertical" className="mx-2 h-4" />
  <span>Right</span>
</div>;
```

---

### 14. Sonner (Toast)

**Location**: `components/ui/sonner.tsx`

Toast notification component for user feedback.

**Setup** (in layout):

```typescript
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

**Usage**:

```typescript
"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

<Button onClick={() => toast.success("Success!")}>Show Toast</Button>;

// Different types
toast.success("Success message");
toast.error("Error message");
toast.info("Info message");
toast.warning("Warning message");
toast("Default message");

// With description
toast.success("User created", {
  description: "The user has been successfully created.",
});

// With action
toast("Event has been created", {
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

---

## Adding New Components

To add more shadcn/ui components:

```bash
# List available components
pnpm dlx shadcn@latest add

# Add specific component
pnpm dlx shadcn@latest add [component-name]

# Examples
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add popover
pnpm dlx shadcn@latest add table
```

## Customization

### Modifying Components

Since components are copied into your project, you can modify them:

1. **Find the component** in `components/ui/`
2. **Edit the component** as needed
3. **Changes apply globally** wherever the component is used

### Styling Components

Use Tailwind CSS classes:

```typescript
<Button className="w-full bg-blue-500 hover:bg-blue-600">
  Custom Styled Button
</Button>
```

### Creating Variants

Extend existing variants in the component file:

```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "...",
        // Add your custom variant
        custom: "bg-purple-500 hover:bg-purple-600"
      }
    }
  }
)

// Usage
<Button variant="custom">Custom Variant</Button>
```

## Best Practices

### 1. Always Import from @/components/ui

```typescript
✅ import { Button } from '@/components/ui/button'
❌ import { Button } from '../components/ui/button'
```

### 2. Use Semantic Component Names

```typescript
✅ <Button variant="destructive">Delete</Button>
❌ <Button className="bg-red-500">Delete</Button>
```

### 3. Compose Components

```typescript
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Title</CardTitle>
      <Badge>New</Badge>
    </div>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>
```

### 4. Maintain Accessibility

- Use proper `htmlFor` on labels
- Add `aria-label` to icon buttons
- Ensure keyboard navigation works
- Test with screen readers

## Accessibility Features

All components include:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Focus indicators
- ✅ Proper semantic HTML

## Dark Mode Support

All components automatically support dark mode through CSS variables. No additional configuration needed.

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs/components)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Additional Components

The following components were added with the sidebar installation:

### Sheet

**Location**: `components/ui/sheet.tsx`

A slide-out panel component (used internally by sidebar).

### Tooltip

**Location**: `components/ui/tooltip.tsx`

Displays additional information on hover or focus.

**Usage**:

```typescript
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Additional information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>;
```

### Skeleton

**Location**: `components/ui/skeleton.tsx`

Loading placeholder component.

**Usage**:

```typescript
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-12 w-12 rounded-full" />;
<Skeleton className="h-4 w-[250px]" />;
```

---

**Last Updated**: October 31, 2025  
**Total Components**: 18 (14 core + 4 supporting components)
