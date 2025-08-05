import {configureStore} from '@reduxjs/toolkit' ; 
import { userSlice } from './slices/userSlice';
import { chatSlice } from './slices/chatSlice';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        chat: chatSlice.reducer,
    },
}) ;

