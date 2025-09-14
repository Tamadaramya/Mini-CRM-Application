# CRM Backend API - Complete Implementation

A complete Node.js/Express.js backend API for the CRM application with JWT authentication, CRUD operations, and MongoDB integration.

## 🚀 Features

- **Authentication**: JWT-based user registration and login
- **Customer Management**: Full CRUD operations with search and pagination
- **Lead Management**: Complete lead lifecycle with status tracking
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## 🔧 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   Edit the `.env` file with your settings:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crm_complete_db
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Customers
- `GET /api/customers` - Get all customers (with search & pagination)
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Leads
- `GET /api/leads` - Get all leads (with status filtering & pagination)
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Utility
- `GET /api/health` - Health check endpoint

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Error Handling**: Comprehensive error responses

## 📊 Database Schema

### User Model
- `name`: String (required, 2-50 chars)
- `email`: String (required, unique, valid email)
- `password`: String (required, min 6 chars, hashed)
- `role`: Enum ['Admin', 'User'] (default: User)

### Customer Model
- `name`: String (required, 2-100 chars)
- `email`: String (required, valid email)
- `phone`: String (required, 10-20 chars)
- `company`: String (required, 2-100 chars)
- `ownerId`: ObjectId (ref: User)

### Lead Model
- `customerId`: ObjectId (ref: Customer, required)
- `title`: String (required, 5-200 chars)
- `description`: String (required, 10-1000 chars)
- `status`: Enum ['New', 'Contacted', 'Converted', 'Lost']
- `value`: Number (required, min: 0)
- `ownerId`: ObjectId (ref: User)

## 🧪 Testing

Test the API endpoints using:
- **Postman**: Import the collection for easy testing
- **curl**: Command line testing
- **Frontend Integration**: Connect with React frontend

### Sample API Calls

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Create Customer:**
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "1234567890",
    "company": "Acme Corporation"
  }'
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend-domain.com
```

### Deployment Platforms
- **Render**: Easy Node.js deployment
- **Heroku**: Classic PaaS deployment
- **Vercel**: Serverless functions
- **AWS**: EC2 or Lambda deployment

## 📝 Development Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

## 🛠️ Project Structure

```
backend/
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── customerController.js # Customer CRUD operations
│   └── leadController.js   # Lead CRUD operations
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   ├── validation.js      # Input validation rules
│   └── errorHandler.js    # Global error handling
├── models/
│   ├── User.js           # User data model
│   ├── Customer.js       # Customer data model
│   └── Lead.js           # Lead data model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── customers.js      # Customer routes
│   └── leads.js          # Lead routes
├── utils/
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── server.js             # Main application entry point
```

## 🔧 Troubleshooting

**Common Issues:**

1. **MongoDB Connection Error**
   - Check your MONGO_URI in .env file
   - Ensure MongoDB Atlas allows connections from your IP
   - Verify database credentials

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set in environment
   - Check token expiry settings
   - Verify Bearer token format in requests

3. **CORS Errors**
   - Update CLIENT_URL in environment variables
   - Check allowed origins in server.js

4. **Validation Errors**
   - Check request body format
   - Ensure all required fields are provided
   - Verify data types match schema requirements

## 📞 Support

For issues and questions:
1. Check the error logs in console
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Test endpoints with proper authentication headers

---

**🎯 Ready for Frontend Integration!**

This backend is fully compatible with the React frontend and provides all necessary API endpoints for a complete CRM application.