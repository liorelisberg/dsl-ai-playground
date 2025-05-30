# DSL AI Playground - Documentation Index

This folder contains all documentation, implementation plans, DSL rules, and datasets for the DSL AI Playground project, organized in a logical structure.

## 📂 Folder Structure

### 📋 **project/** - Core Project Documentation
- **[PROJECT_OVERVIEW.txt](./project/PROJECT_OVERVIEW.txt)** - High-level project overview and capabilities
- **[project_requirements.txt](./project/project_requirements.txt)** - Detailed technical requirements specification
- **[REQUIREMENTS_ANALYSIS_REPORT.txt](./project/REQUIREMENTS_ANALYSIS_REPORT.txt)** - Comprehensive requirements compliance analysis
- **[README.md](./project/README.md)** - Project setup, installation, and basic usage instructions

### 🛠️ **planning/** - Implementation & Enhancement Plans
- **[CONVERSATION_OPTIMIZATION_PLAN.md](./planning/CONVERSATION_OPTIMIZATION_PLAN.md)** - Detailed optimization strategy for conversation management (37KB)
- **[CHROMADB_IMPLEMENTATION_PLAN.md](./planning/CHROMADB_IMPLEMENTATION_PLAN.md)** - ChromaDB vector database integration plan

### 🔧 **dsl-rules/** - DSL Language Reference
Complete Domain Specific Language (DSL) rule definitions in Markdown format (.mdc files):

#### Core Language Rules
- **[array-rule.mdc](./dsl-rules/array-rule.mdc)** - Array manipulation and iteration rules
- **[booleans-rule.mdc](./dsl-rules/booleans-rule.mdc)** - Boolean logic and conditional operations  
- **[date-rule.mdc](./dsl-rules/date-rule.mdc)** - Date/time functions and formatting
- **[numbers-rule.mdc](./dsl-rules/numbers-rule.mdc)** - Numeric operations and calculations
- **[object-rule.mdc](./dsl-rules/object-rule.mdc)** - Object property access and manipulation
- **[strings-rule.mdc](./dsl-rules/strings-rule.mdc)** - String manipulation and formatting
- **[type-inspection-rule.mdc](./dsl-rules/type-inspection-rule.mdc)** - Type checking and validation

#### Domain-Specific Rules
- **[market-rule.mdc](./dsl-rules/market-rule.mdc)** - Market data and financial calculations
- **[membership-rule.mdc](./dsl-rules/membership-rule.mdc)** - Membership and user management rules
- **[project-rule.mdc](./dsl-rules/project-rule.mdc)** - Project management and tracking rules

### 📊 **datasets/** - Test Data & Examples
- **[standard.csv](./datasets/standard.csv)** - Standard test dataset (14KB, 468 lines)
- **[date.csv](./datasets/date.csv)** - Date-specific test cases (8.3KB, 191 lines)
- **[unary.csv](./datasets/unary.csv)** - Unary operation test data (3.3KB, 109 lines)

### ⚙️ **config/** - Configuration Files  
- **[robots.txt](./config/robots.txt)** - Web crawler configuration

## 📊 Current Project Status

**Requirements Compliance:** 85% MVP Complete
- ✅ **Fully Complete:** 8/12 core requirements (67%)
- ⚠️ **Partially Complete:** 3/12 requirements (25%)  
- ❌ **Not Started:** 1/12 requirements (8%)

**Key Achievements:**
- Core DSL engine fully functional (Zen Engine)
- All backend APIs implemented and tested
- Conversation management with optimization plan ready
- Rate limiting and security features active
- Knowledge base with 113 documents loaded (17,019 tokens)

**Next Implementation Phase:**
1. **Token Efficiency Optimization** - 60% token reduction target
2. **Semantic Search Enhancement** - ChromaDB integration
3. **Conversation State Management** - User adaptation system
4. **Performance Monitoring** - Analytics dashboard

## 🎯 System Architecture

**Knowledge Base Processing:**
- **DSL Rules**: 10 files → 113 chunks → 17,019 tokens
- **Vector Store**: In-memory with semantic search capabilities
- **Context Management**: Dynamic allocation with conversation state
- **API Integration**: Gemini AI with rate limiting (6 req/30s)

---

*Last Updated: 2025-01-05*  
*Documentation Structure: v2.0 (Reorganized & Optimized)*  
*Project Version: 1.0.0 (Zen Engine + Knowledge Base Integration)* 