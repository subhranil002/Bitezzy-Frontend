import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";
import homeSlice from "./slices/homeSlice";
import recipeSlice from "./slices/recipeSlice";
import reviewSlice from "./slices/reviewSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    home: homeSlice.reducer,
    recipe: recipeSlice.reducer,
    chat: chatSlice.reducer,
    review: reviewSlice.reducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV === "development",
});

export default store;
