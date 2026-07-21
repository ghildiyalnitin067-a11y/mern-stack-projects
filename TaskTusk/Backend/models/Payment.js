import mongoose from 'mongoose'
import { isConnectedToMongo, localDB } from '../db.js'

const PaymentSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substring(2, 11) },
  bookingId: { type: String, ref: 'Booking', required: true },
  customerId: { type: String, ref: 'User', required: true },
  providerId: { type: String, ref: 'User', required: true },
  totalAmount: { type: Number, required: true },
  platformFeeAmount: { type: Number, required: true },
  providerPayoutAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  method: { type: String, default: 'mock' }
}, { timestamps: true })

PaymentSchema.index({ bookingId: 1 })
PaymentSchema.index({ customerId: 1 })
PaymentSchema.index({ providerId: 1 })
PaymentSchema.index({ status: 1 })

const MongoPayment = mongoose.model('Payment', PaymentSchema)

const generateId = () => Math.random().toString(36).substring(2, 11)

const db = localDB.data
if (!db.payments) {
  db.payments = []
  localDB.save()
}

export const Payment = {
  find: async (query = {}) => {
    if (isConnectedToMongo) return await MongoPayment.find(query).lean()
    let list = localDB.getCollection('payments')
    for (let key in query) {
      list = list.filter(p => p[key] === query[key])
    }
    return list
  },
  findOne: async (query = {}) => {
    if (isConnectedToMongo) return await MongoPayment.findOne(query).lean()
    const list = localDB.getCollection('payments')
    return list.find(p => {
      for (let key in query) {
        if (p[key] !== query[key]) return false
      }
      return true
    }) || null
  },
  findById: async (id) => {
    if (isConnectedToMongo) return await MongoPayment.findById(id).lean()
    return localDB.getCollection('payments').find(p => p._id === id) || null
  },
  create: async (data) => {
    if (isConnectedToMongo) {
      const doc = await MongoPayment.create(data)
      return doc.toObject()
    }
    const newItem = {
      _id: generateId(),
      status: 'pending',
      method: 'mock',
      createdAt: new Date().toISOString(),
      ...data
    }
    const list = localDB.getCollection('payments')
    list.unshift(newItem)
    localDB.setCollection('payments', list)
    return newItem
  },
  findByIdAndUpdate: async (id, update) => {
    if (isConnectedToMongo) return await MongoPayment.findByIdAndUpdate(id, update, { new: true }).lean()
    const list = localDB.getCollection('payments')
    const idx = list.findIndex(p => p._id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...update, updatedAt: new Date().toISOString() }
    localDB.setCollection('payments', list)
    return list[idx]
  }
}
export { MongoPayment }
