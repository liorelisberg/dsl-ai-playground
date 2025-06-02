# 🚀 ZEN DSL AI Playground - Project Documentation (Legacy)

> **📝 Note**: This is legacy project documentation. For the latest documentation with production architecture, see the main [README.md](../../README.md) at the project root.

**An intelligent ZEN Domain-Specific Language (DSL) learning platform with AI-powered assistance and real-time code execution.**

## 🎯 **Current Status: PRODUCTION READY**

- ✅ **Phase 1**: Core DSL Engine & Advanced Backend Services (Complete)
- ✅ **Phase 2**: Conversation Continuity & Semantic Enhancement (Complete) 
- ✅ **Phase 3**: Advanced AI Services & Multi-layer Architecture (Complete)
- ✅ **Phase 4**: UX/UI Polish & Code Quality (Complete)
- ✅ **Phase 5**: Parser → Chat Integration & ZEN DSL Compliance (Complete)

**🆕 Latest Enhancement: Parser → Chat Transfer Feature & Comment-Free ZEN DSL - Production Ready**

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
- **Semantic Understanding**: Vector-based knowledge retrieval with Google embeddings
- **Context Awareness**: Automatic user profiling and conversation flow tracking
- **JSON Integration**: Upload data for personalized DSL examples and suggestions
- **Session Continuity**: Remembers conversation history across interactions

### ⚡ **Expression Workbench**
- **Real-time Evaluation**: Sub-millisecond DSL expression execution
- **Production Engine**: Rust-powered Zen Engine with enterprise reliability
- **424 Examples**: Validated examples across 19 categories
- **Smart Editor**: Enhanced code editor with 42% more screen space
- **Parser → Chat Integration**: "Ask About This" button for seamless AI analysis
- **Comment-Free ZEN DSL**: Proper language compliance (comments not supported)
- **Advanced JSON Viewer**: Professional data exploration with interactive features
  - **Smart View Modes**: Toggle between text editor and interactive JSON tree
  - **Path Copying**: Click any row to copy JSONPath (e.g., `$.user.profile.name`)
  - **Dynamic Collapse**: Expand/collapse JSON levels with +/- controls
  - **URL Detection**: Automatic clickable links and inline image previews
  - **Intelligent Buttons**: Context-aware controls that adapt to current mode
- **Proportional Resizing**: Drag handles to adjust component heights (20-80% viewport)
- **Dark Theme Optimized**: High-contrast colors for excellent visibility

### 🔧 **Production Quality**
- **ESLint Clean**: Professional code quality with 3 minor React Fast Refresh warnings
- **15-Service Architecture**: Sophisticated backend with specialized services
- **Comprehensive Testing**: 3,464 lines of test coverage
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