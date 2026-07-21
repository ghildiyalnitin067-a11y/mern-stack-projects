import mongoose from 'mongoose'
import { isConnectedToMongo, localDB } from '../db.js'

const ServiceSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substring(2, 11) },
  providerId: { type: String, required: true },
  providerName: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true })

const MongoService = mongoose.model('Service', ServiceSchema)

const generateId = () => Math.random().toString(36).substring(2, 11)

const db = localDB.data
if (!db.services) {
  db.services = []
  localDB.save()
}
if (db.services.length === 0) {
  db.services.push({
    _id: 's1',
    providerId: 'p1',
    providerName: 'Rajesh Kumar',
    title: 'AC Condenser Servicing',
    category: 'AC Repair & Service',
    price: 349,
    description: 'Full servicing of split AC indoor and outdoor unit with high-pressure water pump jet.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop'
  })
  db.services.push({
    _id: 's2',
    providerId: 'p2',
    providerName: 'Sunita Sharma',
    title: 'Deep House Cleaning',
    category: 'Cleaning',
    price: 249,
    description: 'Includes kitchen, bathroom, and living room cleaning with specialized disinfectants.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop'
  })
  localDB.save()
}

MongoService.estimatedDocumentCount().then(count => {
  if (count === 0) {
    console.log('Seeding initial MongoDB services collection...')
    MongoService.create([
      {
        _id: 's1',
        providerId: 'p1',
        providerName: 'Rajesh Kumar',
        title: 'AC Condenser Servicing',
        category: 'AC Repair & Service',
        price: 349,
        description: 'Full servicing of split AC indoor and outdoor unit with high-pressure water pump jet.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop'
      },
      {
        _id: 's2',
        providerId: 'p2',
        providerName: 'Sunita Sharma',
        title: 'Deep House Cleaning',
        category: 'Cleaning',
        price: 249,
        description: 'Includes kitchen, bathroom, and living room cleaning with specialized disinfectants.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop'
      }
    ]).then(() => {
      console.log('Initial MongoDB services collection seeded successfully!')
    }).catch(err => {
      console.error('Error seeding MongoDB services:', err)
    })
  }
}).catch(err => {
  console.error('Error getting MongoDB document count:', err)
})

export const Service = {
  find: async (query = {}) => {
    if (isConnectedToMongo) return await MongoService.find(query).lean()
    let list = localDB.getCollection('services')
    if (query.category && query.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === query.category.toLowerCase())
    }
    if (query.providerId) {
      list = list.filter(s => s.providerId === query.providerId)
    }
    return list
  },
  findById: async (id) => {
    if (isConnectedToMongo) return await MongoService.findById(id).lean()
    return localDB.getCollection('services').find(s => s._id === id) || null
  },
  create: async (data) => {
    if (isConnectedToMongo) {
      const doc = await MongoService.create(data)
      return doc.toObject()
    }
    const newItem = {
      _id: generateId(),
      description: '',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=200&auto=format&fit=crop',
      ...data
    }
    const list = localDB.getCollection('services')
    list.push(newItem)
    localDB.setCollection('services', list)
    return newItem
  },
  findByIdAndUpdate: async (id, update) => {
    if (isConnectedToMongo) return await MongoService.findByIdAndUpdate(id, update, { new: true }).lean()
    const list = localDB.getCollection('services')
    const idx = list.findIndex(s => s._id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...update }
    localDB.setCollection('services', list)
    return list[idx]
  },
  findByIdAndDelete: async (id) => {
    if (isConnectedToMongo) return await MongoService.findByIdAndDelete(id)
    const list = localDB.getCollection('services')
    const filtered = list.filter(s => s._id !== id)
    localDB.setCollection('services', filtered)
    return { success: true }
  }
}
