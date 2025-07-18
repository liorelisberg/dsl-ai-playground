# 🚀 ZEN DSL AI Playground - Advanced AI-Powered Learning Platform

**An intelligent ZEN Domain-Specific Language (DSL) learning platform with sophisticated AI assistance, semantic search, and real-time code execution.**

---

## 🎯 **What is ZEN DSL AI Playground?**

ZEN DSL AI Playground is a **production-ready, comprehensive educational platform** that combines modern web technologies with advanced AI capabilities to create an intuitive learning environment for ZEN DSL expressions.

### **🌟 Key Features**

- **🤖 AI-Powered Learning**: Interactive chat assistant powered by Google Gemini 2.5 Flash
- **⚡ Real-Time Execution**: Sub-millisecond ZEN expression evaluation using Rust-powered GoRules Zen Engine  
- **🧠 Semantic Knowledge Retrieval**: Vector-based knowledge system for contextual learning
- **📁 Intelligent Context Management**: JSON file uploads for personalized learning experiences
- **🎨 Modern UI/UX**: with dark/light themes and advanced JSON visualization
- **🔒 Enterprise Security**: Production-grade rate limiting, session management, and input validation
- **📚 Comprehensive Examples**: 424+ validated ZEN expressions across 19 categories

---

## 🎯 **Current Status: PRODUCTION READY v3.4.0**

- ✅ **Phase 1**: Core DSL Engine & Advanced Token Management (Complete)
- ✅ **Phase 2**: Conversation Continuity & Semantic Enhancement (Complete) 
- ✅ **Phase 3**: Advanced AI Services & Multi-layer Architecture (Complete)
- ✅ **Phase 4**: UX/UI Polish & TypeScript Excellence (Complete)
- ✅ **Phase 5**: Enhanced Chat → Parser Integration with Smart Titles (Complete)
- ✅ **Phase 6**: Advanced Session Management & Frontend Persistence (Complete)
- ✅ **Phase 7**: Load Older Messages Feature & Message Pagination (Complete)

**🆕 Latest v3.4.0: Load Older Messages feature with frontend-only message history, smart pagination, and seamless session integration**

## ✨ **Key Features**

### 🎨 **Modern UI/UX**
- **Balanced Layout**: 58% chat / 42% expression workbench for optimal workflow
- **Real-time Connection Status**: Animated indicators with smart retry logic
- **Global Drag & Drop**: Full-screen modal for seamless JSON file upload
- **Professional Design**: Indigo-to-emerald gradient with dark/light themes

### 🧠 **Advanced AI Assistant**
- **Enhanced Chat → Parser Integration**: Smart titles and adaptive UI for seamless learning
  - Descriptive example titles with `${title}` markers for clarity
  - Adaptive button UI: single example → button, multiple → dropdown
  - Critical data structure validation preventing invalid expressions
- **Advanced Session Management**: Persistent conversation state with intelligent tracking
  - localStorage persistence across page reloads and browser sessions
  - Real-time session metrics (age, message count, activity tracking)
  - Session refresh/clear controls with visual feedback
  - Cross-tab session isolation and consistency
- **Load Older Messages**: Frontend-only message history with smart pagination
  - View extended conversation history without affecting AI context
  - Batch loading of older messages (5 at a time) for performance
  - Visual indicators showing available older messages count
  - Automatic synchronization with session management
- **Enhanced JSON File Processing**: Advanced file upload with intelligent context handling
  - Support for large JSON files (up to 256KB) with automatic optimization
  - `@fulljson` command for accessing complete uploaded data
  - Smart token management prevents context overflow
  - Session-based file persistence across conversations
- **Semantic Understanding**: Vector-based knowledge retrieval with SemanticVectorStore integration
- **Context Awareness**: Sophisticated conversation state management and user profiling
- **JSON Integration**: Upload data for personalized DSL examples and suggestions
- **Session Continuity**: Persistent conversation history across interactions
- **Intelligent Rate Limiting**: Advanced throttling and resilience patterns
- **Parser → Chat Integration**: "Ask About This" button transfers expressions for AI analysis

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
- **🎯 Enhanced Chat → Parser Integration**: Transfer examples with smart titles
  - AI provides `${title}` markers for descriptive example names
  - Single example → "Try This" button for instant transfer
  - Multiple examples → dropdown menu with cleaned titles (no "Example N:" prefixes)
  - Critical validation ensures arrays are properly wrapped in objects
- **🎯 Semantic Understanding**: Vector-based knowledge retrieval for relevant responses
- **📁 Upload JSON**: Drag & drop files for context-aware suggestions
- **🔥 Enhanced JSON Processing**: Advanced file handling with `@fulljson` command
  - Upload large JSON files (up to 256KB) for AI analysis
  - Use `@fulljson` in your messages to access complete uploaded data
  - Example: "Generate Markets from this data @fulljson"
  - Smart token optimization prevents context overflow
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

---

## 🔒 **System Limitations**

### **📊 DSL AI Playground Rate Limits**
| **Limit Type** | **Value** | **Window** | **Description** |
|----------------|-----------|------------|-----------------|
| **Session Rate Limit** | 6 requests | 30 seconds | Per-session throttling |
| **Daily Limit (Free)** | 500 requests | 24 hours | Free tier daily quota |
| **JSON Upload Size** | 256 KB | Per file | Maximum JSON file size |
| **TPM Protection** | 5 second delay | `@fulljson` | Prevents token rate violations |

### **🤖 AI Model Specifications**

#### **Main Model: Google Gemini 2.0 Flash**
- **Input Tokens**: 1,048,576 (1M tokens)
- **Output Tokens**: 8,192 tokens
- **System Budget**: 16,000 tokens (enhanced 2x capacity)
- **Available Budget**: 15,000 tokens (93.75% efficiency)
- **Google API Rate Limits**:
  - **Free Tier**: 15 RPM, 1,000,000 TPM, 1,500 RPD
  - **Tier 1**: 2,000 RPM, 4,000,000 TPM, Unlimited RPD
  - **Tier 2**: 10,000 RPM, 10,000,000 TPM, Unlimited RPD
  - **Tier 3**: 30,000 RPM, 30,000,000 TPM, Unlimited RPD

#### **Fallback Model: Google Gemini 1.5 Flash**
- **Input Tokens**: 1,048,576 (1M tokens)
- **Output Tokens**: 8,192 tokens
- **Google API Rate Limits**:
  - **Free Tier**: 15 RPM, 250,000 TPM, 1,500 RPD
  - **Tier 1+**: Similar scaling to 2.0 Flash

### **⚡ Enhanced Token Budget Allocation (16K)**
```
Total Budget: 16,000 tokens (100%)
├── System Prompt: 400 tokens (2.5%)
├── Reserve Buffer: 600 tokens (3.75%)
└── Available Content: 15,000 tokens (93.75%)
    ├── Knowledge Cards: 3,000-6,000 tokens (20-40%)
    ├── Chat History: 3,500-6,000 tokens (25-45%)
    └── JSON Context: 2,250-5,250 tokens (15-35%)
```

### **🚀 Token Budget Benefits (16K vs 8K)**
- **Knowledge Cards**: 2x-3x increase (2,000 → 4,500-6,000 tokens)
- **Chat History**: 2x-3x increase (1,600 → 3,500-6,000 tokens)  
- **JSON Context**: 3x-5x increase (730 → 2,250-5,250 tokens)
- **Complex Queries**: 50% more reserve allocation (800 → 1,200 tokens)
- **Overall Efficiency**: 93.75% (vs previous 91.25%)
- **Free Tier Usage**: 19.2% TPM utilization (192K/1M limit)

### **🛡️ Smart Protection Features**
- **Intelligent Rate Limiting**: Session-aware throttling with queue management
- **Token Optimization**: Dynamic budget allocation based on conversation flow
- **TPM Guard**: 5-second delay for large JSON requests (`@fulljson`)
- **Graceful Degradation**: Automatic fallback to Gemini 1.5 Flash
- **Error Recovery**: Multi-layer retry mechanisms with exponential backoff

---

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