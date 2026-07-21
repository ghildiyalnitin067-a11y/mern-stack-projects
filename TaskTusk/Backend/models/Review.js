import mongoose from 'mongoose'
import { isConnectedToMongo, localDB } from '../db.js'

const ReviewSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substring(2, 11) },
  bookingId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  serviceId: { type: String, required: true }
}, { timestamps: true })

const MongoReview = mongoose.model('Review', ReviewSchema)

const generateId = () => Math.random().toString(36).substring(2, 11)

const db = localDB.data
if (!db.reviews) {
  db.reviews = []
  localDB.save()
}

export const Review = {
  find: async (query = {}) => {
    if (isConnectedToMongo) return await MongoReview.find(query).sort({ createdAt: -1 }).lean()
    let list = localDB.getCollection('reviews')
    if (query.serviceId) {
      list = list.filter(r => r.serviceId === query.serviceId)
    }
    if (query.providerId) {
      list = list.filter(r => r.providerId === query.providerId)
    }
    if (query.customerId) {
      list = list.filter(r => r.customerId === query.customerId)
    }
    if (query.bookingId) {
      list = list.filter(r => r.bookingId === query.bookingId)
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },
  create: async (data) => {
    if (isConnectedToMongo) {
      const doc = await MongoReview.create(data)

      try {
        const booking = await mongoose.model('Booking').findById(data.bookingId).lean()
        if (booking) {
          const providerId = booking.providerId
          const providerBookings = await mongoose.model('Booking').find({ providerId }).lean()
          const providerBookingIds = providerBookings.map(b => b._id)
          const providerReviews = await MongoReview.find({ bookingId: { $in: providerBookingIds } }).lean()

          if (providerReviews.length > 0) {
            const avgRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length
            await mongoose.model('User').findByIdAndUpdate(providerId, {
              rating: Number(avgRating.toFixed(1)),
              reviewsCount: providerReviews.length
            })
          }
        }
      } catch (err) {
        console.error('Error updating provider rating on MongoDB:', err)
      }
      return doc.toObject()
    }
    const newItem = {
      _id: generateId(),
      createdAt: new Date().toISOString(),
      ...data
    }
    const list = localDB.getCollection('reviews')
    list.unshift(newItem)
    localDB.setCollection('reviews', list)


    const bookings = localDB.getCollection('bookings')
    const booking = bookings.find(b => b._id === data.bookingId)
    if (booking) {
      const providerId = booking.providerId
      const providerReviews = list.filter(r => {
        const b = bookings.find(bk => bk._id === r.bookingId)
        return b && b.providerId === providerId
      })
      const avg = providerReviews.reduce((sum, r) => sum + r.rating, 0) / (providerReviews.length || 1)

      const usersList = localDB.getCollection('users')
      const uIdx = usersList.findIndex(u => u._id === providerId)
      if (uIdx !== -1) {
        usersList[uIdx].rating = avg
        usersList[uIdx].reviewsCount = providerReviews.length
        localDB.setCollection('users', usersList)
      }
    }

    return newItem
  }
}
