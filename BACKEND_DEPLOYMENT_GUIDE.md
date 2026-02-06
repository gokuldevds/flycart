# FlyCart Backend Deployment Guide

## 🚀 Deploying Backend to Render

### Prerequisites
- [ ] GitHub repository with your code pushed
- [ ] MongoDB Atlas account (for database)
- [ ] Render account (render.com)

---

## Step 1: Prepare MongoDB Database

1. **Go to MongoDB Atlas** (https://cloud.mongodb.com)
2. **Create a cluster** (if you don't have one)
3. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/flycart?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual database password
   - Replace `myFirstDatabase` with `flycart` (or your preferred database name)

4. **Whitelist Render's IP addresses**:
   - In MongoDB Atlas, go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) - **Recommended for Render**
   - Click "Confirm"

---

## Step 2: Push Code to GitHub

Make sure your backend code is in your GitHub repository:

```bash
# Navigate to your project root
cd "c:\Users\Gokul Dev D S\OneDrive\Desktop\FlyCart"

# Add all changes
git add .

# Commit changes
git commit -m "Prepare backend for deployment"

# Push to GitHub
git push origin main
```

---

## Step 3: Deploy Backend on Render

### 3.1 Create New Web Service

1. **Go to Render Dashboard** (https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:

   - **Name**: `flycart-backend` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (for testing)

### 3.2 Add Environment Variables

In the "Environment" section, add these variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB connection string from Step 1 |
| `JWT_SECRET` | A random secure string (e.g., `your-super-secret-jwt-key-12345`) |
| `NODE_ENV` | `production` |
| `PORT` | `5000` (Render will override this automatically) |

**Example JWT_SECRET**: You can generate one using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://flycart-backend.onrender.com`

---

## Step 4: Test Your Backend

Test your deployed backend API:

1. **Open your backend URL** in a browser:
   ```
   https://flycart-backend.onrender.com
   ```
   You should see: "FlyCart API is running..."

2. **Test the products endpoint**:
   ```
   https://flycart-backend.onrender.com/api/products
   ```
   Should return an empty array `[]` or your products

---

## Step 5: Update Frontend to Use Backend

Now update your frontend to point to the deployed backend:

1. **Find your frontend environment configuration** (usually in `client/.env` or similar)
2. **Update the API URL**:
   ```env
   VITE_API_URL=https://flycart-backend.onrender.com
   ```
   Or if using React without Vite:
   ```env
   REACT_APP_API_URL=https://flycart-backend.onrender.com
   ```

3. **Redeploy your frontend** on Render with the new environment variable

---

## Step 6: Configure CORS (if needed)

If you get CORS errors, update your backend's CORS configuration in `server/index.js`:

```javascript
app.use(cors({
    origin: 'https://your-frontend-url.onrender.com', // Your frontend URL
    credentials: true
}));
```

---

## 🎉 Deployment Complete!

Your backend should now be live at: `https://flycart-backend.onrender.com`

### Important Notes:

- **Free tier sleeps after 15 minutes of inactivity** - First request may take 30-60 seconds
- **Monitor your logs** in Render dashboard for any errors
- **Keep your JWT_SECRET secure** - never commit it to GitHub

---

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct

### CORS errors
- Add your frontend URL to CORS configuration
- Ensure credentials are properly configured

### Database connection fails
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string format
- Ensure database user has correct permissions

---

## Alternative: Deploy to Other Platforms

### Heroku
- Similar process, use Heroku CLI
- Add MongoDB connection string to Config Vars

### Railway
- Connect GitHub repository
- Set environment variables
- Deploy automatically

### Vercel (for serverless)
- Requires converting to serverless functions
- Not recommended for this Express app

---

## Need Help?

If you encounter issues:
1. Check Render logs for error messages
2. Verify all environment variables
3. Test MongoDB connection separately
4. Check if your GitHub repository is up to date
