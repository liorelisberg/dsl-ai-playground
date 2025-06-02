# 🚀 Vercel + Render Deployment Guide

## 🎯 **Optimal Stack: Your Choice Validated!**

✅ **Frontend: Vercel** - Superior DX, 6000 build minutes/month  
✅ **Backend: Render** - True free tier, 750 hours/month, persistent storage  
✅ **Monorepo Support** - Both platforms handle monorepos excellently  

---

## 📋 **Quick Deployment Steps**

### **Step 1: Deploy Backend (Render)**

1. **Create Render Account**: https://render.com
2. **Connect GitHub Repository**
3. **Create Web Service**:
   - **Name**: `dsl-ai-playground-backend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     cd apps/server && npm install -g pnpm && pnpm install --frozen-lockfile && pnpm run build
     ```
   - **Start Command**: 
     ```bash
     cd apps/server && node dist/index.js
     ```
   - **Plan**: `Free`

4. **Set Environment Variables**:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   GEMINI_EMBED_KEY=your_embed_key_here
   NODE_ENV=production
   PORT=10000
   SESSION_SECRET=auto_generated_by_render
   CORS_ORIGIN=https://your-app.vercel.app
   ```

5. **Deploy & Get URL**: 
   - Note your Render URL: `https://your-app.onrender.com`

### **Step 2: Deploy Frontend (Vercel)**

1. **Create Vercel Account**: https://vercel.com
2. **Import GitHub Repository**
3. **Auto-detected Settings** (already configured in `vercel.json`):
   - **Framework**: `Vite`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`

4. **Update API Endpoints**:
   ```bash
   # Update vercel.json with your actual Render URL
   # Replace "your-backend-app.onrender.com" with real URL
   ```

5. **Deploy & Test**:
   - Vercel auto-deploys
   - Note your Vercel URL: `https://your-app.vercel.app`

### **Step 3: Connect Services**

1. **Update CORS on Render**:
   ```bash
   CORS_ORIGIN=https://your-actual-app.vercel.app
   ```

2. **Update API proxy in vercel.json**:
   ```bash
   # Replace with your actual Render URL
   ```

---

## 🔧 **Configuration Files Created**

### **`vercel.json`** - Frontend Configuration
```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend.onrender.com/api/$1"
    }
  ]
}
```

### **`render.yaml`** - Backend Configuration
```yaml
services:
  - type: web
    name: dsl-ai-playground-backend
    env: node
    plan: free
    buildCommand: cd apps/server && pnpm install && pnpm run build
    startCommand: cd apps/server && node dist/index.js
```

---

## 💰 **Cost Comparison (Your Choice Wins!)**

| Service | Vercel | Render | Total |
|---------|--------|---------|--------|
| **Frontend** | Free (6000 min/month) | - | $0 |
| **Backend** | - | Free (750 hrs/month) | $0 |
| **Google AI** | - | - | $0 |
| **Monthly Total** | | | **$0** |

**Versus Railway**: Railway's $5 credit expires, Render's free tier doesn't! 🎉

---

## 🚀 **Advantages of Your Stack**

### **Vercel Benefits:**
- ✅ **6000 build minutes** vs Netlify's 300
- ✅ **Better Vite integration** and optimizations  
- ✅ **Automatic image optimization**
- ✅ **Edge functions** for future expansion
- ✅ **Superior developer experience**

### **Render Benefits:**
- ✅ **True free tier** (doesn't expire like Railway)
- ✅ **750 hours/month** (enough for 24/7 operation)
- ✅ **Persistent disk storage** for ChromaDB
- ✅ **Automatic SSL certificates**
- ✅ **Built-in health checks**

### **Monorepo Advantages:**
- ✅ **Single repository** to manage
- ✅ **Atomic deployments** possible
- ✅ **Shared dependencies** and configs
- ✅ **Easier version management**

---

## 🔄 **Deployment Workflow**

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy v3.4.0"
git push origin main

# 2. Auto-deployments trigger:
# - Render rebuilds backend
# - Vercel rebuilds frontend

# 3. Test endpoints:
# - Backend: https://your-app.onrender.com/health
# - Frontend: https://your-app.vercel.app
```

---

## 🐛 **Troubleshooting Your Stack**

### **Render Issues:**
```bash
# Build fails: "pnpm not found"
# Fix: build command installs pnpm first

# Cold starts: First request slow
# Normal: Render spins down free apps after 15min inactivity
```

### **Vercel Issues:**
```bash
# API calls fail: 404 on /api/*
# Fix: Update vercel.json with correct Render URL

# Build fails: "pnpm install failed"
# Fix: Vercel should auto-detect pnpm from lockfile
```

---

## ✅ **Your Stack is Ready!**

**Files configured:**
- ✅ `vercel.json` - Frontend deployment
- ✅ `render.yaml` - Backend deployment  
- ✅ `Dockerfile` - Alternative deployment option
- ✅ Environment templates

**Next steps:**
1. Get Google AI API keys
2. Deploy backend on Render
3. Deploy frontend on Vercel  
4. Update URLs and test integration

**Your analysis was spot-on! 🎯 This stack will serve you well for free hosting.** 