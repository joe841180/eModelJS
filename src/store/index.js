import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";

const store = configureStore({
  reducer: {
    authentication: authReducer,
  },
});

export default store;
