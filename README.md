# ChatHub - Live Support Chat Application

A modern, real-time live chat support system built with React, Node.js, Express, MongoDB, and Socket.io. Designed for businesses to provide instant customer support with admin-only access and guest chat capabilities.

![ChatHub](https://img.shields.io/badge/ChatHub-Live%20Chat-teal)
![React](https://img.shields.io/badge/Frontend-React%2BVite-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js%2BExpress-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Admin Management](#admin-management)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## ✨ Features

### 🔐 Admin Features
- **Secure Login** - Email & password authentication with verification
- **Password Reset** - Secure password reset via email with OTP codes
- **Real-Time Chat** - Instant messaging with guests using Socket.io
- **Conversation Management** - View all active and historical conversations
- **File Sharing** - Send and receive images and documents
- **Online Status** - Real-time admin availability indicator
- **Multi-Admin Support** - Multiple admins can chat simultaneously
- **Email Notifications** - Receive notifications for new messages

### 👥 Guest Features
- **No Registration Required** - Start chatting immediately
- **Anonymous Conversations** - Chat with admins without account creation
- **Real-Time Messaging** - Instant message delivery
- **File Uploads** - Share images and documents
- **Conversation History** - Access to past messages in same session

### 🎨 Design
- **WhatsApp-Inspired UI** - Modern, familiar design pattern
- **Responsive Layout** - Mobile, tablet, and desktop support
- **Smooth Animations** - 11+ CSS animations and transitions
- **Dark/Light Themes** - Professional gradient color scheme
- **Professional Branding** - ChatHub logo and UI elements

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **CSS3** - Animations and responsive design
- **ES6+ JavaScript** - Modern JavaScript features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Database ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - File storage

### DevOps
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Cloud database
- **GitHub** - Version control
- **Environment Variables** - Configuration management

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│           ChatHub Application                       │
├─────────────────┬──────────────────────────────────┤
│   Frontend      │        Backend                    │
│   (Vercel)      │        (Vercel Serverless)       │
├─────────────────┼──────────────────────────────────┤
│ React + Vite    │ Express.js + Socket.io            │
│ Port: 5173      │ Port: 3000                        │
│ Localhost Dev   │ Localhost Dev                     │
│                 │                                   │
│ Components:     │ Routes:                           │
│ - AdminLogin    │ - POST /api/v1/admin/signIn      │
│ - LiveChatAdmin │ - PUT /api/v1/admin/verify      │
│ - LiveChatGuest │ - POST /api/v1/admin/forgotPass │
│ - ForgotPass    │ - PUT /api/v1/admin/resetPass   │
│                 │ - Socket Events                   │
│                 │                                   │
│ Socket Events:  │ Database:                         │
│ - admin-join    │ - MongoDB Atlas                   │
│ - new-message   │ - Admin Collection                │
│ - admin-message │ - Conversation Collection         │
│ - file-upload   │ - Message Collection              │
│                 │ - Guest Collection                │
└─────────────────┴──────────────────────────────────┘
         │                │
         └────────────────┘
        Socket.io Connection
```

---

## 📦 Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** (Local or Atlas Cloud Account)
- **Git** for version control
- **Vercel Account** for deployment (optional)
- **GitHub Account** for repository hosting

---

## 🚀 Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/chat-support.git
cd Chat-Support
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### Step 3: Create Environment Files

**Server `.env`:**
```bash
cp server/.env.example server/.env
```

**Client `.env`:**
```bash
cp client/.env.example client/.env
```

---

## ⚙️ Configuration

### Backend Configuration (`server/.env`)

```dotenv
# Server Port
PORT=3000

# Database (Choose one)
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/Chat-support

# MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ChatSupport?retryWrites=true&w=majority

# JWT Secret
JWT_KEY=your-secret-jwt-key

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# CORS Configuration
CORS_ORIGIN=http://localhost:5173        # Development
# CORS_ORIGIN=https://yourdomain.com     # Production

# Environment
NODE_ENV=development
# NODE_ENV=production

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend Configuration (`client/.env`)

```dotenv
# Development
VITE_API_URL=http://localhost:3000/api/v1/admin
VITE_SERVER_URL=http://localhost:3000

# Production
# VITE_API_URL=https://your-backend-url.com/api/v1/admin
# VITE_SERVER_URL=https://your-backend-url.com
```

---

## 💻 Running Locally

### Terminal 1: MongoDB
```bash
mongod
# Output: waiting for connections on port 27017
```

### Terminal 2: Backend Server
```bash
cd server
npm start
# Output: Example app listening on port 3000!
```

### Terminal 3: Frontend Application
```bash
cd client
npm run dev
# Output: Local: http://localhost:5173
```

### Step 4: Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api/v1

---

## 🚀 Deployment

### Deploy Frontend on Vercel

#### Step 1: Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Create new project

#### Step 2: Import Project from GitHub
```bash
# Connect your GitHub repository
# Select Chat-Support repository
# Vercel will auto-detect Vite configuration
```

#### Step 3: Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-url.com/api/v1/admin
VITE_SERVER_URL=https://your-backend-url.com
```

#### Step 4: Deploy
```bash
# Automatic deployment on git push
# Or manually in Vercel Dashboard
```

### Deploy Backend on Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# In server directory
cd server
vercel

# Follow prompts and deploy
```

#### Option B: Manual Git Deployment
```bash
# Set production environment
git push origin main
# Vercel auto-deploys on push
```

### Deploy Database (MongoDB Atlas)

#### Step 1: Create MongoDB Atlas Account
- Go to [mongodb.com](https://www.mongodb.com/cloud/atlas)
- Create free tier cluster

#### Step 2: Get Connection String
- Atlas Dashboard → Connect
- Copy connection string
- Update in `server/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ChatSupport?retryWrites=true&w=majority
```

#### Step 3: Whitelist IPs
- Network Access → Add IP Address
- For development: `0.0.0.0/0` (Allow all)
- For production: Add Vercel IPs

---

## 👨‍💼 Admin Management

### Add New Admin
```bash
node admin-cli.js add email@example.com "Password123!" "Admin Name"
```

### List All Admins
```bash
node admin-cli.js list
```

### Remove Admin
```bash
node admin-cli.js remove email@example.com
```

### Password Requirements
- Minimum 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character (#?!@$%^&*-)

---

## 🔌 API Endpoints

### Admin Routes (`/api/v1/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signIn` | Admin login |
| PUT | `/verify` | Verify email with OTP |
| POST | `/forgotPassword` | Request password reset |
| PUT | `/resetPassword` | Reset password with code |

### Conversation Routes (`/api/v1/conversations`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/history` | Get admin conversations |
| GET | `/messages/:id` | Get conversation messages |

### File Routes (`/api/v1/files`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload file to Cloudinary |

### Socket Events

**Client → Server:**
- `admin-join` - Admin connects
- `admin-message` - Send admin message
- `conversation-read` - Mark conversation as read

**Server → Client:**
- `new-message` - Receive new message
- `admin-response` - Admin replied
- `conversation-read` - Conversation marked read

---

## 📁 Project Structure

```
Chat-Support/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── AdminLogin.jsx          # Login page
│   │   ├── ForgotPassword.jsx      # Password reset
│   │   ├── LiveChatAdmin.jsx       # Admin chat interface
│   │   ├── LiveChatGuest.jsx       # Guest chat interface
│   │   ├── App.jsx                 # Main app component
│   │   ├── socket.js               # Socket.io configuration
│   │   ├── AdminLogin.css          # Login styles
│   │   ├── LiveChatAdmin.css       # Admin chat styles
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # Entry point
│   ├── public/                      # Static assets
│   ├── .env                         # Environment variables
│   ├── .env.example                # Example env file
│   ├── vite.config.js              # Vite configuration
│   ├── package.json                # Dependencies
│   └── index.html                  # HTML template
│
├── server/                         # Backend (Node.js + Express)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── admin/             # Admin module
│   │   │   ├── conversation/      # Chat conversations
│   │   │   └── file/              # File upload
│   │   ├── middleware/            # Express middleware
│   │   ├── sockets/               # Socket.io events
│   │   ├── email/                 # Email service
│   │   └── utils/                 # Utilities
│   ├── db/
│   │   ├── dbConnection.js        # MongoDB connection
│   │   └── models/                # Mongoose schemas
│   ├── .env                       # Environment variables
│   ├── .env.example              # Example env file
│   ├── index.js                  # Server entry point
│   ├── admin-cli.js              # Admin management CLI
│   ├── package.json              # Dependencies
│   └── start-server.bat          # Windows batch script
│
├── .gitignore                    # Git ignore patterns
├── vercel.json                   # Vercel deployment config
└── README.md                     # This file
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB
```bash
mongod
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update `CORS_ORIGIN` in `server/.env`

### Email Not Sending
**Solution:** Check Gmail settings
- Enable 2FA
- Generate App Password
- Update `EMAIL_PASSWORD` in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:** Kill process on port
```bash
lsof -i :3000          # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Vercel Deployment Failed
**Solution:** Check
1. Environment variables are set
2. MongoDB whitelist includes Vercel IPs
3. `vercel.json` is properly configured

---

## 📝 Environment Variables Reference

### Required for Deployment
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - Database connection string
- `JWT_KEY` - Secret for JWT tokens
- `EMAIL_USER` - Email address
- `EMAIL_PASSWORD` - App password
- `CORS_ORIGIN` - Allowed origin URL
- `CLOUDINARY_*` - File storage credentials

### Optional (Development)
- `NODE_ENV` - development/production
- `VITE_API_URL` - Frontend API URL

---

## 🔒 Security Notes

1. **Never commit `.env` files** - Use `.gitignore`
2. **Use strong passwords** - Min 8 chars with special characters
3. **Whitelist MongoDB IPs** - Restrict access to known IPs only
4. **Validate all inputs** - Server-side validation required
5. **Use HTTPS** - Always use HTTPS in production
6. **Rotate secrets regularly** - Change JWT_KEY and passwords periodically

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [Socket.io Tutorial](https://socket.io/docs/)
- [MongoDB University](https://university.mongodb.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Support

For issues, questions, or suggestions:
- Open a GitHub Issue
- Contact: [support@chathub.dev]
- Documentation: Check `/docs` folder

---

## 🎯 Roadmap

- [ ] Mobile native apps (React Native)
- [ ] Video call integration
- [ ] Chatbot AI responses
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Advanced file encryption

---

**Made with ❤️ by ChatHub Team**

Last Updated: February 2026
