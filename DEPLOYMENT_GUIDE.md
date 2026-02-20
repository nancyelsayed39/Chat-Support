# ChatHub Deployment Guide

Complete step-by-step instructions for deploying ChatHub to GitHub and Vercel.

---

## 📋 Prerequisites

- GitHub Account (https://github.com)
- Vercel Account (https://vercel.com) - Sign up with GitHub
- MongoDB Atlas Account (https://www.mongodb.com/cloud/atlas)
- Cloudinary Account (https://cloudinary.com) - for file uploads
- Gmail Account with App Password

---

## Phase 1: GitHub Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `chat-support` (or your preferred name)
3. **Description:** "Real-time live chat support system"
4. **Visibility:** Public (for open-source) or Private
5. **Initialize:** Don't add README (we have one)
6. Click **Create repository**

### Step 2: Initialize Local Git

In your project root directory:

```bash
# Initialize git
git init

# Add all files (except .env and node_modules)
git add .

# Create initial commit
git commit -m "Initial commit: ChatHub live chat application"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/chat-support.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Verify on GitHub

- Go to your repository: https://github.com/YOUR_USERNAME/chat-support
- Verify all files are uploaded
- Check that `.env` files are NOT included

---

## Phase 2: MongoDB Atlas Setup

### Step 1: Create MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click **Create** → **Build a Database**
4. Choose **Free** tier
5. **Cloud Provider:** AWS
6. **Region:** Choose closest to your users
7. **Cluster Name:** `chat-support`
8. Click **Create**

### Step 2: Create Database User

1. **Security** → **Database Access**
2. Click **Add New Database User**
3. **Username:** `admin`
4. **Password:** Generate strong password (save it!)
5. **Database Privileges:** Read and write to any database
6. Click **Add User**

### Step 3: Whitelist IPs

1. **Security** → **Network Access**
2. Click **Add IP Address**
3. **For Development:** Select **Allow access from anywhere** (0.0.0.0/0)
4. **For Production:** Add Vercel's IP range (Vercel will provide)
5. Click **Confirm**

### Step 4: Get Connection String

1. **Clusters** → Click **Connect**
2. Choose **Connect your application**
3. **Driver:** Node.js, **Version:** 4.1+
4. Copy the connection string

**Example:**
```
mongodb+srv://admin:PASSWORD@cluster0.mongodb.net/ChatSupport?retryWrites=true&w=majority
```

Replace:
- `PASSWORD` with your actual password
- Keep database name as `ChatSupport`

---

## Phase 3: Cloudinary Setup

### Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com
2. Sign up (free tier includes 25GB storage)
3. Verify email

### Step 2: Get API Credentials

1. Go to **Settings** → **API Keys**
2. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

Save these for later!

---

## Phase 4: Vercel Frontend Deployment

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. Select your repository: `chat-support`
5. Click **Import**

### Step 2: Configure Project

1. **Framework:** Vite (auto-detected)
2. **Root Directory:** `./client`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`

Click **Continue**

### Step 3: Set Environment Variables

Add the following environment variables:

```
VITE_API_URL = https://your-backend-url.com/api/v1/admin
VITE_SERVER_URL = https://your-backend-url.com
```

(Backend URL will be updated after backend deployment)

### Step 4: Deploy

1. Click **Deploy**
2. Wait for deployment to complete
3. You'll get a URL like: `https://chat-support.vercel.app`
4. Your frontend is now live! 🎉

---

## Phase 5: Vercel Backend Deployment

### Step 1: Prepare Backend

1. Ensure `server/vercel.json` exists
2. Ensure `server/package.json` has:
   ```json
   {
     "scripts": {
       "start": "node index.js"
     }
   }
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import same GitHub repository
3. **Root Directory:** `./server`
4. **Build Command:** `npm install`
5. **Output Directory:** `dist` (or leave empty)

Click **Deploy**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Go to server directory
cd server

# Deploy
vercel --prod

# Follow prompts
```

### Step 3: Set Backend Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.mongodb.net/ChatSupport?retryWrites=true&w=majority
JWT_KEY=your-super-secret-jwt-key-change-this
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CORS_ORIGIN=https://chat-support.vercel.app
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 4: Deploy with Environment Variables

After setting environment variables:
1. Click **Deployments**
2. Select latest deployment
3. Click **Redeploy**

Your backend is now live! ✅

---

## Phase 6: Update Frontend with Backend URL

### Step 1: Get Backend URL

Your Vercel backend URL will be something like:
```
https://chat-support-api.vercel.app
```

### Step 2: Update Frontend Environment

1. Go to Vercel Dashboard
2. Select your frontend project
3. **Settings** → **Environment Variables**
4. Update:
   ```
   VITE_API_URL=https://chat-support-api.vercel.app/api/v1/admin
   VITE_SERVER_URL=https://chat-support-api.vercel.app
   ```

### Step 3: Redeploy Frontend

1. Go to **Deployments**
2. Click **Redeploy** on latest deployment
3. Wait for deployment to complete

---

## Phase 7: Production Verification

### Test Frontend
1. Go to https://chat-support.vercel.app
2. Try to login with admin credentials
3. Verify chat functionality

### Test Email Notifications
1. Request password reset
2. Check if email is received
3. Complete password reset flow

### Test File Upload
1. In chat, try uploading an image
2. Verify it appears correctly

### Monitor Logs
- Frontend: Vercel Dashboard → Deployments → Logs
- Backend: Vercel Dashboard → Deployments → Logs

---

## 🔒 Security Checklist for Production

- [ ] All environment variables are set (no hardcoded secrets)
- [ ] MongoDB is using strong password
- [ ] IP whitelisting is configured
- [ ] HTTPS is enforced
- [ ] CORS is restricted to your domain
- [ ] JWT_KEY is changed from default
- [ ] Email password is app-specific, not main password
- [ ] Cloudinary API secret is protected
- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in README or comments

---

## 📊 Post-Deployment

### Setup Monitoring

**Vercel Analytics:**
- Vercel Dashboard → Analytics
- Monitor request counts, performance

**MongoDB Atlas:**
- Dashboard → Network Activity
- Monitor connections and data usage

### Scaling

If you need more resources:

**Frontend:**
- Vercel handles auto-scaling for free tier

**Backend:**
- Vercel scales automatically for serverless functions
- Upgrade if needed for higher concurrency

**Database:**
- MongoDB Atlas free tier: 512MB shared cluster
- Upgrade to dedicated cluster if exceeding storage

---

## 🐛 Common Deployment Issues

### Issue: CORS Error in Production
**Solution:** Update `CORS_ORIGIN` in backend environment variables to your frontend URL

### Issue: Email Not Sending
**Solution:** 
1. Verify Gmail 2FA is enabled
2. Generate app-specific password
3. Update `EMAIL_PASSWORD` in backend

### Issue: Vercel Backend Timeout
**Solution:** Backend functions have 10-60 second limit
- Optimize database queries
- Move long operations to background jobs

### Issue: MongoDB Connection Fails
**Solution:**
1. Verify IP is whitelisted
2. Check connection string spelling
3. Verify username/password

---

## 🚀 CI/CD Pipeline

### Automatic Deployment

Once set up, every push to `main` branch automatically:
1. Triggers GitHub Actions (or Vercel CI)
2. Runs tests (if configured)
3. Builds project
4. Deploys to Vercel

### Manual Deployment

To manually redeploy:
1. Vercel Dashboard → Deployments
2. Click **Redeploy** next to desired deployment
3. Or push a new commit to trigger CI/CD

---

## 📝 Maintenance

### Monthly Tasks
- [ ] Review MongoDB usage
- [ ] Check error logs
- [ ] Update dependencies: `npm update`

### Quarterly Tasks
- [ ] Backup MongoDB data
- [ ] Rotate JWT_KEY
- [ ] Review security settings
- [ ] Update packages to latest major versions

---

## 🎯 Next Steps

1. ✅ Deploy to GitHub
2. ✅ Deploy to Vercel (Frontend & Backend)
3. ✅ Configure MongoDB Atlas
4. ✅ Add admin users via CLI
5. ✅ Test in production
6. 📣 Share with customers!

---

## 📞 Support & Troubleshooting

**GitHub Issues:** https://github.com/YOUR_USERNAME/chat-support/issues
**Vercel Docs:** https://vercel.com/docs
**MongoDB Atlas:** https://docs.atlas.mongodb.com/

---

**Happy Deploying! 🚀**

Last Updated: February 2026
