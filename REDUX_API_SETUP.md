# Redux Toolkit & API Setup

## 📦 Installed Packages
- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux
- `axios` - HTTP client for API calls

## 📁 File Structure

```
src/
├── store/
│   ├── index.js              # Redux store configuration
│   └── slices/
│       └── exampleSlice.js   # Example slice with async thunk
├── services/
│   └── apiClient.js          # Axios instance with interceptors
└── .env                      # Environment variables
```

## 🔧 Configuration Files

### `.env` (Development)
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

### `.env.production` (Production)
```env
REACT_APP_API_URL=https://your-production-api.com/api
REACT_APP_ENV=production
```

## 🚀 Usage

### 1. API Client
```javascript
import apiClient from '@/services/apiClient';

// GET request
const data = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', { name: 'John' });

// PUT request
const updated = await apiClient.put('/users/1', { name: 'Jane' });

// DELETE request
await apiClient.delete('/users/1');
```

### 2. Redux Slice Example
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchExampleData } from '@/store/slices/exampleSlice';

function MyComponent() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.example);

    useEffect(() => {
        dispatch(fetchExampleData({ page: 1 }));
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{JSON.stringify(data)}</div>;
}
```

### 3. Creating New Slice
```javascript
// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/apiClient';

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/users');
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;
```

### 4. Add Slice to Store
```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        users: userReducer,
    },
});
```

## 🔐 Authentication

The API client automatically:
- Adds `Authorization: Bearer <token>` header if token exists in localStorage
- Redirects to `/login` on 401 Unauthorized
- Handles network errors globally

## 🌍 Environment Variables

Access environment variables:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
const env = process.env.REACT_APP_ENV;
```

**Note:** 
- Environment variables must start with `REACT_APP_`
- Restart dev server after changing `.env` file
- Don't commit `.env` to git (already in `.gitignore`)

## 📝 Best Practices

1. **API Calls**: Always use `apiClient` instead of direct axios
2. **Error Handling**: Errors are handled globally in interceptors
3. **Token Management**: Store JWT in localStorage as `token`
4. **Slice Naming**: Use descriptive names like `userSlice`, `authSlice`
5. **Async Thunks**: Use for all API calls in Redux
