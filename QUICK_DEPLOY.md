# Quick Start: GitHub & Vercel Deployment

Fast-track to get ChatHub live on GitHub and Vercel!

---

## ⚡ 5-Minute Quick Start

### Prerequisites
- GitHub Account
- Vercel Account (sign up with GitHub)
- MongoDB Atlas Account (free tier)

---

## Step 1: Push to GitHub (2 minutes)

```powershell
# From Chat-Support directory
cd d:\Nancy\full stack\back\projects\Chat-Support

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: ChatHub live chat"

# Create repo on github.com/new first, then:
git remote add origin https://github.com/YOUR_USERNAME/chat-support.git
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## Step 2: MongoDB Atlas (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create user: username=`admin`
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string and copy it

Save this:
```
mongodb+srv://admin:PASSWORD@cluster.mongodb.net/ChatSupport?retryWrites=true&w=majority
```

---

## Step 3: Deploy Frontend on Vercel (1 minute)

1. Go to https://vercel.com/new
2. **Import GitHub repo** → Select `chat-support`
3. **Root Directory:** `./client`
4. **Deploy**

📌 **Save your Frontend URL:** `https://your-app.vercel.app`

---

## Step 4: Deploy Backend on Vercel (1 minute)

1. https://vercel.com → **Add New Project**
2. Import same repo
3. **Root Directory:** `./server`
4. **Deploy**

📌 **Save your Backend URL:** `https://your-api.vercel.app`

---

## Step 5: Configure Environment Variables (2 minutes)

### Backend (Vercel Dashboard)

Go to **Backend Project → Settings → Environment Variables**

Add:
```
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/ChatSupport?retryWrites=true&w=majority
JWT_KEY=super-secret-key-change-me
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CORS_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

**Redeploy** after adding variables

### Frontend (Vercel Dashboard)

Go to **Frontend Project → Settings → Environment Variables**

Add:
```
VITE_API_URL=https://your-api.vercel.app/api/v1/admin
VITE_SERVER_URL=https://your-api.vercel.app
```

**Redeploy** after adding variables

---

## Step 6: Add Admin Users

From your local machine:

```powershell
cd d:\Nancy\full stack\back\projects\Chat-Support\server

# Make sure MongoDB is running locally: mongod

# Add admin
node admin-cli.js add admin@company.com "Admin@123!" "Admin Name"
```

---

## ✅ Done!

Your live chat app is now live! 🎉

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-api.vercel.app
- **Code:** https://github.com/YOUR_USERNAME/chat-support

---

## 🔗 Next: Share Links

```
# For customers
- Chat URL: https://your-app.vercel.app
- Admin Login: https://your-app.vercel.app/#/adminlogin

# For developers
- GitHub: https://github.com/YOUR_USERNAME/chat-support
- Backend API: https://your-api.vercel.app/api/v1
```

---

## 🐛 Troubleshooting

**Not working?** Check:
1. MongoDB connection string is correct
2. All environment variables are set
3. CORS_ORIGIN matches frontend URL
4. Email credentials are valid
5. Cloudinary API keys are correct

**Need help?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Questions?** Check the full README.md for detailed information!
