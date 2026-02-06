# FlyCart Deployment - Quick Start

## 📋 Current Status
- ✅ Frontend: Deployed on Render
- ❌ Backend: Not deployed yet (only local)

## 🚀 Quick Deployment Steps

### 1. Deploy Backend to Render (5 minutes)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

2. **Go to Render** → New Web Service
   - Connect your GitHub repo
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Add Environment Variables** in Render:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flycart
   JWT_SECRET=your-random-secret-key-here
   NODE_ENV=production
   ```

4. **Deploy** and get your backend URL (e.g., `https://flycart-backend.onrender.com`)

### 2. Update Frontend Environment Variable

In your Render frontend project settings:
- Add environment variable: `VITE_API_URL=https://flycart-backend.onrender.com`
- Redeploy frontend

### 3. Test

Visit your frontend URL and verify:
- Products load correctly
- Cart functionality works
- Authentication works

---

## 📝 Important Files Created

- ✅ `server/package.json` - Added start script
- ✅ `server/.env.example` - Environment variables template
- ✅ `client/.env.example` - Frontend environment template
- ✅ `BACKEND_DEPLOYMENT_GUIDE.md` - Detailed deployment guide

---

## 🔑 Environment Variables Needed

### Backend (Render Web Service)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### Frontend (Render Static Site)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🛠️ MongoDB Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster (free tier available)
3. Create a database user
4. Get connection string
5. Whitelist IP: `0.0.0.0/0` (allow from anywhere)

---

## 📚 Next Steps

1. Read `BACKEND_DEPLOYMENT_GUIDE.md` for detailed instructions
2. Set up MongoDB Atlas if you haven't already
3. Deploy backend to Render
4. Update frontend environment variable
5. Test the full application

---

## ⚠️ Common Issues

**Backend won't start?**
- Check Render logs
- Verify MongoDB connection string
- Ensure all environment variables are set

**CORS errors?**
- Backend CORS is already configured
- Make sure frontend URL is correct

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` is set correctly in Render
- Check backend is running (visit backend URL directly)

---

## 💡 Tips

- Free tier on Render sleeps after 15 min inactivity
- First request after sleep takes ~30-60 seconds
- Keep your `.env` files local (never commit them!)
- Use `.env.example` files to document required variables

---

## 🆘 Need Help?

Check the detailed guide: `BACKEND_DEPLOYMENT_GUIDE.md`
