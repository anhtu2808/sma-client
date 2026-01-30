# SmartRecruit - Project Setup Guide

## 📋 Prerequisites

- Node.js 16+ and npm
- Git
- Code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd sma-client

# Install dependencies
npm install
```

### 2. Environment Configuration

Create `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080

# Environment
REACT_APP_ENV=development
```

Create `.env.production` for production:

```env
# API Configuration
REACT_APP_API_URL=https://your-production-api.com

# Environment
REACT_APP_ENV=production
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📦 Dependencies

### Core Dependencies
```json
{
  "@reduxjs/toolkit": "^2.x",
  "react-redux": "^9.x",
  "redux-persist": "^6.x",
  "axios": "^1.x",
  "lodash": "^4.x",
  "antd": "^5.x",
  "sass": "^1.x",
  "clsx": "^2.x"
}
```

### Installation Command
```bash
npm install @reduxjs/toolkit react-redux redux-persist axios lodash antd sass clsx
```

## 🏗️ Project Structure

```
sma-client/
├── public/
│   ├── index.html          # HTML template
│   ├── manifest.json       # PWA manifest
│   └── sma-logo.svg        # App logo
├── src/
│   ├── apis/               # RTK Query API endpoints
│   │   ├── baseApi.js      # Base API configuration
│   │   └── userApi.js      # Example user endpoints
│   ├── assets/             # Static assets
│   │   └── svg/
│   │       └── sma-logo.svg
│   ├── components/         # Reusable components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── SearchInput/
│   │   ├── Checkbox/
│   │   ├── Switch/
│   │   ├── Card/
│   │   ├── ColorSwatch/
│   │   └── SectionHeader/
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   └── ui-kit/
│   ├── routes/             # Route configuration
│   │   └── index.js
│   ├── store/              # Redux store
│   │   ├── index.js        # Store configuration
│   │   └── slices/         # Redux slices
│   ├── styles/             # Global styles
│   │   └── _variables.scss # SCSS variables
│   ├── App.js              # Root component
│   ├── index.js            # Entry point
│   └── index.css           # Global CSS
├── .env                    # Environment variables (dev)
├── .env.production         # Environment variables (prod)
├── package.json
└── tailwind.config.js
```

## 🔧 Configuration Files

### 1. Redux Store (`src/store/index.js`)

The store is configured with:
- RTK Query API reducer
- Redux Persist for state persistence
- Custom middleware for API calls

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { api } from '@/apis/baseApi';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [], // Add slices to persist
    blacklist: [api.reducerPath],
};

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(api.middleware),
});

export const persistor = persistStore(store);
export default store;
```

### 2. RTK Query Base API (`src/apis/baseApi.js`)

Configured with:
- Automatic token injection
- Nullish value stripping
- Custom response handling

```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";

export const API_VERSION = "/v1";

const stripNullish = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    return omitBy(obj, isNil);
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const customBaseQuery = (args, api, extra) => {
    if (typeof args === "object") {
        const { params, body, ...rest } = args;
        return rawBaseQuery(
            {
                ...rest,
                params: stripNullish(params),
                body
            },
            api,
            extra
        );
    }
    return rawBaseQuery(args, api, extra);
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: customBaseQuery,
    tagTypes: ["Users", "Jobs", "Applications", "Companies"],
    endpoints: () => ({})
});
```

### 3. App Entry Point (`src/index.js`)

Wrapped with Redux Provider and PersistGate:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
```

## 🎨 Design System

### SCSS Variables (`src/styles/_variables.scss`)

```scss
// Primary Colors
$primary: #FF6B35;
$primary-dark: #E55A2B;
$primary-light: #FFF0DB;
$primary-bg: #FFF7EB;

// Neutral Colors
$neutral-50: #F9FAFB;
$neutral-100: #F3F4F6;
$neutral-200: #E5E7EB;
$neutral-300: #D1D5DB;
$neutral-400: #9CA3AF;
$neutral-500: #6B7280;
$neutral-600: #4B5563;
$neutral-700: #374151;
$neutral-800: #1F2937;
$neutral-900: #111827;

// Other Colors
$white: #FFFFFF;
$black: #000000;
```

### Custom Components

All custom components are located in `src/components/`:

- **Button** - Primary, secondary, ghost variants
- **Input** - Text, password, textarea with error states
- **SearchInput** - Custom search bar with integrated button
- **Checkbox** - Circular checkbox with custom styling
- **Switch** - Toggle switch with animation
- **Card** - Container component
- **ColorSwatch** - Color palette display
- **SectionHeader** - Section headers

## 🔌 API Integration

### Creating New API Endpoints

1. Create a new file in `src/apis/` (e.g., `jobApi.js`)
2. Use `api.injectEndpoints()` to add endpoints
3. Export hooks for use in components

Example:

```javascript
import { api, API_VERSION } from "@/apis/baseApi";

export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query({
            query: ({ page, size }) => ({
                url: `${API_VERSION}/jobs`,
                params: { page, size }
            }),
            providesTags: ["Jobs"]
        }),
        createJob: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/jobs`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Jobs"]
        }),
    })
});

export const {
    useGetJobsQuery,
    useCreateJobMutation,
} = jobApi;
```

### Using API Hooks in Components

```javascript
import { useGetJobsQuery, useCreateJobMutation } from '@/apis/jobApi';

function JobList() {
    const { data, isLoading, error } = useGetJobsQuery({ page: 1, size: 10 });
    const [createJob] = useCreateJobMutation();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {data?.map(job => (
                <div key={job.id}>{job.title}</div>
            ))}
        </div>
    );
}
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible)
npm run eject
```

### Code Style

- Use functional components with hooks
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Component Guidelines

1. **File Structure**: Each component in its own folder
2. **Naming**: PascalCase for components, camelCase for utilities
3. **Styling**: SCSS modules or Tailwind classes
4. **Props**: Use PropTypes or TypeScript for type checking

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Environment Variables

Make sure to set the correct `REACT_APP_API_URL` in your production environment.

### Deployment Platforms

The app can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting
- GitHub Pages

## 📚 Additional Documentation

- [RTK Query Setup](./RTK_QUERY_SETUP.md) - Detailed RTK Query guide
- [Redux Persist Setup](./REDUX_PERSIST_SETUP.md) - State persistence guide
- [Design System](./DESIGN_SYSTEM.md) - Design guidelines
- [Setup Guide](./SETUP_GUIDE.md) - Guide for replicating setup

## 🐛 Troubleshooting

### Common Issues

**1. Module not found errors**
```bash
npm install
```

**2. Port 3000 already in use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**3. Redux persist rehydration issues**
```bash
# Clear localStorage
localStorage.clear()
```

**4. API connection errors**
- Check `REACT_APP_API_URL` in `.env`
- Verify backend is running
- Check CORS settings

## 📞 Support

For issues or questions:
- Check existing documentation
- Review code comments
- Contact the development team

## 📝 License

[Your License Here]
