import 'dotenv/config'
import { connectDB, disconnectDB } from '../config/database'
import User from '../models/User'
import Category from '../models/Category'
import Gig from '../models/Gig'
import Wallet from '../models/Wallet'

const seedDatabase = async () => {
  try {
    await connectDB()
    console.log('Seeding database...')

    await User.deleteMany({})
    await Category.deleteMany({})
    await Gig.deleteMany({})
    await Wallet.deleteMany({})

    const userData = [
      {
        email: 'client@example.com',
        password: 'password123',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        role: 'client',
        verified: true,
        emailVerified: true,
        isActive: true
      },
      {
        email: 'freelancer1@example.com',
        password: 'password123',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
        role: 'freelancer',
        verified: true,
        emailVerified: true,
        isActive: true,
        bio: 'Expert web developer with 5+ years experience',
        tagline: 'Full-Stack Developer | Vue.js Expert',
        skills: ['React', 'Vue.js', 'Node.js', 'MongoDB'],
        hourlyRate: 50,
        location: 'USA',
        timezone: 'EST',
        averageRating: 4.9,
        totalReviews: 24,
        completedProjects: 48
      },
      {
        email: 'freelancer2@example.com',
        password: 'password123',
        username: 'mikejohnson',
        firstName: 'Mike',
        lastName: 'Johnson',
        fullName: 'Mike Johnson',
        role: 'freelancer',
        verified: true,
        emailVerified: true,
        isActive: true,
        bio: 'UI/UX Designer specializing in web and mobile',
        tagline: 'UI/UX Designer & Brand Strategist',
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
        hourlyRate: 45,
        location: 'Canada',
        timezone: 'EST',
        averageRating: 4.8,
        totalReviews: 18,
        completedProjects: 32
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        role: 'admin',
        verified: true,
        emailVerified: true,
        isActive: true
      }
    ]

    const users = []
    for (const data of userData) {
      users.push(await User.create(data))
    }

    console.log(`✅ Created ${users.length} users`)

    for (const user of users) {
      await Wallet.create({
        user: user._id,
        balance: user.role === 'freelancer' ? 500 : 1000,
        totalEarnings: user.role === 'freelancer' ? 2500 : 0
      })
    }

    console.log('✅ Created wallets')

    const categories = await Category.insertMany([
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Professional web development services',
        icon: 'code',
        featured: true
      },
      {
        name: 'UI/UX Design',
        slug: 'ui-ux-design',
        description: 'User interface and user experience design',
        icon: 'design_services',
        featured: true
      },
      {
        name: 'Mobile Development',
        slug: 'mobile-development',
        description: 'iOS and Android app development',
        icon: 'phone_iphone',
        featured: true
      },
      {
        name: 'Graphic Design',
        slug: 'graphic-design',
        description: 'Professional graphic design services',
        icon: 'brush',
        featured: false
      },
      {
        name: 'Content Writing',
        slug: 'content-writing',
        description: 'High-quality content writing and copywriting',
        icon: 'edit_note',
        featured: false
      },
      {
        name: 'Video Editing',
        slug: 'video-editing',
        description: 'Professional video editing services',
        icon: 'movie',
        featured: false
      }
    ])

    console.log(`✅ Created ${categories.length} categories`)

    const defaultPackages = (title: string, desc: string, price: number, days: number, features: string[]) => [
      {
        name: 'basic',
        title: 'Basic',
        description: desc,
        price,
        deliveryTime: days,
        revisions: 2,
        features
      },
      {
        name: 'standard',
        title: 'Standard',
        description: desc,
        price: Math.round(price * 1.5),
        deliveryTime: Math.max(1, days - 2),
        revisions: 3,
        features: [...features, 'Priority support']
      },
      {
        name: 'premium',
        title: 'Premium',
        description: desc,
        price: price * 2,
        deliveryTime: Math.max(1, days - 4),
        revisions: 5,
        features: [...features, 'Priority support', 'Source files']
      }
    ]

    const gigs = await Gig.insertMany([
      {
        title: 'Professional React Web Application',
        description:
          'I will create a custom React web application with TypeScript, modern features, and responsive design.',
        category: 'web-development',
        seller: users[1]._id,
        basePrice: 500,
        deliveryDays: 14,
        revisions: 3,
        features: ['Responsive Design', 'TypeScript', 'Redux'],
        packages: defaultPackages(
          'Basic',
          'Custom React web application',
          500,
          14,
          ['Responsive Design', 'TypeScript', 'Redux']
        ),
        tags: ['react', 'typescript', 'web'],
        status: 'active',
        approved: true,
        isFeatured: true,
        orderCount: 12,
        rating: 4.9
      },
      {
        title: 'Mobile App UI/UX Design',
        description: 'Complete UI/UX design for iOS and Android apps with Figma prototypes.',
        category: 'ui-ux-design',
        seller: users[2]._id,
        basePrice: 400,
        deliveryDays: 10,
        revisions: 2,
        features: ['Figma Design', 'Prototyping', 'User Research'],
        packages: defaultPackages(
          'Basic',
          'Mobile UI/UX design',
          400,
          10,
          ['Figma Design', 'Prototyping', 'User Research']
        ),
        tags: ['ui', 'ux', 'figma'],
        status: 'active',
        approved: true,
        isFeatured: true,
        orderCount: 8,
        rating: 4.8
      },
      {
        title: 'Full Stack Web Development',
        description:
          'Build full-featured web applications with Node.js backend and React frontend.',
        category: 'web-development',
        seller: users[1]._id,
        basePrice: 1000,
        deliveryDays: 30,
        revisions: 5,
        features: ['Frontend', 'Backend', 'Database'],
        packages: defaultPackages(
          'Basic',
          'Full stack application',
          1000,
          30,
          ['Frontend', 'Backend', 'Database']
        ),
        tags: ['fullstack', 'nodejs', 'react'],
        status: 'active',
        approved: true,
        orderCount: 5,
        rating: 5
      },
      {
        title: 'Vue.js Component Development',
        description: 'Create reusable Vue.js components for your project.',
        category: 'web-development',
        seller: users[1]._id,
        basePrice: 300,
        deliveryDays: 7,
        revisions: 2,
        features: ['Vue 3', 'Composition API', 'Testing'],
        packages: defaultPackages(
          'Basic',
          'Vue.js components',
          300,
          7,
          ['Vue 3', 'Composition API', 'Testing']
        ),
        tags: ['vue', 'components'],
        status: 'active',
        approved: true,
        orderCount: 15,
        rating: 4.7
      },
      {
        title: 'Website Design & Branding',
        description:
          'Complete website design including branding, mockups, and interactive prototypes.',
        category: 'ui-ux-design',
        seller: users[2]._id,
        basePrice: 800,
        deliveryDays: 21,
        revisions: 4,
        features: ['Branding', 'Web Design', 'Prototype'],
        packages: defaultPackages(
          'Basic',
          'Website design & branding',
          800,
          21,
          ['Branding', 'Web Design', 'Prototype']
        ),
        tags: ['branding', 'design'],
        status: 'active',
        approved: true,
        orderCount: 6,
        rating: 4.9
      }
    ])

    console.log(`✅ Created ${gigs.length} gigs`)
    console.log('\n✅ Database seeded successfully!')
    console.log('\n📝 Test Credentials:')
    console.log('Client: client@example.com / password123')
    console.log('Freelancer 1: freelancer1@example.com / password123')
    console.log('Freelancer 2: freelancer2@example.com / password123')
    console.log('Admin: admin@example.com / password123')

    await disconnectDB()
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()
