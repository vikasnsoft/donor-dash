# UI Component Catalogue

Reusable UI components available in Donor Dash. Use these before creating new ones.

---

## Layout Components

### DashboardLayout
- **File**: `frontend/src/layouts/dashboardLayout.tsx`
- **Purpose**: Main app layout with sidebar + header + content area
- **Usage**: Wraps all protected pages
- **Props**: Children (page content)

### DashboardHeader
- **File**: `frontend/src/layouts/dashboard-header.tsx`
- **Purpose**: Sticky header with sidebar trigger + user dropdown
- **Props**: None (uses AuthProvider)

### AppSidebar
- **File**: `frontend/src/components/sidebar/sidebarContent.tsx`
- **Purpose**: Collapsible sidebar navigation
- **Props**: None (self-contained with menu items)

---

## Form Components

### LoginForm
- **File**: `frontend/src/components/forms/login-form.tsx`
- **Purpose**: Email/password login with Zod validation
- **Uses**: React Hook Form, Zod, shadcn/ui Form/Input/Button

### RegisterForm
- **File**: `frontend/src/components/forms/register-form.tsx`
- **Purpose**: Registration with name, email, password, confirm
- **Uses**: React Hook Form, Zod, shadcn/ui Form/Input/Button

---

## Shared Components

### CurrencyPicker
- **File**: `frontend/src/components/shared/currency-picker.tsx`
- **Purpose**: Select currency from list (INR, USD, EUR, etc.)
- **Props**: `value`, `onValueChange`, `placeholder`, `disabled`
- **Uses**: shadcn/ui Select

### AmountInput
- **File**: `frontend/src/components/shared/amount-input.tsx`
- **Purpose**: Numeric input with currency symbol prefix
- **Props**: `value`, `onChange`, `currency`, `placeholder`, `disabled`
- **Uses**: shadcn/ui Input, currency constants

### RoleBasedComponent
- **File**: `frontend/src/components/role-based-component.tsx`
- **Purpose**: Conditionally render based on user role
- **Props**: `requiredRoles` (all must match) or `allowedRoles` (any match)
- **Usage**: `<RoleBasedComponent allowedRoles={['admin', 'supervisor']}>...</RoleBasedComponent>`

### AuthProtection
- **File**: `frontend/src/components/auth-protection.tsx`
- **Purpose**: Client-side auth guard, redirects to /login if unauthenticated
- **Usage**: Wraps protected layout

---

## Data Components

### UsersTable
- **File**: `frontend/src/components/tables/users-table.tsx`
- **Purpose**: Admin user management table with search, pagination, actions
- **Uses**: TanStack Table, shadcn/ui Table/Badge/Button

### TaskItem
- **File**: `frontend/src/components/dashboard/taskItem.tsx`
- **Purpose**: Expandable task with check/uncheck state
- **Props**: `title`, `description`, `completed`, `onToggle`
- **Note**: Built but not currently used on any page

---

## shadcn/ui Primitives (21 installed)

| Component | File | Common Use |
|-----------|------|------------|
| `alert` | `ui/alert.tsx` | Inline alerts |
| `avatar` | `ui/avatar.tsx` | User avatars |
| `badge` | `ui/badge.tsx` | Status badges, role labels |
| `breadcrumb` | `ui/breadcrumb.tsx` | Page breadcrumbs |
| `button` | `ui/button.tsx` | All buttons |
| `card` | `ui/card.tsx` | Content cards |
| `collapsible` | `ui/collapsible.tsx` | Sidebar sections |
| `dropdown-menu` | `ui/dropdown-menu.tsx` | User menu, actions menu |
| `form` | `ui/form.tsx` | Form wrapper with React Hook Form |
| `input` | `ui/input.tsx` | Text inputs |
| `label` | `ui/label.tsx` | Form labels |
| `progress` | `ui/progress.tsx` | Progress bars, budget tracking |
| `scroll-area` | `ui/scroll-area.tsx` | Scrollable areas |
| `select` | `ui/select.tsx` | Dropdowns |
| `separator` | `ui/separator.tsx` | Visual dividers |
| `sheet` | `ui/sheet.tsx` | Mobile sidebar, slide-over panels |
| `sidebar` | `ui/sidebar.tsx` | Full sidebar implementation (727 lines) |
| `skeleton` | `ui/skeleton.tsx` | Loading placeholders |
| `sonner` | `ui/sonner.tsx` | Toast notifications |
| `table` | `ui/table.tsx` | Data tables (use with TanStack Table) |
| `tooltip` | `ui/tooltip.tsx` | Hover tooltips |

---

## Creating New Components

### Pattern
```tsx
"use client";

import { Button } from "@/components/ui/button";
// ... other shadcn imports

interface MyComponentProps {
  // Props
}

export function MyComponent({ ...props }: MyComponentProps) {
  return (
    // Composition of shadcn/ui primitives
  );
}
```

### Rules
- Always compose from shadcn/ui primitives
- Always handle loading, error, and empty states
- Always support keyboard navigation
- Always work in dark mode
- Always be responsive
