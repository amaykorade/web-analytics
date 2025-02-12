import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getActiveUsers, getAnalytics, getClickRate, getConversionRate, getDeviceData, getTotalVisitors } from "../../services/dataApi";
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

export const getDeviceThunk = createAsyncThunk(
    'anlaytics/device-data', async ({ userID, websiteName, filterBy, startDate, endDate }, { rejectWithValue }) => {
        try {
            const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
            const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
            const response = await getDeviceData(userID, websiteName, filterBy);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
)

export const getVisitorsThunk = createAsyncThunk(
    'analyticsData/total-visistors', async ({ userID, websiteName }, { rejectWithValue }) => {
        try {
            const response = await getTotalVisitors(userID, websiteName);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
);

export const getClickRateThunk = createAsyncThunk(
    'analyticsData/click-rate',
    async ({ userID, websiteName }, { rejectWithValue }) => {
        try {
            const response = await getClickRate(userID, websiteName);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
);

export const getConversionRateThunk = createAsyncThunk(
    'analyticsData/conversion-rate',
    async ({ userID, websiteName }, { rejectWithValue }) => {
        try {
            const response = await getConversionRate(userID, websiteName);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
);

export const getActiveUsersThunk = createAsyncThunk(
    'analyticsData/active-users',
    async ({ userID, websiteName }, { rejectWithValue }) => {
        try {
            const response = await getActiveUsers(userID, websiteName);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error occurred");
        }
    }
);

const dataSlice = createSlice({
    name: "analyticsData",
    initialState: {
        analytics: null,
        devices: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAnalyticsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAnalyticsThunk.fulfilled, (state, action) => {
                state.analytics = action.payload;
                state.loading = false;
            })
            .addCase(getAnalyticsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getDeviceThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDeviceThunk.fulfilled, (state, action) => {
                state.devices = action.payload;
                state.loading = false;
            })
            .addCase(getDeviceThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getVisitorsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVisitorsThunk.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(getVisitorsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getClickRateThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClickRateThunk.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(getClickRateThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getConversionRateThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getConversionRateThunk.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(getConversionRateThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getActiveUsersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getActiveUsersThunk.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(getActiveUsersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const analyticsData = (state) => state.analyticsData.analytics;

export default dataSlice.reducer;