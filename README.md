# Salon Clinic Backend API

Backend API for the Salon/Clinic Appointment Booking System built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Appointment booking and management
- Service management
- Staff management
- Role-based access control (User, Admin, Owner)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment on Render

### Prerequisites
- MongoDB Atlas account with a cluster set up
- GitHub repository with your code

### Steps:

1. **Create Render Account**: Go to [Render](https://render.com) and sign up

2. **Connect GitHub**: 
   - Click "New" → "Web Service"
   - Connect your GitHub account
   - Select this repository

3. **Configure Service**:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables** (Add these in Render dashboard):
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

5. **Deploy**: Click "Create Web Service"

### Important Notes:
- Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Render's IP ranges
- Update the FRONTEND_URL environment variable with your actual Vercel deployment URL
- The free tier on Render may sleep after 15 minutes of inactivity

## API Endpoints

- `GET /` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/services` - Get all services
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get user appointments

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NODE_ENV` | Environment (development/production) |
| `FRONTEND_URL` | Frontend application URL for CORS |

## License

ISC
