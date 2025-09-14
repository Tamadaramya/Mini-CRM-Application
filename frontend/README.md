# CRM Frontend - React + Vite + Tailwind

Modern React frontend for the Complete MERN Stack CRM application built with Vite, Tailwind CSS, and latest React patterns.

## 🚀 Features

### ✅ **All Issues Fixed**
- **Working Modals**: All Add/Edit buttons now open proper modal forms
- **Dynamic Data**: Dashboard and pages show real API data
- **Edit Functionality**: Edit buttons work correctly with pre-filled forms
- **Form Validation**: Complete client-side validation with error messages
- **API Integration**: All CRUD operations properly connected
- **Responsive Design**: Works perfectly on all devices

### 🛠️ **Technologies**
- **React 18** - Latest React with modern hooks
- **Vite** - Fast build tool (no deprecated CRA)
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Modern routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 🔧 Installation

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── context/             # React context
├── hooks/               # Custom hooks
├── pages/               # Page components
├── services/            # API services
├── utils/               # Utility functions
├── App.jsx              # Main app
└── main.jsx             # Entry point
```

## 🎯 Key Components

### Pages
- **Dashboard** - Analytics and overview
- **Customers** - Customer management with CRUD
- **Leads** - Lead tracking and management
- **Reports** - Analytics and insights
- **Login/Register** - Authentication

### Components
- **Modal** - Overlay forms and dialogs
- **Loading** - Loading states and spinners
- **Pagination** - Data pagination
- **StatusBadge** - Lead status indicators
- **Forms** - Customer and Lead forms with validation

## 🔌 API Integration

All API calls are handled through service files:
- `services/auth.js` - Authentication
- `services/customers.js` - Customer operations
- `services/leads.js` - Lead operations
- `services/api.js` - Base API configuration

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Dark/Light mode** support
- **Responsive design** for all screen sizes
- **Custom components** with consistent styling
- **Loading states** and animations

## 📱 Responsive Features

- Mobile-first design approach
- Touch-friendly interactions
- Collapsible sidebar navigation
- Adaptive layouts for all screen sizes
- Optimized forms for mobile input

## 🚀 Build & Deploy

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🔧 Configuration

Environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Dev Innovations CRM
VITE_APP_VERSION=1.0.0
```

## ✅ Features Verification

- [x] All modals open and work correctly
- [x] Edit forms pre-fill with existing data
- [x] Add forms validate and submit properly
- [x] Search and filtering work in real-time
- [x] Pagination navigates correctly
- [x] API calls succeed and handle errors
- [x] Toast notifications show for all actions
- [x] Responsive design works on all devices
- [x] Dark/light mode toggle functions
- [x] Loading states display properly