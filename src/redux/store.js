import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";
import homeSlice from "./slices/homeSlice";
import profileSlice from "./slices/profileSlice";
import recipeSlice from "./slices/recipeSlice";
import reviewSlice from "./slices/reviewSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    home: homeSlice.reducer,
    profile: profileSlice.reducer,
    recipe: recipeSlice.reducer,
    chat: chatSlice.reducer,
    review: reviewSlice.reducer,
  },
  devTools: true,
});

export default store;
