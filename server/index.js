import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { dbConnection } from "./db/dbConnection.js"
import { Server } from "socket.io"
import adminRouter from "./src/modules/admin/admin.routes.js"
import fileRouter from "./src/modules/file/file.routes.js"
import conversationRouter from "./src/modules/conversation/conversation.routes.js"
import { globalError } from "./src/middleware/globalError.js"
import { AppError } from "./src/utils/appError.js"
import { initSocket } from "./src/sockets/chat.socket.js"

// Load environment variables from .env file
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

dbConnection()

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "token"]
}))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// API Routes
app.use('/api/v1/admin' , adminRouter)
app.use('/api/v1/files' , fileRouter)
app.use('/api/v1/conversations' , conversationRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' })
})

// 404 handler for undefined routes
app.use((req,res,next)=>{
    next(new AppError(`route not found ${req.originalUrl}`,404))
})

app.use(globalError)

let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

export const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "token"]
  }
});

initSocket(io);
