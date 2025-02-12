import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateScript, getScript, verifyScriptInstallation } from "../../services/scriptApi";



export const getScriptThunk = createAsyncThunk(
    'script/get-script', async (_, { rejectWithValue }) => {
        try {
            const response = await getScript();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
)

export const generateScriptThunk = createAsyncThunk(
    'script/generate-script', async (url, { rejectWithValue }) => {
        try {
            const response = await generateScript(url);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
)

export const verifyScriptThunk = createAsyncThunk(
    'script/verify-script', async (url, { rejectWithValue }) => {
        try {
            const response = await verifyScriptInstallation(url);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
)


const scriptSlice = createSlice({
    name: "script",
    initialState: {
        data: null,
        isInstalled: false,
        loading: false,
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getScriptThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getScriptThunk.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(getScriptThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(generateScriptThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateScriptThunk.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(generateScriptThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyScriptThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyScriptThunk.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isInstalled = true;
                state.loading = false;
            })
            .addCase(verifyScriptThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const userData = (state) => state.script.data;

export default scriptSlice.reducer;