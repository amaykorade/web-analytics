import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAnalytics } from "../../services/dataApi";
import dayjs from "dayjs";

export const getAnalyticsThunk = createAsyncThunk(
    'analyticsData/total-data', async ({ userID, websiteName, startDate, endDate }, { rejectWithValue }) => {
        try {
            const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
            const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
            const response = await getAnalytics(userID, websiteName, formattedStartDate, formattedEndDate);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
);

const initialState = {
    data: null,
    loading: false,
    error: null
};

const analyticsSlice = createSlice({
    name: 'analyticsData',
    initialState,
    reducers: {
        clearAnalytics: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAnalyticsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAnalyticsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getAnalyticsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAnalytics } = analyticsSlice.actions;
export const analyticsData = (state) => state.analyticsData.data;
export default analyticsSlice.reducer;