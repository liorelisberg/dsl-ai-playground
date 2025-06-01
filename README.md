# 🚀 DSL AI Playground - Advanced AI-Powered Learning Platform

**An intelligent Domain-Specific Language (DSL) learning platform with sophisticated AI assistance, semantic search, and real-time code execution.**

## 🎯 **Current Status: PRODUCTION READY**

- ✅ **Phase 1**: Core DSL Engine & Advanced Token Management (Complete)
- ✅ **Phase 2**: Conversation Continuity & Semantic Enhancement (Complete) 
- ✅ **Phase 3**: Advanced AI Services & Multi-layer Architecture (Complete)
- ✅ **Phase 4**: UX/UI Polish & TypeScript Excellence (Complete)

**🆕 Latest: Production-ready platform with sophisticated backend services and comprehensive testing**

## ✨ **Key Features**

### 🎨 **Modern UI/UX**
- **Balanced Layout**: 58% chat / 42% expression workbench for optimal workflow
- **Real-time Connection Status**: Animated indicators with smart retry logic
- **Global Drag & Drop**: Full-screen modal for seamless JSON file upload
- **Professional Design**: Indigo-to-emerald gradient with dark/light themes

### 🧠 **Advanced AI Assistant**
- **Semantic Understanding**: Vector-based knowledge retrieval with SemanticVectorStore integration
- **Context Awareness**: Sophisticated conversation state management and user profiling
- **JSON Integration**: Upload data for personalized DSL examples and suggestions
- **Session Continuity**: Persistent conversation history across interactions
- **Intelligent Rate Limiting**: Advanced throttling and resilience patterns

### ⚡ **Expression Workbench**
- **Real-time Evaluation**: Sub-millisecond DSL expression execution
- **Production Engine**: Rust-powered Zen Engine with enterprise reliability
- **424 Examples**: Comprehensive example library across 19 categories
- **Smart Editor**: Enhanced code editor with 42% screen space allocation
- **Advanced JSON Viewer**: Professional data exploration with @uiw/react-json-view integration

### 🔧 **Production Quality**
- **ESLint Validation**: Clean codebase with 3 minor React Fast Refresh warnings only
- **Sophisticated Backend**: 15-service architecture with advanced capabilities
- **Comprehensive Testing**: 3,464 lines of test code (E2E, Integration, Unit)
- **Enterprise Reliability**: Multi-layer error handling and fallback mechanisms

## 🚀 **Quick Start**

### Prerequisites
- **Node.js**: v18+ (recommended v20+)
- **pnpm**: v8+ (for package management)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/liorelisberg/dsl-ai-playground.git
cd dsl-ai-playground

# Install dependencies
pnpm install

# Set up environment variables
cp apps/server/.env.example apps/server/.env
# Add your GEMINI_API_KEY to apps/server/.env

# Start the full development environment
pnpm run dev:full
```

### 🌐 **Access Points**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 📊 **Sophisticated Architecture Overview**

### **Project Structure** *(Advanced Multi-Service)*
```
dsl-ai-playground/
├── 📁 apps/server/src/
│   ├── routes/                    # API endpoints
│   └── services/                  # Advanced business logic (15 services)
│       ├── rateLimitManager.ts    # Intelligent rate limiting (295 lines)
│       ├── resilientGeminiService.ts # Robust AI service (146 lines)
│       ├── userFeedbackManager.ts # User feedback system (208 lines)
│       ├── contextManager.ts      # Dynamic context management (288 lines)
│       ├── enhancedPromptBuilder.ts # Advanced prompt engineering (297 lines)
│       ├── semanticVectorStore.ts # Vector similarity matching (500 lines)
│       ├── vectorStore.ts        # Knowledge document storage (288 lines)
│       ├── conversationStateManager.ts # Session tracking (279 lines)
│       ├── knowledgeOptimizer.ts  # Knowledge optimization (316 lines)
│       ├── jsonOptimizer.ts      # JSON context optimization (476 lines)
│       ├── embeddingService.ts   # Text embedding generation (223 lines)
│       ├── chromaService.ts      # ChromaDB integration (239 lines)
│       ├── gemini.ts             # AI chat service (298 lines)
│       ├── dslService.ts         # ZEN Engine integration (102 lines)
│       └── chat.ts               # Chat endpoint management (58 lines)
├── 📁 config/                     # Centralized configuration
│   ├── zen-vocabulary-corrected.json # ZEN DSL vocabulary
│   └── components.json            # UI component config
├── 📁 tests/                      # Comprehensive test suite (3,464 lines)
│   ├── e2e/                      # End-to-end tests
│   ├── integration/              # Integration tests
│   └── unit/                     # Unit tests
├── 📁 src/                        # Frontend React app
└── 📄 docs/project/IMPLEMENTATION_PLAN.md # Development roadmap
```

### **Backend Services** *(Advanced Architecture)*
```
apps/server/src/services/
├── contextManager.ts         # Dynamic token budget management
├── conversationStateManager.ts # Advanced conversation continuity
├── semanticVectorStore.ts    # Vector-powered knowledge retrieval
├── enhancedPromptBuilder.ts  # Context-aware prompt engineering
├── rateLimitManager.ts       # Intelligent request throttling
├── resilientGeminiService.ts # Robust API calls with fallbacks
├── userFeedbackManager.ts    # Quality monitoring system
├── knowledgeOptimizer.ts     # Knowledge base optimization
├── jsonOptimizer.ts          # JSON context optimization
├── embeddingService.ts       # Vector embedding generation
├── chromaService.ts          # ChromaDB integration
├── vectorStore.ts            # Knowledge document management
├── gemini.ts                 # AI integration service
├── dslService.ts             # ZEN Engine integration
└── chat.ts                   # Chat endpoint management
```

## 🎮 **Usage Guide**

### **1. Expression Evaluation**
```javascript
// Try these in the Expression Workbench:
// Note: ZEN DSL does not support comments (// or /* */)

// Basic property access
user.name

// String operations  
upper(user.name)

// Array filtering (ZEN DSL focus)
filter(users, age > 18)

// Mathematical calculations
price * quantity * (1 + taxRate)

// Conditional logic
age >= 18 ? "Adult" : "Minor"
```

### **2. Advanced AI Chat Features**
- **🎯 Semantic Understanding**: Vector-based knowledge retrieval for relevant responses
- **📁 Upload JSON**: Drag & drop files for context-aware suggestions
- **❓ Ask Questions**: "How do I use the filter function in ZEN?"
- **📚 Get Examples**: "Show me string transformation examples"
- **🔧 Debug Help**: "Why isn't my expression working?"
- **🛡️ Context Protection**: Maintains focus on ZEN DSL topics
- **🔄 Parser → Chat Integration**: "Ask About This" button transfers expressions for AI analysis

### **3. Example Library**
- **424 Validated Examples** across 19 categories
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
pnpm run lint            # ESLint validation (3 minor warnings)
pnpm run lint:server     # Server-specific linting
```

### **Technology Stack**
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **AI**: Google Gemini 2.0 Flash, Semantic Vector Search, Google Embeddings
- **DSL Engine**: GoRules Zen Engine (Rust-powered)
- **Advanced Services**: Rate limiting, resilience patterns, context optimization
- **File Upload**: react-dropzone with validation
- **JSON Viewer**: @uiw/react-json-view with custom theming

## 📈 **System Capabilities**

### **🚀 Performance & Reliability**
- **Build Time**: ~5 seconds
- **Hot Reload**: Instant development feedback
- **Expression Evaluation**: Sub-millisecond execution
- **AI Response**: Optimized for quality and relevance
- **Connection Detection**: <2s with smart retry logic

### **🎯 Quality Metrics**
- **ESLint Status**: Clean with 3 minor React Fast Refresh warnings
- **Example Coverage**: 424 examples across all DSL categories
- **Test Coverage**: 3,464 lines of comprehensive test code
- **Service Architecture**: 15 specialized backend services
- **Code Quality**: Professional-grade error handling and resilience

## 🔧 **API Endpoints**

### **Core Endpoints**
```
POST   /api/chat/semantic       # Advanced semantic chat with vector search
POST   /api/chat                # Standard chat endpoint
POST   /api/evaluate-dsl        # ZEN expression evaluation
POST   /api/upload-json         # File upload with validation
GET    /api/examples             # Retrieve DSL examples
GET    /api/examples/categories  # Get example categories
GET    /health                   # System health check
GET    /api-docs                 # Swagger documentation
```

### **Response Format**
```json
{
  "text": "AI response content",
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🧪 **Comprehensive Test Suite**

### **Test Structure**
```
tests/
├── e2e/                          # End-to-End Tests (583+ lines)
├── integration/                  # Integration Tests (455+ lines)
└── unit/                         # Unit Tests
```

### **Running Tests**
```bash
# Run individual test files
node tests/e2e/[test-file].js
node tests/integration/[test-file].js

# All tests can be run individually based on test files present
```

## ⚙️ **Configuration**

### **Environment Variables**
```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3000
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_MAX=6
RATE_LIMIT_WINDOW=30000

# Advanced features
CHROMA_PATH=./chroma
GEMINI_EMBED_KEY=your_embedding_api_key_here
```

### **Configuration Files**
- **`docs/config/zen-vocabulary-corrected.json`**: ZEN DSL functions and concepts
- **`config/components.json`**: UI component configuration
- **`docs/project/IMPLEMENTATION_PLAN.md`**: Development roadmap and architecture decisions

## 🚧 **Troubleshooting**

### **Common Issues**

**Connection Issues**
```bash
# Check health endpoint
curl http://localhost:3000/health

# Verify both services running
pnpm run dev:full
```

**Build Issues**
```bash
# Rebuild with full dependency check
pnpm install
pnpm run build
pnpm run build:server
```

## 🔮 **Architecture Achievements**

### **Sophisticated Backend Services**
- ✅ **Advanced Rate Limiting**: Intelligent throttling with user-specific quotas
- ✅ **Resilient AI Service**: Multi-layer fallback mechanisms and error recovery
- ✅ **Semantic Vector Store**: In-memory vector storage with Google embeddings
- ✅ **Context Optimization**: Dynamic token budget management and JSON optimization
- ✅ **Conversation Intelligence**: Advanced state management and user profiling
- ✅ **Knowledge Management**: Automated knowledge base optimization and retrieval

### **Production-Ready Features**
- ✅ **ESLint Clean**: Professional code quality with 3 minor React warnings only
- ✅ **Comprehensive Testing**: 3,464 lines covering E2E, integration, and unit tests
- ✅ **Professional UI**: Advanced JSON viewer with interactive features
- ✅ **Enterprise Reliability**: 15-service architecture with robust error handling

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow the sophisticated 15-service architecture
- Write tests for new features (E2E, Integration, Unit)
- Maintain ESLint code quality standards
- Update documentation for new features

---

**🎉 DSL AI Playground - Production-Ready AI-Powered Learning Platform!**

*🆕 Featuring advanced backend services, semantic search, and comprehensive testing*

*Last Updated: 2025-01-30*  
*Version: 3.1.0 (Production Ready)*  
*Architecture: Sophisticated 15-Service Backend with Advanced AI Capabilities* 