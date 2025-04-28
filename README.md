# Katalon Support Bot - Frontend

This is the frontend application for the Katalon Support Bot, built with Next.js and Tailwind CSS.

## Project Structure

```
src/
├── app/                 # Next.js app router
│   └── page.tsx         # Main chat interface page
├── components/          # Reusable UI components
│   ├── chat-input.tsx   # Chat input component
│   ├── chat-message.tsx # Message display component
│   ├── header.tsx       # Header component
│   ├── mode-selector.tsx # Mode selection component
│   ├── model-selector.tsx # Model selection component
│   ├── suggestion-card.tsx # Suggestion card component
│   └── theme-toggle.tsx # Dark/light mode toggle
├── lib/                 # Utility functions and API clients
│   ├── api.ts           # API client for backend communication
│   └── utils.ts         # Utility functions
└── providers/           # App providers for state management
```

## Features

- Modern, responsive chat interface
- Dark/light mode support
- Two chat modes:
  - MCP mode: Enhanced Katalon-specific responses
  - Gemini mode: Direct AI interaction
- Support for different AI models
- Markdown rendering for formatted responses
- Long-context conversations with history management

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend server running

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
   ```

### Running the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_BACKEND_URL | URL of the backend API | http://localhost:3000 |

## Development

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Design Decisions

- **Tailwind CSS**: Used for styling with a utility-first approach
- **Next.js App Router**: Modern routing with server components
- **HeadlessUI**: Accessible UI components (dropdowns, modals)
- **Lucide Icons**: Consistent icon system
- **Markdown Rendering**: Support for rich text responses
- **Mobile-first Design**: Responsive across all device sizes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
