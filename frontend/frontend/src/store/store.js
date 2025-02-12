import { configureStore } from "@reduxjs/toolkit";

import userReducer from '../features/user/userSlice';
import scriptReducer from '../features/script/scriptSlice';
import dataReducer from '../features/data/dataSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        script: scriptReducer,
        analyticsData: dataReducer
    }
})