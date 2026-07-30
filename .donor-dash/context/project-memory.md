# Project Memory

Engineering decisions, technology choices, and lessons learned. AI should consult this before suggesting alternatives.

---

## Technology Choices

### Why MongoDB
- Flexible schema for rapid iteration during v1 development
- Document-shaped data (events, donors, expenses are natural documents)
- Mongoose provides schema enforcement when needed
- Transactions available for financial integrity (replica set required)
- **Trade-off**: No built-in referential integrity, must enforce in application code
- **Future**: If reporting complexity hurts, consider PostgreSQL for ledger/reporting read replica

### Why Express 5
- Minimal, unopinionated framework
- Full control over middleware pipeline
- Large ecosystem of middleware
- Easy to modularize
- **Trade-off**: No built-in DI, validation, or OpenAPI generation
- **Future**: Consider Fastify if performance becomes critical

### Why Next.js 15
- App Router with React Server Components
- Built-in routing, middleware, and optimization
- Turbopack for fast dev builds
- Easy deployment to Vercel
- **Trade-off**: Complexity of RSC vs traditional React

### Why shadcn/ui
- Copy-paste components (no dependency lock-in)
- Built on Radix UI (accessible by default)
- Full control over styling with Tailwind
- Consistent design system
- **Trade-off**: Must manually update components

### Why TanStack Query
- Server state management (caching, refetching, stale-while-revalidate)
- Reduces boilerplate for API calls
- Optimistic updates support
- **Trade-off**: Learning curve for cache invalidation patterns

### Why BullMQ (Planned)
- Redis-based job queue
- Reliable, persistent job processing
- Delayed jobs, repeatable jobs, job priorities
- **Trade-off**: Requires Redis infrastructure

### Why Supabase Storage
- Already initialized in codebase
- Free tier: 1GB storage
- Built-in CDN and image transforms
- S3-compatible API (easy migration path)
- **Trade-off**: External dependency, free tier limits

### Why Sentry (Planned)
- Industry-standard error tracking
- Node.js and browser SDK
- Performance tracing
- Source map support
- **Trade-off**: Cost at scale

## Known Limitations

### MongoDB Transactions
- Require replica set (more complex local development)
- 60-second timeout on transactions
- Not suitable for very high-write workloads on single documents

### Single Database
- All modules share one MongoDB instance
- No module-level data isolation
- Must enforce boundaries through application code

### No Real-Time
- No WebSocket support yet (future consideration)
- Activity feed is pull-based (polling)
- Notifications are not instant

### No Mobile App Yet
- Web-only in v2.0-2.6
- React Native/Expo planned for Phase 3.0
- Must design APIs to support mobile consumption

## Future Migration Plans

### If Reporting Gets Complex
→ Add PostgreSQL as read replica for ledger/reporting
→ Write to MongoDB, sync to PostgreSQL for analytics

### If We Need Real-Time
→ Add Socket.io or Server-Sent Events
→ Activity feed becomes push-based

### If We Need Microservices
→ Modular monolith design allows extraction
→ Domain events already decouple modules
→ Each module has clear API boundaries

### If We Scale Beyond MongoDB
→ Shard by Organisation/Event
→ Archive old events to cold storage
→ Use read replicas for reports
