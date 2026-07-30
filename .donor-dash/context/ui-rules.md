# UI Rules

## Component Library
Use **shadcn/ui** (New York style) exclusively. Components are in `frontend/src/components/ui/`.

**Never** create custom primitives when shadcn/ui has one. Only create custom components by composing shadcn/ui primitives.

## Styling
- **Tailwind CSS 4 only** — no inline styles, no CSS modules, no styled-components
- Use CSS variables for theme tokens (colors, spacing, radius)
- Dark mode via `class` strategy on `<html>`

## Layout Pattern

### Dashboard Pages
```tsx
<div className="container mx-auto py-10">
  <div className="mb-6 flex items-center justify-between">
    <h1 className="text-3xl font-bold">Page Title</h1>
    <Button>Action</Button>
  </div>
  {/* Content */}
</div>
```

### Cards
```tsx
<div className="rounded-lg border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Summary Cards (Grid)
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
      <CreditCard className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">₹50,000</div>
      <p className="text-xs text-muted-foreground">+20% from last month</p>
    </CardContent>
  </Card>
</div>
```

## Forms

### Pattern
```tsx
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
        <FormDescription>Help text</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
  <Button type="submit">Submit</Button>
</Form>
```

### Validation
- Zod schemas in `lib/validations/`
- `@hookform/resolvers/zod` for integration
- Show errors inline via `<FormMessage />`

## Tables
Use TanStack Table for all data tables:
```tsx
const columns: ColumnDef<T>[] = [/* ... */];
const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
```

## States

### Loading
- **Initial load**: Show `<Skeleton>` components matching the layout
- **Action in progress**: Show spinner in button, disable interaction
- **Refetching**: Show subtle loading indicator (not full skeleton)

### Empty
- Descriptive message explaining what belongs here
- Call-to-action button to create the first item
- Illustration or icon (optional)

### Error
- Toast notification for mutations (`toast.error()`)
- Inline error message for forms (`<FormMessage />`)
- Error boundary for unexpected crashes

## Responsive

### Breakpoints
- Mobile: default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

### Rules
- Sidebar collapses to `<Sheet>` on mobile
- Tables scroll horizontally on mobile (`overflow-x-auto`)
- Forms stack vertically on mobile
- Two-column layouts use `md:grid-cols-2`
- Cards stack on mobile, grid on desktop

## Spacing
- Page padding: `py-10`
- Section gap: `gap-6` or `gap-8`
- Card padding: `p-6`
- Between heading and content: `mb-6`
- Between form fields: `space-y-4`

## Typography
- Page title: `text-3xl font-bold`
- Section title: `text-xl font-semibold`
- Card title: `text-lg font-semibold`
- Body: default (1rem)
- Small/helper: `text-sm text-muted-foreground`
- Tiny: `text-xs text-muted-foreground`

## Icons
Use **Lucide React** for all icons:
```tsx
import { CreditCard, Users, Calendar } from 'lucide-react';
```

Icon sizes: `h-4 w-4` (inline), `h-5 w-5` (buttons), `h-6 w-6` (cards)
