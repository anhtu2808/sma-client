# RTK Query API Setup

## 📦 Installed Packages
- `@reduxjs/toolkit` - Includes RTK Query
- `react-redux` - React bindings for Redux
- `lodash` - Utility functions for data manipulation

## 📁 File Structure

```
src/
├── apis/
│   ├── baseApi.js        # RTK Query base API configuration
│   └── userApi.js        # Example user endpoints
├── store/
│   └── index.js          # Redux store with RTK Query
└── .env                  # Environment variables
```

## 🔧 Configuration

### `.env`
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENV=development
```

### Base API (`src/apis/baseApi.js`)
- Custom base query with:
  - Auto Bearer token from localStorage
  - Strip nullish values from params
  - Custom response handler
- Tag types for cache invalidation

## 🚀 Usage

### 1. Query (GET)
```javascript
import { useGetUsersQuery } from '@/apis/userApi';

function UserList() {
    const { data, isLoading, error } = useGetUsersQuery({ 
        page: 1, 
        size: 10,
        search: 'john' 
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ul>
            {data?.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
```

### 2. Lazy Query
```javascript
import { useLazyGetUsersQuery } from '@/apis/userApi';

function SearchUsers() {
    const [trigger, { data, isLoading }] = useLazyGetUsersQuery();

    const handleSearch = (search) => {
        trigger({ search, page: 1, size: 10 });
    };

    return <button onClick={() => handleSearch('john')}>Search</button>;
}
```

### 3. Mutation (POST/PUT/DELETE)
```javascript
import { useCreateUserMutation } from '@/apis/userApi';

function CreateUser() {
    const [createUser, { isLoading, error }] = useCreateUserMutation();

    const handleSubmit = async (formData) => {
        try {
            await createUser(formData).unwrap();
            alert('User created!');
        } catch (err) {
            console.error('Failed to create user:', err);
        }
    };

    return <form onSubmit={handleSubmit}>...</form>;
}
```

## 📝 Creating New API Endpoints

### Step 1: Create API file
```javascript
// src/apis/jobApi.js
import { api, API_VERSION } from "@/apis/baseApi";

export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query({
            query: ({ page, size, category }) => ({
                url: `${API_VERSION}/jobs`,
                params: { page, size, category }
            }),
            providesTags: ["Jobs"]
        }),
        getJobById: builder.query({
            query: ({ jobId }) => ({
                url: `${API_VERSION}/jobs/${jobId}`
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
    useLazyGetJobsQuery,
    useGetJobByIdQuery,
    useCreateJobMutation,
} = jobApi;
```

### Step 2: Add tag type to baseApi
```javascript
// src/apis/baseApi.js
tagTypes: ["Users", "Jobs", "Applications", "Companies"],
```

## 🎯 Key Features

### Auto Caching
RTK Query automatically caches responses and reuses them.

### Auto Refetching
Queries automatically refetch when:
- Component mounts
- Window refocuses
- Network reconnects

### Cache Invalidation
```javascript
// Mutation invalidates cache
invalidatesTags: ["Users"]  // Refetch all Users queries

// Query provides cache tags
providesTags: ["Users"]
```

### Optimistic Updates
```javascript
updateUser: builder.mutation({
    query: ({ userId, ...data }) => ({
        url: `${API_VERSION}/users/${userId}`,
        method: "PUT",
        body: data
    }),
    async onQueryStarted({ userId, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            userApi.util.updateQueryData('getUserById', { userId }, (draft) => {
                Object.assign(draft, patch);
            })
        );
        try {
            await queryFulfilled;
        } catch {
            patchResult.undo();
        }
    },
}),
```

## 🔐 Authentication

Token is automatically added from localStorage:
```javascript
localStorage.setItem('token', 'your-jwt-token');
```

## 🌍 Environment Variables

- `REACT_APP_API_URL` - Base API URL (without /api suffix)
- `REACT_APP_ENV` - Environment name

## ⚡ Benefits over Axios

1. **Auto Caching** - No manual cache management
2. **Auto Refetching** - Smart data synchronization
3. **Loading States** - Built-in `isLoading`, `isFetching`
4. **Error Handling** - Standardized error format
5. **DevTools** - Redux DevTools integration
6. **TypeScript** - Full type safety (if using TS)

## 📚 Advanced Features

### Polling
```javascript
const { data } = useGetUsersQuery(
    { page: 1 },
    { pollingInterval: 3000 } // Refetch every 3s
);
```

### Skip Query
```javascript
const { data } = useGetUserByIdQuery(
    { userId },
    { skip: !userId } // Don't fetch if no userId
);
```

### Prefetching
```javascript
import { useDispatch } from 'react-redux';
import { userApi } from '@/apis/userApi';

const dispatch = useDispatch();

// Prefetch on hover
const handleMouseEnter = () => {
    dispatch(userApi.util.prefetch('getUserById', { userId: 1 }));
};
```
