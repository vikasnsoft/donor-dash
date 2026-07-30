# Accessibility Reviewer Skill

## Purpose
Ensure the frontend is accessible to all users, including those using assistive technologies.

## When to Invoke
- New UI components
- Form changes
- Navigation changes
- Color or layout changes

## WCAG 2.1 AA Checklist

### Keyboard Navigation
- [ ] All interactive elements focusable via Tab
- [ ] Focus order follows visual order
- [ ] Focus indicator visible (not `outline: none`)
- [ ] Escape closes modals/dialogs
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate within components (select, menu)

### Semantic HTML
- [ ] Headings in order (h1 → h2 → h3, no skipping)
- [ ] Buttons use `<button>`, links use `<a>`
- [ ] Forms use `<form>`, `<fieldset>`, `<legend>`
- [ ] Tables use `<thead>`, `<tbody>`, `<th scope>`
- [ ] Lists use `<ul>`, `<ol>`, `<dl>`

### ARIA
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-describedby` for form error messages
- [ ] `aria-live` for dynamic content updates (toasts, activity feed)
- [ ] `aria-expanded` on collapsible/accordion triggers
- [ ] `aria-current` for current navigation item
- [ ] `role="alert"` for error messages

### Color & Contrast
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text, 18px+)
- [ ] Interactive element contrast ≥ 3:1
- [ ] Color is not the only way to convey information
- [ ] Error states use more than just red (icon + text)

### Forms
- [ ] Every input has a visible label
- [ ] Error messages are associated with inputs
- [ ] Required fields marked with `aria-required`
- [ ] Invalid fields marked with `aria-invalid`
- [ ] Autocomplete attributes on common fields

### Images & Media
- [ ] Meaningful images have `alt` text
- [ ] Decorative images have `alt=""`
- [ ] Icons have accessible labels

### Motion
- [ ] `prefers-reduced-motion` respected
- [ ] No flashing content (> 3 flashes/second)
- [ ] Animations can be disabled

## shadcn/ui Accessibility

shadcn/ui components are accessible by default. Don't break this:
- Don't remove `aria-*` attributes
- Don't override focus styles without alternatives
- Don't use `div` as button (use `Button` component)
- Don't disable keyboard navigation

## Common Patterns

### Toast Notifications
```tsx
// Sonner handles aria-live automatically
import { toast } from "sonner";
toast.success("Donation recorded");
```

### Form Errors
```tsx
<FormMessage />  // shadcn/ui handles aria-describedby
```

### Dialogs
```tsx
// shadcn/ui Dialog handles focus trap and Escape
<DialogContent>
  <DialogHeader>
    <DialogTitle>Confirm Action</DialogTitle>
    <DialogDescription>Are you sure?</DialogDescription>
  </DialogHeader>
</DialogContent>
```
