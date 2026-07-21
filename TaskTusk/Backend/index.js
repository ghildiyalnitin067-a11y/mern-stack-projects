import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { connectDB } from './db.js'
import authRoutes from './routes/authRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import providerRoutes from './routes/providerRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

import { createServer } from 'http'
import { initSocket } from './socket.js'

dotenv.config()

connectDB()

const app = express()
app.set('trust proxy', 1)
const PORT = process.env.PORT || 5000

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again after 15 minutes' }
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
})

const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']

const cleanUrl = (url) => {
  if (!url) return []
  return url
    .split(',')
    .map(val => val.trim().replace(/\/$/, ''))
    .filter(Boolean)
}

const customOrigins = cleanUrl(process.env.CLIENT_URL)
const adminOrigins = cleanUrl(process.env.ADMIN_URL)

const allowedOrigins = [...defaultOrigins, ...customOrigins, ...adminOrigins]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      return callback(null, true)
    }

    const normalizedOrigin = origin.trim().replace(/\/$/, '')

    // Check if origin matches allowed list, local development, or any Vercel deployment
    const isAllowed = allowedOrigins.includes(normalizedOrigin) ||
                      normalizedOrigin.endsWith('.vercel.app') ||
                      /^http:\/\/localhost:\d+$/.test(normalizedOrigin) ||
                      /^http:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin)

    if (isAllowed) {
      callback(null, true)
    } else {
      console.warn(`[CORS Blocked] Request from origin: ${origin}. If this is expected, please add it to CLIENT_URL or ADMIN_URL environment variables.`)
      callback(null, false)
    }
  },
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.use('/api', apiLimiter)
app.use('/api/auth', authLimiter)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TaskTusk API is running smoothly',
    timestamp: new Date()
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api/provider', providerRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)

app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR HANDLER]', err.stack || err.message || err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  })
})

const server = createServer(app)
initSocket(server)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
