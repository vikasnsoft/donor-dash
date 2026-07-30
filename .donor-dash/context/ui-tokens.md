# UI Tokens

## Colors (CSS Variables — oklch)

### Light Theme
```css
--background: oklch(1 0 0);           /* White */
--foreground: oklch(0.145 0 0);       /* Near black */
--card: oklch(1 0 0);
--card-foreground: oklch(0.145 0 0);
--primary: oklch(0.205 0 0);          /* Dark */
--primary-foreground: oklch(0.985 0 0);
--secondary: oklch(0.97 0 0);         /* Light gray */
--secondary-foreground: oklch(0.205 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);
--accent: oklch(0.97 0 0);
--accent-foreground: oklch(0.205 0 0);
--destructive: oklch(0.577 0.245 27.325);  /* Red */
--border: oklch(0.922 0 0);
--input: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);
```

### Dark Theme
```css
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
--card: oklch(0.145 0 0);
--card-foreground: oklch(0.985 0 0);
--primary: oklch(0.985 0 0);
--primary-foreground: oklch(0.205 0 0);
--secondary: oklch(0.269 0 0);
--secondary-foreground: oklch(0.985 0 0);
--muted: oklch(0.269 0 0);
--muted-foreground: oklch(0.708 0 0);
--accent: oklch(0.269 0 0);
--accent-foreground: oklch(0.985 0 0);
--destructive: oklch(0.396 0.141 25.723);
--border: oklch(0.269 0 0);
--input: oklch(0.269 0 0);
--ring: oklch(0.439 0 0);
```

### Chart Colors
```css
--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);
```

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 0.25rem | Tight spacing (icon gaps) |
| `2` | 0.5rem | Compact spacing |
| `3` | 0.75rem | Default gap |
| `4` | 1rem | Standard spacing |
| `6` | 1.5rem | Section spacing |
| `8` | 2rem | Large section spacing |
| `10` | 2.5rem | Page padding |
| `12` | 3rem | Major sections |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 0.25rem | Small elements (badges) |
| `md` | 0.375rem | Default (inputs, buttons) |
| `lg` | 0.5rem | Cards |
| `xl` | 0.75rem | Large cards |
| `full` | 9999px | Avatars, pills |

## Typography

| Element | Size | Weight | Class |
|---------|------|--------|-------|
| Page title | 1.875rem | 700 | `text-3xl font-bold` |
| Section title | 1.25rem | 600 | `text-xl font-semibold` |
| Card title | 1.125rem | 600 | `text-lg font-semibold` |
| Body | 1rem | 400 | default |
| Small | 0.875rem | 400 | `text-sm` |
| Tiny | 0.75rem | 400 | `text-xs` |
| Label | 0.875rem | 500 | `text-sm font-medium` |

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-sm` | Cards, subtle elevation |
| `shadow` | Dropdowns, popovers |
| `shadow-md` | Modals, dialogs |
| `shadow-lg` | Sheets, sidebars |

## Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktops |
| `xl` | 1280px | Large desktops |

## Z-Index

| Layer | z-index | Usage |
|-------|---------|-------|
| Base | 0 | Default content |
| Dropdown | 50 | Dropdowns, popovers |
| Sticky | 51 | Sticky headers |
| Modal backdrop | 52 | Dialog/Sheet overlays |
| Modal | 53 | Dialogs, sheets |
| Toast | 54 | Notifications |
| Tooltip | 55 | Tooltips |
