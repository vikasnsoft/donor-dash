# Contributing to Donor Dash

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch from `main`
4. Make your changes
5. Run tests and linting
6. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install
npm install --prefix frontend

# Copy environment file
cp backend/.env.example backend/.env

# Start development
npm run dev
```

## Branch Naming

- `feat/` — New features
- `fix/` — Bug fixes
- `chore/` — Maintenance tasks
- `docs/` — Documentation
- `refactor/` — Code refactoring

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add donor search functionality
fix: correct balance calculation in settlements
chore: update dependencies
docs: add API documentation for ledger endpoints
```

## Code Standards

### Backend
- Use ES Modules (`import`/`export`)
- Follow the module structure: `model.js`, `service.js`, `controller.js`, `routes.js`, `validator.js`
- Use Zod for validation
- Use Pino for logging (not console.log)
- Use transactions for multi-collection writes

### Frontend
- Use TypeScript
- Use shadcn/ui components
- Use TanStack Query for server state
- Use React Hook Form + Zod for forms
- Follow the dashboard primitive pattern for new widgets

## Pull Request Checklist

- [ ] Code follows project conventions
- [ ] No TypeScript or lint errors
- [ ] Tests added for new functionality
- [ ] Financial logic has 100% test coverage
- [ ] Documentation updated
- [ ] No secrets in code

## Architecture

See `.donor-dash/` for the AI Development Kit containing:
- Architecture documentation
- Module contracts
- Coding standards
- Financial invariants
