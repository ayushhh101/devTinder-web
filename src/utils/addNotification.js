import { createSlice, nanoid } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (notification) => {
        return {
          payload: {
            id: nanoid(),           // unique identifier
            read: false,            // default unread
            timestamp: Date.now(),  // optional for sorting
            ...notification
          }
        };
      }
    },
    markNotificationRead: (state, action) => {
      const notif = state.find(n => n.id === action.payload.id);
      if (notif) {
        notif.read = true;
      }
    },
    markAllRead: (state) => {
      return state.map(n => ({ ...n, read: true }));
    },
    clearNotifications: () => []
  }
});

export const { addNotification, markNotificationRead, markAllRead, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
