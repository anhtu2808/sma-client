import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        preview: null,
        showPreview: false
    },
    reducers: {
        setRealtimePreview(state, action) {
            state.preview = action.payload;
            state.showPreview = true;
        },
        hidePreview(state) {
            state.showPreview = false;
            state.preview = null;
        }
    }
});

export const { setRealtimePreview, hidePreview } = notificationSlice.actions;
export default notificationSlice.reducer;