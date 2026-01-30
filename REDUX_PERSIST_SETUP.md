# Redux Persist Setup

## 📦 Installed Packages
- `redux-persist` - Persist and rehydrate Redux store

## 🔧 Configuration

### Store Setup (`src/store/index.js`)
```javascript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { api } from '@/apis/baseApi';
import userReducer from './slices/userSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // Persist user slice
    blacklist: [api.reducerPath], // Don't persist RTK Query cache
};

const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['user', 'token'], // Only persist specific fields
};

const rootReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
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

### App Integration (`src/index.js`)
```javascript
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
```

## 🚀 Usage

### Persist Configuration Options

**Root Persist Config:**
- `key`: Storage key name
- `storage`: Storage engine (localStorage by default)
- `whitelist`: Array of reducer keys to persist
- `blacklist`: Array of reducer keys NOT to persist

**Individual Slice Persist Config:**
```javascript
const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['user', 'token'], // Only these fields
};

// Apply to specific reducer
user: persistReducer(userPersistConfig, userReducer)
```

### Example Slice with Persist
```javascript
// src/store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});
```

### Clear Persisted State
```javascript
import { persistor } from './store';

// Clear all persisted state
persistor.purge();

// Or clear specific keys
persistor.flush();
```

## 📝 Best Practices

### 1. Don't Persist RTK Query Cache
```javascript
blacklist: [api.reducerPath]
```
RTK Query manages its own cache and refetching.

### 2. Persist Only Necessary Data
```javascript
whitelist: ['user', 'token'] // Not entire state
```

### 3. Use Individual Slice Configs
For fine-grained control:
```javascript
const examPersistConfig = {
    key: 'exam',
    storage,
    whitelist: ['answers', 'currentPartIndex'],
};
```

### 4. Handle Serialization Errors
```javascript
middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
    })
```

## 🔐 Security Considerations

**Don't persist sensitive data in localStorage:**
- Passwords
- Credit card info
- Personal identification

**For tokens:**
- Consider using `sessionStorage` instead
- Or encrypt before persisting

```javascript
import sessionStorage from 'redux-persist/lib/storage/session';

const userPersistConfig = {
    key: 'user',
    storage: sessionStorage, // Use session storage
};
```

## 🧪 Testing Persistence

**Check localStorage:**
```javascript
// In browser console
localStorage.getItem('persist:root')
localStorage.getItem('persist:user')
```

**Clear during development:**
```javascript
localStorage.clear()
```

## 🎯 Common Patterns

### Pattern 1: User Authentication
```javascript
whitelist: ['user'] // Persist logged-in user
```

### Pattern 2: Form Data
```javascript
whitelist: ['exam', 'quiz'] // Persist exam answers
```

### Pattern 3: UI Preferences
```javascript
whitelist: ['ui', 'theme'] // Persist dark mode, language
```

## 🔄 Migration

When changing state structure:
```javascript
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    migrate: (state) => {
        // Transform old state to new structure
        return Promise.resolve(state);
    },
};
```
