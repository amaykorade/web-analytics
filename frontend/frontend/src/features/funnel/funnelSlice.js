import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createFunnel, getFunnels, getFunnelStats, updateFunnel, deleteFunnel } from "../../services/funnelApi";

export const createFunnelThunk = createAsyncThunk(
    'funnel/create',
    async (funnelData, { rejectWithValue }) => {
        try {
            const response = await createFunnel(funnelData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                "Failed to create funnel"
            );
        }
    }
);

export const getFunnelsThunk = createAsyncThunk(
    'funnel/getAll',
    async ({ userId, websiteName }, { rejectWithValue }) => {
        try {
            const response = await getFunnels(userId, websiteName);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch funnels");
        }
    }
);

export const getFunnelStatsThunk = createAsyncThunk(
    'funnel/getStats',
    async ({ funnelId, userId, websiteName, startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await getFunnelStats(funnelId, userId, websiteName, startDate, endDate);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch funnel stats");
        }
    }
);

export const updateFunnelThunk = createAsyncThunk(
    'funnel/update',
    async ({ funnelId, funnelData }, { rejectWithValue }) => {
        try {
            const response = await updateFunnel(funnelId, funnelData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update funnel");
        }
    }
);

export const deleteFunnelThunk = createAsyncThunk(
    'funnel/delete',
    async ({ funnelId, userId }, { rejectWithValue }) => {
        try {
            const response = await deleteFunnel(funnelId, userId);
            return response.funnelId; // Return the deleted funnel ID
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                "Failed to delete funnel"
            );
        }
    }
);

const funnelSlice = createSlice({
    name: "funnel",
    initialState: {
        funnels: [],
        currentFunnel: null,
        funnelStats: null,
        loading: false,
        error: null,
    },
    reducers: {
        setCurrentFunnel: (state, action) => {
            state.currentFunnel = action.payload;
        },
        clearFunnelStats: (state) => {
            state.funnelStats = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Funnel
            .addCase(createFunnelThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFunnelThunk.fulfilled, (state, action) => {
                state.funnels.push(action.payload);
                state.loading = false;
            })
            .addCase(createFunnelThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All Funnels
            .addCase(getFunnelsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFunnelsThunk.fulfilled, (state, action) => {
                state.funnels = action.payload;
                state.loading = false;
            })
            .addCase(getFunnelsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Funnel Stats
            .addCase(getFunnelStatsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFunnelStatsThunk.fulfilled, (state, action) => {
                state.funnelStats = action.payload;
                state.loading = false;
            })
            .addCase(getFunnelStatsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Funnel
            .addCase(updateFunnelThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFunnelThunk.fulfilled, (state, action) => {
                const index = state.funnels.findIndex(f => f._id === action.payload._id);
                if (index !== -1) {
                    state.funnels[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateFunnelThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Funnel
            .addCase(deleteFunnelThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFunnelThunk.fulfilled, (state, action) => {
                state.funnels = state.funnels.filter(f => f._id !== action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteFunnelThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setCurrentFunnel, clearFunnelStats } = funnelSlice.actions;
export default funnelSlice.reducer; 