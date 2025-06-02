# 🚀 DSL AI Playground - Deployment Guide

## 📋 **Quick Overview**

Your DSL AI Playground is a **monorepo** with:
- **Frontend**: React + Vite (SPA)
- **Backend**: Node.js + Express API
- **Database**: ChromaDB (file-based vector storage)
- **AI**: Google Gemini API integration

## 🎯 **Deployment Strategy: Separate Services (Recommended)**

**Why Separate?**
- ✅ Better free tier utilization
- ✅ Independent scaling and updates
- ✅ Easier debugging and maintenance
- ✅ Frontend CDN optimization

---

## 🌟 **Free Tier Recommendations**

### **Frontend: Netlify (Free)**
- ✅ **100GB bandwidth/month**
- ✅ **300 build minutes/month**
- ✅ **Automatic deployments**
- ✅ **Global CDN**
- ✅ **Custom domains**

### **Backend: Railway ($5 credit)**
- ✅ **512MB RAM, 1GB disk**
- ✅ **Persistent storage for ChromaDB**
- ✅ **Environment variables**
- ✅ **Automatic deployments**
- **Alternative**: Render (512MB RAM, but limited)

---

## 📋 **Step-by-Step Deployment**

### **Phase 1: Prerequisites**

1. **Get API Keys:**
   ```bash
   # Google AI Studio (free)
   GEMINI_API_KEY=your_api_key
   GEMINI_EMBED_KEY=your_embed_key
   ```

2. **Test Local Build:**
   ```bash
   # Frontend build
   pnpm run build
   
   # Backend build
   pnpm run build:server
   ```

### **Phase 2: Deploy Backend (Railway)**

1. **Create Railway Account**: https://railway.app
2. **Create New Project** → **Deploy from GitHub**
3. **Configure Build Settings:**
   - **Root Directory**: `/` (monorepo root)
   - **Build Command**: Auto-detected (uses Dockerfile)
   - **Start Command**: `node dist/index.js`

4. **Set Environment Variables:**
   ```bash
   GEMINI_API_KEY=your_actual_api_key
   GEMINI_EMBED_KEY=your_actual_embed_key
   PORT=3000
   NODE_ENV=production
   SESSION_SECRET=your_secure_random_string
   CORS_ORIGIN=https://your-frontend-domain.netlify.app
   ```

5. **Deploy & Test:**
   - Railway will auto-deploy
   - Test health endpoint: `https://your-app.railway.app/health`
   - Note your Railway URL for frontend configuration

### **Phase 3: Deploy Frontend (Netlify)**

1. **Create Netlify Account**: https://netlify.com
2. **Create New Site** → **Deploy from Git**
3. **Configure Build Settings:**
   - **Build Command**: `pnpm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18`

4. **Update API Configuration:**
   ```bash
   # Update netlify.toml with your Railway backend URL
   # Replace "your-backend-url.railway.app" with actual URL
   ```

5. **Deploy & Test:**
   - Netlify will auto-deploy
   - Test your frontend URL
   - Verify API calls work

### **Phase 4: Configuration Updates**

1. **Update CORS on Railway:**
   ```bash
   CORS_ORIGIN=https://your-actual-netlify-domain.netlify.app
   ```

2. **Test Full Integration:**
   - Frontend loads ✅
   - Chat functionality works ✅
   - DSL evaluation works ✅
   - Examples load ✅

---

## 🐳 **Alternative: Docker Deployment**

### **Local Docker Testing:**
```bash
# Build and run backend
docker build -t dsl-backend .
docker run -p 3000:3000 --env-file .env dsl-backend

# Frontend (serve dist folder with nginx)
pnpm run build
# Serve dist/ with any static server
```

### **Self-Hosted Options:**
- **VPS**: DigitalOcean, Linode ($5/month)
- **Serverless**: Vercel Functions + PlanetScale
- **Container**: Google Cloud Run, AWS Fargate

---

## 📊 **Resource Requirements**

### **Backend:**
- **RAM**: 512MB minimum (ChromaDB + Node.js)
- **Storage**: 1GB (for vector database)
- **CPU**: 1 core sufficient
- **Bandwidth**: ~50GB/month for moderate usage

### **Frontend:**
- **Static hosting** (any CDN)
- **Build time**: ~2-3 minutes
- **Bundle size**: ~2MB gzipped

---

## 🔒 **Security Checklist**

- [ ] **API Keys**: Never commit to git
- [ ] **CORS**: Restrict to frontend domain only
- [ ] **Session Secret**: Use strong random string
- [ ] **HTTPS**: Ensure both services use SSL
- [ ] **Rate Limiting**: Already configured in app
- [ ] **File Uploads**: Size limits already set

---

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   ```bash
   # Backend logs: "CORS policy blocked"
   # Fix: Update CORS_ORIGIN with correct frontend URL
   ```

2. **API Key Errors:**
   ```bash
   # Backend logs: "GEMINI_API_KEY is required"
   # Fix: Set environment variables on Railway
   ```

3. **Build Failures:**
   ```bash
   # "pnpm not found"
   # Fix: Railway should auto-detect pnpm, check dockerfile
   ```

4. **ChromaDB Issues:**
   ```bash
   # "Failed to initialize vector store"
   # Fix: Ensure persistent storage enabled on Railway
   ```

---

## 📈 **Monitoring & Maintenance**

### **Health Checks:**
- **Backend**: `https://your-backend.railway.app/health`
- **Frontend**: Check console for API errors
- **API Usage**: Monitor Google AI Studio dashboard

### **Logs:**
- **Railway**: Built-in logging dashboard
- **Netlify**: Build logs and function logs
- **Frontend**: Browser dev tools console

---

## 💰 **Cost Estimates (Monthly)**

### **Free Tier Setup:**
- **Frontend (Netlify)**: $0 (within limits)
- **Backend (Railway)**: $0 (using $5 credit)
- **Google AI**: $0 (generous free tier)
- **Total**: $0-5/month

### **Paid Upgrade Path:**
- **Railway Pro**: $20/month (8GB RAM, more bandwidth)
- **Netlify Pro**: $19/month (more build minutes)
- **Google AI Pay-as-go**: Based on usage

---

## 🎉 **Success Criteria**

✅ **Frontend loads at custom domain**  
✅ **Chat responds with AI assistance**  
✅ **DSL evaluation works**  
✅ **Examples load and execute**  
✅ **File upload functions**  
✅ **Session persistence works**  
✅ **Health checks pass**  

---

## 📞 **Support Resources**

- **Railway Docs**: https://docs.railway.app
- **Netlify Docs**: https://docs.netlify.com
- **Google AI Studio**: https://aistudio.google.com
- **ChromaDB Docs**: https://docs.trychroma.com

---

**🚀 Ready to deploy? Start with Phase 2 (Backend) and work through each phase sequentially!** 