# Gig Galaxy Backend API

A comprehensive Node.js/Express backend for the Gig Galaxy freelancer marketplace platform.

## Features

- ✅ Authentication with JWT tokens (access + refresh)
- ✅ User management (clients, freelancers, admin)
- ✅ Gig/Service management
- ✅ Order/Project management
- ✅ Review and rating system
- ✅ Real-time messaging
- ✅ Wallet/Payment tracking
- ✅ Portfolio management
- ✅ Category system
- ✅ Role-based access control

## Prerequisites

- Node.js v20 or higher
- MongoDB running locally or a MongoDB connection string
- npm or yarn

## Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Setup environment variables**
Create a `.env` file in the backend directory with:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gig-galaxy
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your-refresh-secret-key-change-this-in-production
REFRESH_TOKEN_EXPIRE=30d
```

3. **Setup MongoDB**
Make sure MongoDB is running on your system:
```bash
# On Windows (if using MongoDB Community)
mongod
```

## Running the Server

### Development mode
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production build
```bash
npm run build
npm start
```

## Database Seeding

To populate the database with sample data (categories, users, gigs):

```bash
npm run seed
```

This creates:
- 4 test users (client, 2 freelancers, admin)
- 6 categories
- 5 sample gigs
- Wallets for all users

**Test Credentials:**
```
Client: client@example.com / password123
Freelancer 1: freelancer1@example.com / password123
Freelancer 2: freelancer2@example.com / password123
Admin: admin@example.com / password123
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user (requires auth)

### Gigs (`/api/gigs`)
- `GET /` - List all active gigs
- `GET /featured` - Get featured gigs
- `GET /my` - Get user's gigs (requires auth)
- `POST /` - Create gig (requires auth)
- `GET /:id` - Get gig details
- `PUT /:id` - Update gig (requires auth)
- `DELETE /:id` - Delete gig (requires auth)
- `PATCH /:id/publish` - Publish gig (requires auth)
- `PATCH /:id/draft` - Draft gig (requires auth)

### Users (`/api/users`)
- `GET /freelancers` - List freelancers
- `GET /freelancers/featured` - Featured freelancers
- `GET /freelancers/top-rated` - Top-rated freelancers
- `GET /me/profile` - Get current user profile (requires auth)
- `PUT /me/profile` - Update profile (requires auth)
- `PUT /me/settings` - Update settings (requires auth)
- `GET /:username/profile` - Get user profile
- `POST /me/portfolio` - Add portfolio item (requires auth)
- `DELETE /me/portfolio/:id` - Delete portfolio item (requires auth)
- `GET /:userId/portfolio` - Get user portfolio

### Orders (`/api/orders`)
- `POST /` - Create order (requires auth)
- `GET /my` - Get user's orders (requires auth)
- `GET /:id` - Get order details (requires auth)
- `PATCH /:id/status` - Update order status (requires auth)
- `PATCH /:id/cancel` - Cancel order (requires auth)

### Reviews (`/api/reviews`)
- `POST /` - Create review (requires auth)
- `GET /` - Get reviews
- `GET /user/:userId` - Get user rating

### Chat (`/api/chat`)
- `POST /` - Send message (requires auth)
- `GET /conversations` - Get user conversations (requires auth)
- `GET /:conversationId` - Get conversation messages (requires auth)

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Authentication, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   ├── scripts/        # Database seeding
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript
├── package.json
├── tsconfig.json
├── .env               # Environment variables
└── .gitignore
```

## Database Models

- **User** - User accounts (client, freelancer, admin)
- **Gig** - Service/project listings
- **Order** - Projects/orders
- **Review** - User ratings and reviews
- **Chat** - Messages between users
- **Notification** - User notifications
- **Wallet** - Payment/earnings tracking
- **Portfolio** - Freelancer portfolio items
- **Category** - Gig categories

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Security Notes

- 🔐 Change JWT_SECRET in production
- 🔐 Use environment-specific .env files
- 🔐 Implement rate limiting in production
- 🔐 Use HTTPS in production
- 🔐 Validate all inputs on both frontend and backend

## Next Steps

1. Start MongoDB: `mongod`
2. Install dependencies: `npm install`
3. Seed database: `npm run seed`
4. Start backend: `npm run dev`
5. Backend will be running at `http://localhost:3000`
6. Frontend should connect to it automatically

## Troubleshooting

**MongoDB Connection Error**
- Make sure MongoDB is running
- Check MONGODB_URI in .env

**Port Already in Use**
- Change PORT in .env or kill the process using port 3000

**Seed Script Issues**
- Make sure backend is not running when seeding
- Check MongoDB connection

## License

ISC
