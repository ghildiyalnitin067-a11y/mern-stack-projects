import { Server } from 'socket.io'

let io

export const initSocket = (server) => {
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
  const customOrigin = process.env.CLIENT_URL
  const allowedOrigins = customOrigin ? [...defaultOrigins, customOrigin] : defaultOrigins

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
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
