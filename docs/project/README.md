# 🚀 DSL AI Playground - Project Documentation (Legacy)

> **📝 Note**: This is legacy project documentation. For the latest documentation with lean system architecture, see the main [README.md](../../README.md) at the project root.

**An intelligent Domain-Specific Language (DSL) learning platform with AI-powered assistance and real-time code execution.**

## 🎯 **Current Status: LEAN PRODUCTION READY**

- ✅ **Phase 1**: Core DSL Engine & Token Budget Expansion (100% Complete)
- ✅ **Phase 2**: Conversation Continuity & Semantic Enhancement (100% Complete) 
- ✅ **Phase 2.5**: System Cleanup & Lean Architecture (✨ **NEW** - 100% Complete)
- ✅ **Phase 4**: UX/UI Polish & TypeScript Cleanup (100% Complete)

**🆕 Latest Enhancement: Lean System Architecture - Simplified & Focused**

## 🔗 **Quick Links**

- **📖 Main Documentation**: [README.md](../../README.md) - Complete project documentation
- **📋 Implementation Plan**: [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) - Current development roadmap  
- **🧪 Test Suite**: [tests/](../../tests/) - Organized test suite (E2E, Integration, Unit)
- **⚙️ Configuration**: [config/](../../config/) - Centralized configuration files

## ✨ **Key Features**

### 🎨 **Modern UI/UX (Recently Enhanced)**
- **Balanced Layout**: 58% chat / 42% expression workbench for optimal workflow
- **Real-time Connection Status**: Animated indicators with smart retry logic
- **Global Drag & Drop**: Full-screen modal for seamless JSON file upload
- **Professional Design**: Indigo-to-emerald gradient with dark/light themes

### 🧠 **Intelligent AI Assistant**
- **Semantic Understanding**: 72% similarity matching with 113 knowledge documents
- **Context Awareness**: Automatic user profiling and conversation flow tracking
- **JSON Integration**: Upload data for personalized DSL examples and suggestions
- **Session Continuity**: Remembers conversation history across interactions

### ⚡ **Expression Workbench**
- **Real-time Evaluation**: Sub-millisecond DSL expression execution
- **Production Engine**: Rust-powered Zen Engine with enterprise reliability
- **320+ Examples**: 100% validated examples with zero hallucinations
- **Smart Editor**: Enhanced code editor with 42% more screen space
- **Advanced JSON Viewer**: Professional data exploration with interactive features
  - **Smart View Modes**: Toggle between text editor and interactive JSON tree
  - **Path Copying**: Click any row to copy JSONPath (e.g., `$.user.profile.name`)
  - **Dynamic Collapse**: Expand/collapse JSON levels with +/- controls
  - **URL Detection**: Automatic clickable links and inline image previews
  - **Intelligent Buttons**: Context-aware controls that adapt to current mode
- **Proportional Resizing**: Drag handles to adjust component heights (20-80% viewport)
- **Dark Theme Optimized**: High-contrast colors for excellent visibility

### 🔧 **Production Quality**
- **Zero TypeScript Errors**: Fixed 39+ lint errors for bulletproof type safety
- **100% Example Accuracy**: Eliminated all hallucinated functions (down from 44)
- **Comprehensive Testing**: Automated validation pipeline
- **Enterprise Reliability**: Robust error handling and fallback mechanisms

## 🚀 **Quick Start**

### Prerequisites
- **Node.js**: v18+ (recommended v20+)
- **pnpm**: v8+ (for package management)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/dsl-ai-playground.git
cd dsl-ai-playground

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Start the full development environment
pnpm run dev:full
```

### 🌐 **Access Points**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 📊 **Architecture Overview**

### **Frontend** (React + TypeScript)
```
src/
├── components/
│   ├── DSLTutor/           # Main application components
│   │   ├── ChatPanel.tsx   # AI chat interface
│   │   ├── CodeEditor.tsx  # Expression workbench
│   │   └── DSLTutor.tsx    # Main layout container
│   └── ui/                 # Reusable UI components
├── services/               # API clients and utilities
├── hooks/                  # React hooks (connection status, etc.)
└── types/                  # TypeScript definitions
```

### **Backend** (Express + AI Services)
```
apps/server/src/
├── routes/                 # API endpoints
├── services/               # Core business logic
│   ├── gemini.ts          # AI chat service
│   ├── dslService.ts      # Expression evaluation
│   └── semanticVectorStore.ts # Knowledge base
└── index.ts               # Server entry point
```

## 🎮 **Usage Guide**

### **1. Expression Evaluation**
```javascript
// Try these in the Expression Workbench:

// Basic property access
user.name

// String operations
user.name.toUpperCase()

// Mathematical calculations
price * quantity * (1 + taxRate)

// Conditional logic
age >= 18 ? "Adult" : "Minor"

// Array operations
users[0].email
```

### **2. AI Chat Features**
- **Upload JSON**: Drag & drop files for context-aware suggestions
- **Ask Questions**: "How do I access nested properties?"
- **Get Examples**: "Show me string transformation examples"
- **Debug Help**: "Why isn't my expression working?"

### **3. Example Library**
- **320+ Validated Examples** across 17+ categories
- **Interactive Selection** with immediate loading
- **Categorized by Complexity** (beginner → advanced)
- **Real-world Scenarios** with sample data

## 🛠️ **Development**

### **Available Scripts**
```bash
# Development
pnpm run dev:full        # Start both frontend and backend
pnpm run dev:client      # Frontend only (port 8080)
pnpm run dev:server      # Backend only (port 3000)

# Production
pnpm run build           # Build frontend
pnpm run build:server    # Build backend
pnpm run preview         # Preview production build

# Quality Assurance
pnpm run lint            # TypeScript validation (zero errors)
pnpm run test            # Run test suite
```

### **Technology Stack**
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **AI**: Google Gemini 2.5 Flash, Semantic Vector Search
- **DSL Engine**: GoRules Zen Engine (Rust-powered)
- **File Upload**: react-dropzone with validation
- **JSON Viewer**: @uiw/react-json-view with custom theming and interactions

## 📈 **Performance Metrics**

### **🚀 Speed & Reliability**
- **Build Time**: ~5 seconds
- **Hot Reload**: Instant
- **Expression Evaluation**: <1ms (sub-millisecond)
- **AI Response**: <8.3s (including embeddings)
- **Connection Detection**: <2s

### **🎯 Quality Metrics**
- **TypeScript Errors**: 0 (down from 39+)
- **Example Accuracy**: 100% (up from 88%)
- **Token Efficiency**: 62% improvement
- **Semantic Similarity**: 72% average
- **Knowledge Coverage**: 113 documents

## 🔧 **API Endpoints**

### **Core Endpoints**
```
POST   /api/chat/semantic       # Intelligent AI chat
POST   /api/evaluate-dsl        # Expression evaluation
POST   /api/upload-json         # File upload with validation
GET    /health                  # System health check
GET    /api-docs                # Swagger documentation
```

### **Response Format**
```json
{
  "text": "AI response content",
  "metadata": {
    "semanticSimilarity": 85,
    "contextUsed": true,
    "semanticMatches": 3
  }
}
```

## 🎨 **UI/UX Highlights**

### **Enhanced User Experience**
- **Intelligent Layout**: Optimal 58/42 split for chat and coding
- **Visual Feedback**: Animated connection status with color coding
- **Drag & Drop**: Global file detection with modal overlay
- **Smart Tooltips**: Contextual help and feature explanations
- **Responsive Design**: Mobile and desktop optimized
- **Interactive JSON Viewer**: Professional data exploration with path copying and smart rendering
- **Adaptive Controls**: Buttons that intelligently enable/disable based on context

### **Professional Polish**
- **Zero Errors**: Complete TypeScript type safety
- **Smooth Animations**: CSS transitions with Tailwind
- **Dark/Light Themes**: Seamless theme switching with optimized JSON viewer colors
- **Loading States**: Visual feedback for all operations
- **Smart Button Layout**: Context-aware controls with logical grouping

## 📚 **Documentation**

### **Project Documentation**
- [`PROJECT_OVERVIEW.txt`](./PROJECT_OVERVIEW.txt) - Complete technical overview
- [`project_requirements.txt`](./project_requirements.txt) - Implementation status
- [`REQUIREMENTS_ANALYSIS_REPORT.txt`](./REQUIREMENTS_ANALYSIS_REPORT.txt) - Analysis report

### **DSL Language Reference**
- [`docs/dsl-rules/`](../dsl-rules/) - Complete DSL syntax documentation
- **10 Rule Files**: Arrays, Strings, Numbers, Dates, Objects, etc.
- **113 Code Examples**: Validated against source documentation

## 🔐 **Configuration**

### **Environment Variables**
```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3000
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_MAX=6
RATE_LIMIT_WINDOW=30000
```

### **Rate Limiting**
- **Development**: 6 requests per 30 seconds
- **File Upload**: 256KB maximum size
- **JSON Validation**: Automatic format checking

## 🚧 **Troubleshooting**

### **Common Issues**

**Connection Issues**
```bash
# Check health endpoint
curl http://localhost:3000/health

# Verify both services running
pnpm run dev:full
```

**TypeScript Errors**
```bash
# Rebuild and check
pnpm run build
pnpm run lint
```

**File Upload Issues**
- Ensure files are valid JSON format
- Check file size (256KB limit)
- Verify CORS settings

## 🎯 **Production Deployment**

### **Frontend Deployment**
```bash
pnpm run build
# Deploy dist/ folder to your hosting service
```

### **Backend Deployment**
```bash
cd apps/server
pnpm run build
# Deploy built server with environment variables
```

## 📄 **License**

MIT License - see [LICENSE](../../LICENSE) for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**🎉 DSL AI Playground - Where AI meets intelligent code education!**

*Last Updated: 2025-01-30*  
*Version: 3.1.0 (Enhanced JSON Viewer)*
