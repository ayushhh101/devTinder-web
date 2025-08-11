import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      state.push(action.payload);
    },
    markAllRead: (state) => {
      return state.map(n => ({ ...n, read: true }));
    },
    clearNotifications: () => []
  }
});

export const { addNotification, markAllRead, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
