# Donor Dash

Community Finance Platform for events, donations, collections, and shared expenses.

Built for organisations like Ganpati Utsav Mandals, Shiv Jayanti committees, NGOs, trusts, and event-based groups.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│          Frontend (Next.js 16 + React 19)           │
│  Dashboards • Charts • Search • Formatting          │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│         Projection / Read Model Layer               │
│  Dashboard APIs • Search • Analytics                │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│          Event Processing Layer                     │
│  Domain Events • BullMQ • Projectors                │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│            Business Domains (20 modules)            │
│  Organisations • Events • Donations • Campaigns     │
│  Groups • Expenses • Settlements                    │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│            Accounting Engine                        │
│  Accounting Facade • Journal Builder • Ledger       │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│          Infrastructure                             │
│  MongoDB • Redis • BullMQ • Docker                  │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express 5, MongoDB, Mongoose, Node.js 22 |
| Frontend | Next.js 16, React 19, TypeScript 5.9 |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI |
| State | TanStack Query 5, Zustand |
| Charts | Recharts |
| Logging | Pino |
| Error Tracking | Sentry |
| Background Jobs | BullMQ + Redis |
| Storage | Supabase Storage |
| CI/CD | GitHub Actions |

## Quick Start

### Prerequisites
- Node.js 22+
- MongoDB 7+
- Redis (optional, for background jobs)

### Installation

```bash
# Clone the repository
git clone git@github.com:vikasnsoft/donor-dash.git
cd donor-dash

# Install dependencies
npm install
npm install --prefix frontend

# Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Start development servers
npm run dev
```

The backend runs on `http://localhost:5001` and the frontend on `http://localhost:3000`.

### Using Docker

```bash
# Start MongoDB, Redis, and Mailpit
docker-compose up -d

# Start the application
npm run dev
```

### Seed Sample Data

```bash
npm run data:import
```

This creates 6 sample users with different roles (password: `123456`).

## Project Structure

```
donor-dash/
├── backend/
│   ├── src/
│   │   ├── modules/          # 20 domain modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── organisations/
│   │   │   ├── events/
│   │   │   ├── campaigns/
│   │   │   ├── donors/
│   │   │   ├── donations/
│   │   │   ├── groups/
│   │   │   ├── expenses/
│   │   │   ├── settlements/
│   │   │   ├── ledger/       # Accounting engine
│   │   │   ├── projections/  # Read models
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   ├── search/
│   │   │   └── shared/       # Event bus, permissions, jobs
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   └── server.js
├── frontend/
│   └── src/
│       ├── app/              # Next.js App Router pages
│       ├── components/
│       │   ├── dashboard/    # Dashboard primitives & charts
│       │   ├── ui/           # shadcn/ui components
│       │   └── shared/       # Shared components
│       ├── hooks/            # TanStack Query hooks
│       └── lib/              # Utilities, formatting, validation
├── .donor-dash/              # AI Development Kit (DDK)
│   ├── AGENTS.md
│   ├── skills/               # 17 AI skills
│   ├── context/              # Architecture docs
│   ├── contracts/            # Module contracts
│   └── prompts/              # Reusable prompts
└── docs/                     # Deployment documentation
```

## Key Features

### Operational
- Organisation management with member roles
- Event and campaign management
- Donor management with family grouping
- Donation recording with receipt generation
- Volunteer collection tracking

### Financial
- Double-entry accounting engine
- Chart of accounts (19 default accounts)
- Ledger with journal entries
- Trial balance, cash book, income statement
- 16 financial invariants enforced

### Shared Expenses
- Expense groups with flexible splits (equal, exact, percentage, shares)
- Balance calculation and debt simplification
- Settlement workflow with confirmation

### Automation
- Notifications (in-app, email stubs)
- Document generation (HTML receipts, vouchers)
- CSV import/export
- Projection engine (6 read models)
- BullMQ background jobs

### Dashboards
- Organisation admin dashboard
- Treasurer dashboard
- Campaign progress charts
- Volunteer performance tracking
- Unified search (Cmd+K)

## API Documentation

Swagger UI available at `http://localhost:5001/api-docs`

### Key Endpoints

```
# Auth
POST   /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/auth/me

# Organisations
GET    /api/v1/organisations
POST   /api/v1/organisations

# Events
GET    /api/v1/organisations/:orgId/events
POST   /api/v1/events

# Donations
POST   /api/v1/events/:eventId/donations
GET    /api/v1/events/:eventId/donations/stats

# Ledger
GET    /api/v1/organisations/:orgId/ledger/trial-balance
GET    /api/v1/organisations/:orgId/ledger/cash-book

# Search
GET    /api/v1/search?q=query

# Health
GET    /health
GET    /ready
GET    /live
```

## Development

```bash
# Run backend only
npm run server

# Run frontend only
npm run client

# Type check
npm run check --prefix frontend

# Build for production
npm run build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Security

See [SECURITY.md](SECURITY.md)

## License

MIT — See [LICENSE](LICENSE)
