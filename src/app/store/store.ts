import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import voicesSlice from "./slices/voiceSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        voices: voicesSlice
    }
})