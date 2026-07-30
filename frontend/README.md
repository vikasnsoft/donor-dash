# Erlin AI

Erlin AI is a modern content marketing platform built with Next.js, designed to streamline your content creation, management, and optimization workflow.

## Features

- **Dashboard**: Comprehensive overview of your content marketing activities
- **Content Management**: Create, edit, and manage your content in one place
- **SEO Tools**: Optimize your content for search engines
- **A/B Testing**: Test different content variations to maximize engagement
- **Analytics**: Track performance and gather insights

## Tech Stack

- **Frontend**: Next.js 15 with React 18, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Backend/Database**: Supabase
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/erlin.git
   cd erlin
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials and other required variables.

### Development

Start the development server with Turbopack:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run dev:inspect` - Start the development server with Node inspector
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint with auto-fixes for issues including unused imports/variables
- `npm run format` - Check code formatting with Prettier
- `npm run format:fix` - Fix code formatting issues
- `npm run commit` - Use Commitizen for conventional commits

## Project Structure

```
/src
  /app            # Next.js app directory with route structure
  /components     # UI components structured by feature
  /lib            # Utility functions and shared code
  /hooks          # Custom React hooks
  /types          # TypeScript type definitions
  /styles         # Global styles
```

## Linting and Code Quality

This project uses ESLint and Prettier for code quality and formatting. The configuration automatically removes unused imports and variables on save or when running the lint command.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`npm run commit`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

This project can be deployed on platforms like Vercel or Netlify with minimal configuration.

```bash
npm run build
npm run start
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
