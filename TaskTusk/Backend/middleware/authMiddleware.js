import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const getJwtSecret = () => process.env.JWT_SECRET || 'tasktusk_dev_secret_key_change_in_production_2026'

export const protect = async (req, res, next) => {
  let token

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, login required' })
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'User associated with token not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('JWT Verification Error:', error.message)
    return res.status(401).json({ error: 'Session expired or invalid token' })
  }
}
