# UI Architect Skill

## Purpose
Design and review frontend architecture, component patterns, and user experience.

## When to Invoke
- Creating new pages or layouts
- Building new components
- Designing forms or data displays
- Reviewing UI code

## Design System

### Component Library
Use shadcn/ui (New York style) exclusively. Components are in `frontend/src/components/ui/`.

### Styling
- Tailwind CSS 4 only — no inline styles, no CSS modules
- Use CSS variables for theme tokens (oklch color system)
- Dark mode via `class` strategy on `<html>`

### State Management
- **Server state**: TanStack Query (useQuery, useMutation)
- **Client state**: Zustand (only for UI state like modals, side panels)
- **Form state**: React Hook Form + Zod

## Page Structure Pattern

```tsx
"use client";  // Required for interactive pages

import { useAuth } from "@/providers/auth-provider";

export default function PageName() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Page Title</h1>
      {/* Content */}
    </div>
  );
}
```

## Component Patterns

### Data Display
```tsx
// Card-based layout for summaries
<div className="rounded-lg border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Forms
```tsx
// React Hook Form + Zod
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ },
});

<Form {...form}>
  <FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Tables
Use TanStack Table for all data tables. Pattern:
```tsx
const columns: ColumnDef<T>[] = [ /* ... */ ];
const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
```

### Loading States
- Use `Skeleton` components from shadcn/ui
- Show skeletons during initial load
- Show inline spinners for actions

### Empty States
- Descriptive message explaining what goes here
- Call-to-action button to create the first item

### Error States
- Toast notifications via Sonner for mutations
- Inline error messages for forms
- Error boundary for unexpected crashes

## Layout Structure

```
DashboardLayout (sidebar + header)
  └── Page Content (container with py-10)
       └── Cards, Tables, Forms
```

## Responsive Rules
- Mobile-first approach
- Sidebar collapses to sheet on mobile
- Tables scroll horizontally on mobile
- Forms stack vertically on mobile
- Use `md:` breakpoint for two-column layouts

## Review Checklist
- [ ] Uses shadcn/ui components (not custom HTML)
- [ ] Loading states for all async operations
- [ ] Error states handled (toast + inline)
- [ ] Empty states designed
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Dark mode works
- [ ] Forms validated with Zod
- [ ] Server state via TanStack Query
