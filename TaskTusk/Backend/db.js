import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4'])

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_FILE_PATH = path.join(__dirname, 'simulated-db.json')

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tasktusk'

let isConnectedToMongo = false

const SEED_PROVIDERS = [
  {
    _id: 'p1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    profession: 'AC Repair & Service',
    price: 349,
    experience: 8,
    rating: 4.8,
    reviewsCount: 142,
    address: 'Flat 402, Pocket C, Sector 12, Dwarka',
    city: 'New Delhi',
    pincode: '110075',
    available: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop'
  },
  {
    _id: 'p2',
    name: 'Sunita Sharma',
    phone: '+91 87654 32109',
    profession: 'Cleaning',
    price: 249,
    experience: 5,
    rating: 4.9,
    reviewsCount: 98,
    address: 'B-12, Green Park Extension, Andheri West',
    city: 'Mumbai',
    pincode: '400053',
    available: true,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop'
  },
  {
    _id: 'p3',
    name: 'Amit Patel',
    phone: '+91 76543 21098',
    profession: 'Electrical',
    price: 199,
    experience: 6,
    rating: 4.7,
    reviewsCount: 76,
    address: 'Shyam Bungalows, Near Drive In Road',
    city: 'Ahmedabad',
    pincode: '380054',
    available: true,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=200&auto=format&fit=crop'
  },
  {
    _id: 'p4',
    name: 'Pooja Gupta',
    phone: '+91 95432 10987',
    profession: 'Salon & Beautician',
    price: 499,
    experience: 7,
    rating: 4.9,
    reviewsCount: 165,
    address: 'Apartment 102, Shanthi Layout, Whitefield',
    city: 'Bengaluru',
    pincode: '560066',
    available: true,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=200&auto=format&fit=crop'
  },
  {
    _id: 'p5',
    name: 'Vikram Singh',
    phone: '+91 91234 56789',
    profession: 'Carpentry',
    price: 299,
    experience: 10,
    rating: 4.6,
    reviewsCount: 54,
    address: 'Plot 45, Hanuman Nagar, Vaishali Nagar',
    city: 'Jaipur',
    pincode: '302021',
    available: true,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=200&auto=format&fit=crop'
  },
  {
    _id: 'p6',
    name: 'Ramesh Prasad',
    phone: '+91 88990 12345',
    profession: 'Plumbing',
    price: 249,
    experience: 12,
    rating: 4.9,
    reviewsCount: 210,
    address: 'Lane 4, Koregaon Park',
    city: 'Pune',
    pincode: '411001',
    available: true,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=200&auto=format&fit=crop'
  }
]

const SEED_CUSTOMERS = [
  {
    _id: 'c1',
    name: 'Rahul Verma',
    phone: '+91 99887 76655',
    address: 'Flat 101, Prestige Heights, HSR Layout, Bengaluru'
  },
  {
    _id: 'c2',
    name: 'Priya Nair',
    phone: '+91 98877 66554',
    address: 'Block A-4, Golf Link Apartments, New Delhi'
  }
]

const SEED_BOOKINGS = [
  {
    _id: 'b1',
    customerId: 'c1',
    customerName: 'Rahul Verma',
    customerPhone: '+91 99887 76655',
    customerAddress: 'Flat 101, Prestige Heights, HSR Layout, Bengaluru',
    providerId: 'p2',
    providerName: 'Sunita Sharma',
    providerProfession: 'Cleaning',
    price: 249,
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '10:00 AM - 12:00 PM',
    status: 'completed',
    notificationStatus: 'read',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'b2',
    customerId: 'c2',
    customerName: 'Priya Nair',
    customerPhone: '+91 98877 66554',
    customerAddress: 'Block A-4, Golf Link Apartments, New Delhi',
    providerId: 'p1',
    providerName: 'Rajesh Kumar',
    providerProfession: 'AC Repair & Service',
    price: 349,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timeSlot: '02:00 PM - 04:00 PM',
    status: 'accepted',
    notificationStatus: 'read',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'b3',
    customerId: 'c1',
    customerName: 'Rahul Verma',
    customerPhone: '+91 99887 76655',
    customerAddress: 'Flat 101, Prestige Heights, HSR Layout, Bengaluru',
    providerId: 'p4',
    providerName: 'Pooja Gupta',
    providerProfession: 'Salon & Beautician',
    price: 499,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '04:00 PM - 06:00 PM',
    status: 'pending',
    notificationStatus: 'unread',
    createdAt: new Date().toISOString()
  }
]

class LocalDB {
  constructor() {
    this.data = { providers: [], customers: [], bookings: [] }
    this.load()
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf8')
        this.data = JSON.parse(fileContent)
      } else {
        this.data = {
          providers: SEED_PROVIDERS,
          customers: SEED_CUSTOMERS,
          bookings: SEED_BOOKINGS
        }
        this.save()
      }
    } catch (e) {
      console.error('Error loading fallback JSON DB, initializing empty:', e)
      this.data = { providers: SEED_PROVIDERS, customers: SEED_CUSTOMERS, bookings: SEED_BOOKINGS }
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf8')
    } catch (e) {
      console.error('Error saving JSON database:', e)
    }
  }


  getCollection(name) {
    return this.data[name] || []
  }

  setCollection(name, list) {
    this.data[name] = list
    this.save()
  }
}

export const localDB = new LocalDB()

export async function connectDB() {
  try {
    const finalUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tasktusk'
    console.log('Attempting to connect to MongoDB...')
    mongoose.set('strictQuery', false)


    await mongoose.connect(finalUri, {
      serverSelectionTimeoutMS: 3000,
      family: 4
    })

    isConnectedToMongo = true
    console.log('MongoDB Connected Successfully at:', finalUri)
  } catch (error) {
    isConnectedToMongo = false
    console.warn('\n======================================================')
    console.warn('WARNING: MongoDB Connection Failed!')
    console.warn('Reason:', error.message)
    console.warn('TaskTusk is running in SIMULATED JSON DATABASE mode.')
    console.warn('All data is persisted in:', DB_FILE_PATH)
    console.warn('======================================================\n')
  }
}

export { isConnectedToMongo }
