import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/apiClient';

// Example async thunk for API call
export const fetchExampleData = createAsyncThunk(
    'example/fetchData',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/example-endpoint', { params });
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const exampleSlice = createSlice({
    name: 'example',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Synchronous actions
        clearData: (state) => {
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch data
            .addCase(fetchExampleData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExampleData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchExampleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearData } = exampleSlice.actions;
export default exampleSlice.reducer;
