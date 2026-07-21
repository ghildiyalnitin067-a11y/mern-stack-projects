import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { isConnectedToMongo, localDB } from '../db.js'

const UserSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substring(2, 11) },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  isSuspended: { type: Boolean, default: false }
}, { timestamps: true })

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.index({ role: 1 })

const MongoUser = mongoose.model('User', UserSchema)

const generateId = () => Math.random().toString(36).substring(2, 11)

const db = localDB.data
if (!db.users) {
  db.users = []
  localDB.save()
}
if (db.users.length === 0) {
  db.users.push({
    _id: 'u_admin',
    name: 'Super Admin',
    email: 'admin@tasktusk.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    phone: '+91 99999 88888',
    address: 'TaskTusk Operations Hub, New Delhi',
    isSuspended: false
  })
  db.users.push({
    _id: 'c1',
    name: 'Rahul Verma',
    email: 'rahul@gmail.com',
    password: bcrypt.hashSync('customer123', 10),
    role: 'customer',
    phone: '+91 99887 76655',
    address: 'Flat 101, HSR Layout, Bengaluru',
    isSuspended: false
  })
  db.users.push({
    _id: 'p1',
    name: 'Rajesh Kumar',
    email: 'rajesh@gmail.com',
    password: bcrypt.hashSync('provider123', 10),
    role: 'provider',
    phone: '+91 98765 43210',
    address: 'Flat 402, Sector 12, Dwarka, New Delhi',
    rating: 5.0,
    reviewsCount: 0,
    isSuspended: false
  })
  db.users.push({
    _id: 'p2',
    name: 'Sunita Sharma',
    email: 'sunita@gmail.com',
    password: bcrypt.hashSync('provider123', 10),
    role: 'provider',
    phone: '+91 87654 32109',
    address: 'Green Park Ext, Andheri West, Mumbai',
    rating: 5.0,
    reviewsCount: 0,
    isSuspended: false
  })
  localDB.save()
}

MongoUser.estimatedDocumentCount().then(count => {
  if (count === 0) {
    console.log('Seeding initial MongoDB users collection...')
    MongoUser.create([
      {
        _id: 'u_admin',
        name: 'Super Admin',
        email: 'admin@tasktusk.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91 99999 88888',
        address: 'TaskTusk Operations Hub, New Delhi',
        isSuspended: false
      },
      {
        _id: 'c1',
        name: 'Rahul Verma',
        email: 'rahul@gmail.com',
        password: 'customer123',
        role: 'customer',
        phone: '+91 99887 76655',
        address: 'Flat 101, HSR Layout, Bengaluru',
        isSuspended: false
      },
      {
        _id: 'p1',
        name: 'Rajesh Kumar',
        email: 'rajesh@gmail.com',
        password: 'provider123',
        role: 'provider',
        phone: '+91 98765 43210',
        address: 'Flat 402, Sector 12, Dwarka, New Delhi',
        rating: 5.0,
        reviewsCount: 0,
        isSuspended: false
      },
      {
        _id: 'p2',
        name: 'Sunita Sharma',
        email: 'sunita@gmail.com',
        password: 'provider123',
        role: 'provider',
        phone: '+91 87654 32109',
        address: 'Green Park Ext, Andheri West, Mumbai',
        rating: 5.0,
        reviewsCount: 0,
        isSuspended: false
      }
    ]).then(() => {
      console.log('Initial MongoDB users collection seeded successfully!')
    }).catch(err => {
      console.error('Error seeding MongoDB users:', err)
    })
  }
}).catch(err => {
  console.error('Error getting MongoDB document count:', err)
})

export const User = {
  find: async (query = {}) => {
    if (isConnectedToMongo) return await MongoUser.find(query).select('-password').lean()
    return localDB.getCollection('users').map(({ password, ...u }) => u)
  },
  findById: async (id) => {
    if (isConnectedToMongo) return await MongoUser.findById(id).select('-password').lean()
    const u = localDB.getCollection('users').find(u => u._id === id)
    if (!u) return null
    const { password, ...safeUser } = u
    return safeUser
  },
  findOne: async (query = {}) => {
    if (isConnectedToMongo) {
      if (query.selectPassword) {
        return await MongoUser.findOne({ email: query.email }).lean()
      }
      return await MongoUser.findOne(query).select('-password').lean()
    }
    const users = localDB.getCollection('users')
    const u = users.find(user => {
      if (query.email && user.email !== query.email) return false
      if (query._id && user._id !== query._id) return false
      return true
    })
    return u || null
  },
  create: async (data) => {
    if (isConnectedToMongo) {
      const doc = await MongoUser.create(data)
      const obj = doc.toObject()
      delete obj.password
      return obj
    }
    const salt = bcrypt.genSaltSync(10)
    const newUser = {
      _id: generateId(),
      phone: '',
      address: '',
      isSuspended: false,
      ...data,
      password: bcrypt.hashSync(data.password, salt)
    }
    const list = localDB.getCollection('users')
    list.push(newUser)
    localDB.setCollection('users', list)
    const { password, ...safeUser } = newUser
    return safeUser
  },
  findByIdAndUpdate: async (id, update) => {
    if (isConnectedToMongo) return await MongoUser.findByIdAndUpdate(id, update, { new: true }).select('-password').lean()
    const list = localDB.getCollection('users')
    const idx = list.findIndex(u => u._id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...update }
    localDB.setCollection('users', list)
    const { password, ...safeUser } = list[idx]
    return safeUser
  }
}
