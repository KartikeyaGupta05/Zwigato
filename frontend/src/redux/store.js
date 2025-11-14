import { configureStore } from '@reduxjs/toolkit';
import userSlice from './reducer/userSlice';
import ownerSlice from './reducer/ownerSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    owner: ownerSlice,
  },
});