const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS with specific origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.CLIENT_URL
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Route files
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const leadRoutes = require('./routes/leads');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CRM API is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Dev Innovations CRM API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      leads: '/api/leads',
      health: '/api/health'
    }
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api/auth', '/api/customers', '/api/leads', '/api/health']
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API endpoints:`);
  console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
  console.log(`   - Customers: http://localhost:${PORT}/api/customers`);
  console.log(`   - Leads: http://localhost:${PORT}/api/leads`);
  console.log(`\n📊 Database: MongoDB connected`);
  console.log(`🔒 CORS enabled for: ${process.env.CLIENT_URL || 'localhost:3000,localhost:5173'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  console.log('🚨 Shutting down...');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received');
  console.log('🚨 Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;