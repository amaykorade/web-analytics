import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, getStatus, login, signUp } from "../../services/userApi";

export const signUpthunk = createAsyncThunk(
    'auth/signup',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await signUp(formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
);

export const Loginthunk = createAsyncThunk(
    'auth/login',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await login(formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
);

export const verificationStatusThunk = createAsyncThunk(
    'auth/status',
    async (email, { rejectWithValue }) => {
        console.log("verify", email)
        try {
            const response = await getStatus(email);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
)

export const getCurrentUserthunk = createAsyncThunk(
    'auth/getCurrentUser', async () => {
        try {
            const response = await getCurrentUser();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        isVerified: false,
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null,
                localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCurrentUserthunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentUserthunk.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(getCurrentUserthunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(signUpthunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpthunk.fulfilled, (state, action) => {
                state.user = action.payload;
                state.token = action.payload.token;
                state.loading = false;
            })
            .addCase(signUpthunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(Loginthunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(Loginthunk.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.loading = false;
            })
            .addCase(Loginthunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verificationStatusThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verificationStatusThunk.fulfilled, (state, action) => {
                state.isVerified = action.payload.isVerified;
                state.loading = false;
            })
            .addCase(verificationStatusThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;

export const authData = (state) => state.auth.user;

export default authSlice.reducer;