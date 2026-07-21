import mongoose from 'mongoose'
import { isConnectedToMongo, localDB } from '../db.js'

const BookingSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substring(2, 11) },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  providerId: { type: String, required: true },
  providerName: { type: String, required: true },
  providerProfession: { type: String, required: true },
  serviceId: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  adminFee: { type: Number, default: 0 },
  providerEarnings: { type: Number, default: 0 },
  notificationStatus: { type: String, enum: ['unread', 'read'], default: 'unread' }
}, { timestamps: true })

BookingSchema.index({ customerId: 1 })
BookingSchema.index({ providerId: 1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ paymentStatus: 1 })

const MongoBooking = mongoose.model('Booking', BookingSchema)

const generateId = () => Math.random().toString(36).substring(2, 11)

const db = localDB.data
if (!db.bookings) {
  db.bookings = []
  localDB.save()
}

export const Booking = {
  find: async (query = {}) => {
    if (isConnectedToMongo) return await MongoBooking.find(query).sort({ createdAt: -1 }).lean()
    let list = localDB.getCollection('bookings')
    if (query.providerId) {
      list = list.filter(b => b.providerId === query.providerId)
    }
    if (query.customerId) {
      list = list.filter(b => b.customerId === query.customerId)
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },
  findById: async (id) => {
    if (isConnectedToMongo) return await MongoBooking.findById(id).lean()
    return localDB.getCollection('bookings').find(b => b._id === id) || null
  },
  create: async (data) => {
    if (isConnectedToMongo) {
      const doc = await MongoBooking.create(data)
      return doc.toObject()
    }
    const newItem = {
      _id: generateId(),
      status: 'pending',
      paymentStatus: 'pending',
      notificationStatus: 'unread',
      createdAt: new Date().toISOString(),
      ...data
    }
    const list = localDB.getCollection('bookings')
    list.unshift(newItem)
    localDB.setCollection('bookings', list)
    return newItem
  },
  findByIdAndUpdate: async (id, update) => {
    if (isConnectedToMongo) return await MongoBooking.findByIdAndUpdate(id, update, { new: true }).lean()
    const list = localDB.getCollection('bookings')
    const idx = list.findIndex(b => b._id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...update }
    localDB.setCollection('bookings', list)
    return list[idx]
  },
  updateMany: async (query, update) => {
    if (isConnectedToMongo) return await MongoBooking.updateMany(query, update)
    const list = localDB.getCollection('bookings')
    let count = 0
    const updated = list.map(b => {
      let match = true
      for (let k in query) {
        if (b[k] !== query[k]) match = false
      }
      if (match) {
        count++
        return { ...b, ...update }
      }
      return b
    })
    localDB.setCollection('bookings', updated)
    return { modifiedCount: count }
  }
}
