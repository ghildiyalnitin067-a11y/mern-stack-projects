import { Server } from 'socket.io'

let io

export const initSocket = (server) => {
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

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true)
        }

        const normalizedOrigin = origin.trim().replace(/\/$/, '')

        const isAllowed = allowedOrigins.includes(normalizedOrigin) ||
                          normalizedOrigin.endsWith('.vercel.app') ||
                          /^http:\/\/localhost:\d+$/.test(normalizedOrigin) ||
                          /^http:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin)

        if (isAllowed) {
          callback(null, true)
        } else {
          callback(null, false)
        }
      },
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)


    socket.on('join', (userId) => {
      socket.join(userId)
      console.log(`Socket ${socket.id} joined room ${userId}`)
    })

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {

    return {
      to: () => ({
        emit: () => {}
      })
    }
  }
  return io
}
