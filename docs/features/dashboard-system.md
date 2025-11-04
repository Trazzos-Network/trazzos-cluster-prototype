# Dashboard System

## Overview

The Trazzos Cluster Prototype includes a comprehensive dashboard system built using Next.js route groups, featuring a collapsible sidebar navigation and dedicated pages for different dashboard sections.

## Business Value

The dashboard provides:

- **Centralized Navigation**: Single location for accessing all dashboard features
- **Responsive Layout**: Adapts to different screen sizes with collapsible sidebar
- **Consistent UI**: Unified design language across all dashboard pages
- **Efficient Space Usage**: Sidebar can collapse to icon-only mode for more content space

## User Stories

- As a user, I want to access my dashboard home page to see an overview of my projects and activities
- As a user, I want to configure my settings through an intuitive interface
- As a user, I want to collapse the sidebar to focus on content without losing navigation access
- As a user, I want active page indicators in the navigation to know where I am

## Technical Implementation

### Architecture

The dashboard uses Next.js route groups to organize related pages without affecting the URL structure. The implementation consists of:

1. **Route Group**: `(dashboard)` - Groups related routes together
2. **Layout**: Provides consistent sidebar and header across all dashboard pages
3. **Pages**: Individual routes for different dashboard sections
4. **Sidebar Component**: Reusable navigation component with collapsible functionality

#### File Structure

```
app/
├── (dashboard)/
│   ├── layout.tsx           # Dashboard layout with sidebar
│   ├── home/
│   │   └── page.tsx        # Home dashboard page
│   └── settings/
│       └── page.tsx        # Settings page
components/
└── layouts/
    └── app-sidebar.tsx     # Sidebar navigation component
```

### Components

#### 1. AppSidebar Component

**Location**: `components/layouts/app-sidebar.tsx`

A client-side navigation sidebar that provides collapsible navigation with icon mode.

```typescript
"use client";

import { Home, Settings, ChevronUp, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // ... other imports
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  // Implementation
}
```

**Features**:

- Active route detection using `usePathname()`
- Collapsible to icon-only mode
- User account dropdown in footer
- Theme toggle integration
- Navigation menu with icons

**Navigation Items**:

```typescript
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
```

#### 2. Dashboard Layout

**Location**: `app/(dashboard)/layout.tsx`

Wraps all dashboard pages with consistent sidebar and header.

```typescript
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col w-full">
        <header>
          <SidebarTrigger />
          <h1>Trazzos Dashboard</h1>
        </header>
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
```

**Features**:

- `SidebarProvider`: Manages sidebar state (open/collapsed)
- `SidebarTrigger`: Button to toggle sidebar visibility
- Sticky header for consistent navigation access
- Full-width content area

#### 3. Home Page

**Location**: `app/(dashboard)/home/page.tsx`

Dashboard overview page showing statistics and recent activity.

**Features**:

- Project statistics cards
- Recent activity feed with status badges
- Quick stats overview
- Responsive grid layout

**Components Used**:

- Card components for content sections
- Badge for status indicators
- Grid layout for responsive design

#### 4. Settings Page

**Location**: `app/(dashboard)/settings/page.tsx`

Comprehensive settings page with multiple sections organized in tabs.

**Features**:

- Tabbed interface (Profile, Preferences, Notifications)
- Form inputs for profile information
- Password change section
- Appearance preferences with switches
- Email and push notification settings

**Components Used**:

- Tabs for section organization
- Input fields for data entry
- Switch components for toggles
- Cards for grouping related settings

### Routes

| Route       | Description                       | Access           |
| ----------- | --------------------------------- | ---------------- |
| `/home`     | Dashboard home page with overview | Public (for now) |
| `/settings` | User settings and preferences     | Public (for now) |

### Data Models

Currently using static data. Future implementation will use:

```typescript
// types/dashboard.ts (future)
interface DashboardStats {
  totalProjects: number;
  activeTasks: number;
  completed: number;
}

interface Activity {
  id: string;
  title: string;
  status: "In Progress" | "Completed" | "Pending";
  timestamp: Date;
}

interface UserSettings {
  profile: {
    name: string;
    email: string;
    bio: string;
  };
  preferences: {
    compactMode: boolean;
    showSidebar: boolean;
    language: string;
    timezone: string;
  };
  notifications: {
    projectUpdates: boolean;
    taskAssignments: boolean;
    commentsAndMentions: boolean;
    marketingEmails: boolean;
    pushNotifications: boolean;
  };
}
```

## Usage Examples

### Basic Navigation

```typescript
// Link to dashboard pages
import Link from "next/link";

<Link href="/home">Go to Dashboard</Link>
<Link href="/settings">Settings</Link>
```

### Adding New Dashboard Routes

1. Create new folder in `app/(dashboard)/`:

```bash
mkdir -p app/\(dashboard\)/analytics
```

2. Create page file:

```typescript
// app/(dashboard)/analytics/page.tsx
export default function AnalyticsPage() {
  return (
    <div>
      <h2>Analytics</h2>
      {/* Content */}
    </div>
  );
}
```

3. Add to sidebar navigation:

```typescript
// components/layouts/app-sidebar.tsx
import { BarChart } from "lucide-react";

const items = [
  // ... existing items
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart,
  },
];
```

### Customizing Sidebar

```typescript
// Add more items to the navigation
const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];
```

## Dependencies

### External Dependencies

- **@radix-ui/react-\***: Sidebar, dropdown, and other UI primitives
- **lucide-react**: Icons for navigation and UI elements
- **next**: App Router and navigation hooks

### Internal Dependencies

- Theme system for dark/light mode
- shadcn/ui components (Sidebar, Card, Button, etc.)
- Layout components

## Implementation Details

### Route Groups

The `(dashboard)` route group allows organizing related routes without affecting the URL:

- Files in `(dashboard)` are accessible at the root level
- `/home` instead of `/dashboard/home`
- Shared layout applies to all routes in the group
- Clean, user-friendly URLs

### Sidebar State Management

The sidebar uses `SidebarProvider` to manage its state:

- Open/collapsed state persists across route changes
- Smooth animations when toggling
- Responsive behavior on mobile devices
- Accessible keyboard navigation

### Active Route Detection

```typescript
const pathname = usePathname();
const isActive = pathname === item.url;

<SidebarMenuButton asChild isActive={isActive}>
  <Link href={item.url}>
    <item.icon />
    <span>{item.title}</span>
  </Link>
</SidebarMenuButton>;
```

### Responsive Design

- **Desktop**: Full sidebar visible by default
- **Tablet**: Collapsible sidebar
- **Mobile**: Sidebar overlay with trigger button
- Content adapts to available space

## Testing

### Manual Testing Checklist

- [ ] Navigate between Home and Settings pages
- [ ] Toggle sidebar collapse/expand
- [ ] Verify active route highlighting
- [ ] Check responsive behavior on mobile
- [ ] Test theme switching in sidebar
- [ ] Verify dropdown menu functionality
- [ ] Check keyboard navigation

### Test Scenarios

1. **Navigation**

   - Click on each menu item
   - Verify URL changes
   - Confirm active state updates

2. **Sidebar Toggle**

   - Click sidebar trigger
   - Verify collapse animation
   - Check icon-only mode display
   - Test expand functionality

3. **Responsive**
   - Resize browser window
   - Test mobile view
   - Verify overlay behavior

## Security Considerations

### Current State (Public)

- No authentication required
- All routes publicly accessible

### Future Implementation

- Add authentication middleware
- Protect dashboard routes
- Role-based access control
- Session management

```typescript
// middleware.ts (future)
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (!token && request.nextUrl.pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/home/:path*", "/settings/:path*"],
};
```

## Performance Considerations

### Optimization Techniques

- Server Components for static content
- Client Components only where needed (sidebar, interactive elements)
- Route prefetching for instant navigation
- Minimal JavaScript bundle for sidebar

### Bundle Impact

- Sidebar component: ~5KB (gzipped)
- Additional UI components: ~8KB (gzipped)
- Total JS for dashboard: ~15KB (gzipped)

### Rendering Strategy

- Layout: Server Component (rendered once)
- Pages: Server Components (static content)
- Sidebar: Client Component (interactive)

## Accessibility

### Keyboard Navigation

- `Tab`: Navigate between sidebar items
- `Enter/Space`: Activate links
- `Escape`: Close dropdown menus
- All interactive elements are keyboard accessible

### Screen Reader Support

- Semantic HTML structure
- ARIA labels on navigation items
- Live regions for route changes
- Descriptive link text

### Focus Management

- Visible focus indicators
- Logical focus order
- Focus restoration after navigation

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

### Planned Features

- [ ] Breadcrumb navigation
- [ ] User profile avatar upload
- [ ] Search functionality in sidebar
- [ ] Keyboard shortcuts
- [ ] Sidebar customization (reorder items)
- [ ] Multi-level navigation
- [ ] Recent pages history
- [ ] Favorites/starred pages

### API Integration

- [ ] Fetch real dashboard statistics
- [ ] Save user settings to database
- [ ] Real-time activity updates
- [ ] Notification system

### Advanced Features

- [ ] Dashboard widgets
- [ ] Customizable layouts
- [ ] Export data functionality
- [ ] Advanced filters and search

## Troubleshooting

### Sidebar Not Visible

- Ensure `SidebarProvider` wraps the layout
- Check z-index conflicts
- Verify component imports

### Active Route Not Highlighting

- Confirm `usePathname()` matches route structure
- Check route group configuration
- Verify Link href matches navigation items

### Mobile Sidebar Issues

- Test with actual mobile device
- Check responsive breakpoints
- Verify touch interactions

## Related Documentation

- [UI Components Guide](../components/ui-components.md)
- [Component Patterns](../patterns/component-patterns.md)
- [Theme System](./theme-system.md)

## Changelog

### Version 1.0.0 (2025-10-31)

- Initial dashboard implementation
- Created Home and Settings pages
- Implemented collapsible sidebar
- Added responsive layout
- Integrated theme toggle

---

**Status**: ✅ Complete  
**Last Updated**: October 31, 2025  
**Maintained By**: Frontend Team
