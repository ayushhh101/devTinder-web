import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";

const appStore = configureStore({
  reducer: {
    // Add your reducers here
    user: userReducer,
    feed: feedReducer,
    connections : connectionReducer,
    requests: requestReducer
  },
})

export default appStore;