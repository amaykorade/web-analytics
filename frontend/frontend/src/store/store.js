import { configureStore } from "@reduxjs/toolkit";

import userReducer from '../features/user/userSlice';
import scriptReducer from '../features/script/scriptSlice';
import dataReducer from '../features/data/dataSlice';
// import authReducer from '../features/auth/authSlice';
import funnelReducer from '../features/funnel/funnelSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        script: scriptReducer,
        analyticsData: dataReducer,
        // auth: authReducer,
        funnel: funnelReducer,
    }
})