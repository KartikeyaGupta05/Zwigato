import { configureStore } from '@reduxjs/toolkit';
import userSlice from './reducer/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});