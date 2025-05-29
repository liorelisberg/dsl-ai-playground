# DSL AI Playground

A modern educational platform for learning JavaScript-like domain-specific language (DSL) with AI-powered assistance.

## 🏗️ Architecture

This is a full-stack application with:

- **Frontend**: React 18.3.1 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript + Google Gemini AI API
- **Package Manager**: pnpm (workspace configuration)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation & Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
pnpm install

# Start both frontend and backend simultaneously
pnpm run dev:full

# Or start them individually:
pnpm run dev:client  # Frontend only (Vite dev server)
pnpm run dev:server  # Backend only (Express server)
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:3000
```

The backend environment is configured in `apps/server/.env`:

```env
PORT=3000
FRONTEND_URL=http://localhost:8080
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📋 Available Scripts

### Development
- `pnpm run dev:full` - Start both frontend and backend with colored output
- `pnpm run dev:client` - Start frontend only (Vite dev server)
- `pnpm run dev:server` - Start backend only (Express server)

### Building
- `pnpm run build` - Build frontend for production
- `pnpm run build:server` - Build backend for production

### Other
- `pnpm run lint` - Lint frontend code
- `pnpm run lint:server` - Lint backend code
- `pnpm run preview` - Preview production build
- `pnpm run start:server` - Start production backend server

## 🤖 AI Integration

The application integrates with Google's Gemini AI API to provide intelligent assistance for learning DSL concepts. Features include:

- Real-time chat with AI assistant
- Context-aware responses based on chat history
- Automatic retry logic with exponential backoff
- Connection status monitoring
- Graceful error handling and fallback responses

## 🎯 Features

- **Split-panel Interface**: Chat assistant + code editor
- **AI-Powered Chat**: Real-time assistance with Gemini AI
- **Expression Evaluation**: Test DSL expressions with live feedback
- **Examples Library**: Curated examples for learning
- **File Upload**: Upload JSON files for testing (max 50KB)
- **Theme Support**: Light/dark/system theme modes
- **Connection Monitoring**: Real-time API health status
- **Session Management**: Persistent chat history during session

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js, TypeScript, Google Generative AI
- **Development**: pnpm workspaces, concurrently, nodemon, ts-node
- **Linting**: ESLint with TypeScript support

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/          # API services and HTTP client
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── config/            # Configuration files
├── apps/
│   └── server/            # Backend Express application
│       ├── src/           # Server source code
│       └── .env           # Server environment variables
└── packages/              # Shared packages (if any)
```

## 🔧 Development Notes

- The frontend runs on port 8080 (or next available: 8081, 8082)
- The backend runs on port 3000
- CORS is configured to accept requests from multiple frontend ports
- Session management uses HTTP-only cookies
- Rate limiting is implemented (6 requests per 30 seconds by default)

## 🚀 Deployment

The application can be deployed using the build scripts:

1. Build the frontend: `pnpm run build`
2. Build the backend: `pnpm run build:server`
3. Start the production server: `pnpm run start:server`

Make sure to configure the appropriate environment variables for your production environment.

---

## Original Lovable Project Info

**URL**: https://lovable.dev/projects/c43d2985-3a4b-4c93-8376-a33f7380b5c9

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c43d2985-3a4b-4c93-8376-a33f7380b5c9) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
