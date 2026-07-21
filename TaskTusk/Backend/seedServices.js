import mongoose from 'mongoose'
import { Service } from './models/Service.js'
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4'])

import dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://nitin123:nitin1234@tasktusk.gvbyioj.mongodb.net/?appName=TaskTusk'

const SEED_SERVICES = [
  {
    providerId: 'p1',
    providerName: 'Rajesh Kumar',
    title: 'AC Condenser Servicing',
    category: 'AC Repair & Service',
    price: 349,
    description: 'Full servicing of split AC indoor and outdoor unit with high-pressure water pump jet.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p1',
    providerName: 'Rajesh Kumar',
    title: 'Water Heater & Geyser Repair',
    category: 'Plumbing',
    price: 499,
    description: 'Fixing heating element issues, thermostat repair, and hard water scaling removal for all brands of geysers.',
    image: 'https://images.unsplash.com/photo-1585863920677-2292f7e7f1ee?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p1',
    providerName: 'Rajesh Kumar',
    title: 'Switchboard & Socket Installation',
    category: 'Electrical',
    price: 199,
    description: 'Installation or repair of electrical switchboards, sockets, and basic house wiring checks.',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p2',
    providerName: 'Sunita Sharma',
    title: 'Deep House Cleaning',
    category: 'Cleaning',
    price: 2499,
    description: 'Complete top-to-bottom home cleaning including kitchen degreasing, bathroom descaling, and floor scrubbing.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p2',
    providerName: 'Sunita Sharma',
    title: 'Bridal Makeup & Styling',
    category: 'Salon & Beautician',
    price: 4500,
    description: 'Premium at-home bridal makeup, hair styling, and saree draping. Uses Mac and Huda Beauty products.',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p2',
    providerName: 'Sunita Sharma',
    title: 'Sofa & Carpet Dry Cleaning',
    category: 'Cleaning',
    price: 799,
    description: 'Machine-based deep vacuuming, shampooing, and stain removal for 5-seater sofas and large carpets.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p1',
    providerName: 'Rajesh Kumar',
    title: 'Custom Furniture Assembly',
    category: 'Carpentry',
    price: 599,
    description: 'Assembly and dismantling of beds, wardrobes, dining tables (IKEA, Pepperfry, UrbanLadder).',
    image: 'https://images.unsplash.com/photo-1582282577237-7504f2f4e3c5?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p2',
    providerName: 'Sunita Sharma',
    title: 'Facial & Threading Combo',
    category: 'Salon & Beautician',
    price: 899,
    description: 'Relaxing 60-minute fruit facial with upper lip and eyebrow threading. Glowing skin guaranteed.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p1',
    providerName: 'Rajesh Kumar',
    title: 'Leaking Pipe & Tap Fix',
    category: 'Plumbing',
    price: 149,
    description: 'Quick fix for dripping faucets, leaking sink pipes, and flush tank issues. Price excludes spare parts.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop'
  },
  {
    providerId: 'p1',
    providerName: 'Rajesh Kumar',
    title: 'Ceiling Fan Repair & Install',
    category: 'Electrical',
    price: 249,
    description: 'Installation of new ceiling fans or repairing regulator and capacitor issues for existing fans.',
    image: 'https://images.unsplash.com/photo-1534142498205-d1f5e8210355?q=80&w=400&auto=format&fit=crop'
  }
]

async function seed() {
  try {
    console.log('Connecting to MongoDB...')

    await mongoose.connect(MONGO_URI, { family: 4 })
    console.log('Connected to MongoDB.')






    console.log('Inserting 10 services...')
    for (const serviceData of SEED_SERVICES) {
      await Service.create(serviceData)
    }

    console.log('Successfully seeded 10 self-written services!')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err)
    process.exit(1)
  }
}

seed()
