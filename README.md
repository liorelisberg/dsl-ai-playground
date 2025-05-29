# DSL AI Playground

A modern educational platform for learning JavaScript-like domain-specific language (DSL) with AI-powered assistance and enterprise-grade expression evaluation.

## 🏗️ Architecture

This is a full-stack application with:

- **Frontend**: React 18.3.1 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript + Google Gemini AI API + Zen Engine
- **DSL Engine**: GoRules Zen Engine (Rust-powered, production-grade)
- **Package Manager**: pnpm (workspace configuration)

## ⚡ Advanced DSL Capabilities

Powered by **GoRules Zen Engine** - a production-grade expression evaluator with:

### Mathematical Operations
```javascript
price * quantity                    // → 31.5
total / count
amount + tax
price * (1 + taxRate)
age >= 18                          // → true/false
score > threshold
```

### Array Operations & Indexing
```javascript
users[0].name                      // → "John"
users[0].email
items[1].price
products.length
```

### String Operations
```javascript
user.name.toUpperCase()            // → "JOHN DOE"
user.email.toLowerCase()           // → "john@example.com"
firstName + " " + lastName         // → "John Doe"
```

### Conditional Expressions
```javascript
age >= 18 ? "Adult" : "Minor"     // Ternary operators
status == "active"                // Equality checks
value > 100 && value < 1000       // Logical operations
```

### Performance Features
- **Sub-millisecond evaluation** (30-330µs)
- **Rust-powered engine** with native performance
- **Enterprise reliability** (8,903+ weekly downloads)
- **Built-in libraries**: dayjs (dates), big.js (precision arithmetic)
- **Graceful fallback** when API unavailable

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
pnpm run dev:client  # Frontend only (Vite dev server - port 8080)
pnpm run dev:server  # Backend only (Express server - port 3000)
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

The application integrates with Google's **Gemini 2.5 Flash Preview** API to provide intelligent assistance for learning DSL concepts. Features include:

- Real-time chat with AI assistant
- Context-aware responses based on chat history
- Rate limiting protection (10/min, 500/day)
- Automatic retry logic with exponential backoff
- Connection status monitoring
- Graceful error handling and fallback responses

## 🎯 Features

- **Split-panel Interface**: Chat assistant + code editor
- **AI-Powered Chat**: Real-time assistance with Gemini 2.5 Flash Preview
- **Enterprise DSL Engine**: Zen Engine with sub-millisecond evaluation
- **Advanced Expression Support**: Math, arrays, conditions, strings
- **Examples Library**: Curated examples for learning
- **File Upload**: Upload JSON files for testing (max 50KB)
- **Theme Support**: Light/dark/system theme modes
- **Connection Monitoring**: Real-time API health status
- **Session Management**: Persistent chat history during session

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite with SWC plugin
- **Styling**: Tailwind CSS + shadcn/ui components
- **HTTP Client**: Custom fetch-based client

### Backend
- **Server**: Express.js with TypeScript
- **DSL Engine**: GoRules Zen Engine (Rust-powered)
- **AI**: Google Generative AI (Gemini 2.5 Flash Preview)
- **Rate Limiting**: Express rate limiter
- **CORS**: Multi-port configuration

### Development
- **Package Manager**: pnpm workspaces
- **Process Management**: concurrently for multi-service development
- **Code Quality**: ESLint with TypeScript support
- **Hot Reload**: Vite dev server + nodemon

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/          # API services and HTTP client
│   │   ├── dslService.ts  # Frontend DSL client (calls backend API)
│   │   ├── chatService.ts # AI chat service
│   │   └── httpClient.ts  # HTTP client utility
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── config/            # Configuration files
├── apps/
│   └── server/            # Backend Express application
│       ├── src/           # Server source code
│       │   ├── services/  # Backend services
│       │   │   ├── dslService.ts  # Zen Engine integration
│       │   │   └── gemini.ts      # Gemini AI service
│       │   ├── api/       # API routes
│       │   └── index.ts   # Main server file
│       └── .env           # Server environment variables
└── packages/              # Shared packages (if any)
```

## 🔌 API Endpoints

### DSL Evaluation
```
POST /api/evaluate-dsl
Content-Type: application/json

{
  "expression": "price * quantity",
  "data": { "price": 10.50, "quantity": 3 }
}

Response: { "result": "31.5" }
```

### AI Chat
```
POST /api/chat
Content-Type: application/json

{
  "message": "How do I calculate totals?",
  "history": [...]
}
```

### Health Check
```
GET /api/health
Response: { "status": "ok" }
```

## 🔧 Development Notes

- **Frontend**: Runs on port 8080 (or next available: 8081, 8082)
- **Backend**: Runs on port 3000
- **Architecture**: Frontend HTTP client → Backend API → Zen Engine evaluation
- **CORS**: Configured for multiple frontend ports
- **Rate Limiting**: 10 requests/minute, 500/day for API protection
- **Session Management**: HTTP-only cookies
- **Error Handling**: Graceful fallback to basic evaluation when API unavailable

## 🚀 Deployment

The application can be deployed using the build scripts:

1. Build the frontend: `pnpm run build`
2. Build the backend: `pnpm run build:server`
3. Start the production server: `pnpm run start:server`

### Deployment Considerations
- **Zen Engine**: Requires Node.js environment (contains native binaries)
- **Environment Variables**: Configure Gemini API key and CORS origins
- **Rate Limiting**: Adjust limits based on your usage requirements
- **Performance**: Backend can handle multiple frontend instances

## 🎓 Example Use Cases

```javascript
// Business calculations
price * (1 + taxRate) * quantity

// Data validation
age >= 18 && income > 50000

// Array data processing
users[0].profile.permissions[2]

// String templating
firstName + " " + lastName + " (" + role + ")"

// Conditional logic
score >= 90 ? "A" : score >= 80 ? "B" : "C"
```

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
