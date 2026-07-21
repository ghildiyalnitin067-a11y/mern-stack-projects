import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'

const getJwtSecret = () => process.env.JWT_SECRET || 'tasktusk_dev_secret_key_change_in_production_2026'

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
})

const isValidEmail = (email) => {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required registration parameters' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' })
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    if (!['customer', 'provider'].includes(role)) {
      return res.status(400).json({ error: 'Invalid account role specification' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' })
    }

    const user = await User.create({
      name, email, password, role, phone: phone || '', address: address || ''
    })

    const token = jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), { expiresIn: '7d' })

    res.cookie('token', token, getCookieOptions())

    res.status(201).json({ user })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed: ' + error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' })
    }

    const user = await User.findOne({ email, selectPassword: true })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: 'This account has been suspended by an administrator' })
    }

    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), { expiresIn: '7d' })

    res.cookie('token', token, getCookieOptions())

    const { password: _, ...safeUser } = user
    res.json({ user: safeUser })
  } catch (error) {
    res.status(500).json({ error: 'Login failed: ' + error.message })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token', getCookieOptions())
  res.json({ message: 'Logged out successfully' })
}

export const getMe = (req, res) => {
  res.json({ user: req.user })
}
