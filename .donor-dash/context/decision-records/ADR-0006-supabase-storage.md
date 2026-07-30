# ADR-0006: Supabase Storage for Files

## Status
Accepted

## Context
Donor Dash needs to store files: receipt images, event banners, donor documents, exported reports.

## Decision
Use **Supabase Storage** for all file storage.

Structure:
```
receipts/        — Expense and donation receipts
avatars/         — User and group avatars
events/          — Event banners and images
documents/       — Donor documents, agreements
exports/         — CSV/PDF exports
reports/         — Generated reports
temp/            — Temporary uploads (auto-cleanup)
ocr/             — OCR input images
```

## Consequences
**Positive:**
- Free tier: 1GB storage, 2GB bandwidth
- Built-in CDN for fast delivery
- Image transformations (resize, crop)
- Already initialized in the codebase
- S3-compatible API (easy to migrate later)

**Negative:**
- External dependency (Supabase)
- Free tier limits may be hit with heavy usage
- Adds Supabase to the infrastructure stack

## Alternatives Considered
- **Local filesystem**: Simple but not scalable, no CDN
- **AWS S3**: Industry standard but more setup and cost
- **MongoDB GridFS**: Native but poor performance for images
