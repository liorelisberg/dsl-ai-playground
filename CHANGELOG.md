# 📝 Changelog

All notable changes to DSL AI Playground will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Parser → Chat Integration**: "Ask About This" button in Expression Workbench
  - Smart state management (disabled until expression evaluation)
  - Contextual prompts for working vs failing expressions
  - Async AI response generation with loading states
  - Toast notifications for user feedback
  - Automatic state reset when loading new examples

### Changed
- **ZEN DSL Comment Support Removed**: Aligned with language specification
  - Removed comment stripping from frontend `dslService.ts`
  - Removed comment stripping from backend `dslService.ts`
  - Updated default expression example to remove comment
  - ZEN Engine now properly rejects expressions with comments
- **Knowledge Base Optimization**: Disabled .mdc file loading
  - Prevents JavaScript examples from confusing AI about comment support
  - AI now gives correct responses about ZEN DSL syntax restrictions
- **Toast Notification Analysis**: Documented complete notification system
  - Identified 28 toast messages across 5 components
  - Documented styling variants (default vs destructive)
  - Discovered configuration issues (16.7 minute duration)

### Fixed
- **Documentation Accuracy**: Updated all metrics to match actual implementation
  - Backend services: 15 (not 13)
  - Example count: 424 (not 405+)
  - Test coverage: 3,464 lines (not 3,400+)
  - Code quality: ESLint clean with 3 React warnings (not zero errors)

## [3.1.0] - 2025-01-30

### Production Release
- **Sophisticated 15-service backend architecture**
- **Advanced AI Assistant with semantic search**
- **424 validated DSL examples across 19+ categories**
- **Professional React UI with advanced JSON viewer**
- **Comprehensive testing framework (3,464 lines)**
- **ESLint clean codebase (3 minor React warnings)**
- **Comment-free ZEN DSL implementation**

---

**Legend:**
- **Added**: New features
- **Changed**: Changes in existing functionality  
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes 