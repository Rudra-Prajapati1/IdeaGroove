import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* =========================================================
   FETCH ALL HOBBIES
========================================================= */

export const fetchHobbies = createAsyncThunk(
  "hobby/fetchHobbies",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/hobbies");
      return data.hobbies;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch hobbies",
      );
    }
  },
);

/* =========================================================
   SLICE
========================================================= */

const hobbySlice = createSlice({
  name: "hobby",
  initialState: {
    hobbies: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHobbies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHobbies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hobbies = action.payload;
      })
      .addCase(fetchHobbies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default hobbySlice.reducer;

/* =========================================================
   SELECTORS
========================================================= */

export const selectHobbies = (state) => state.hobby.hobbies;
export const selectHobbiesStatus = (state) => state.hobby.status;
export const selectHobbiesError = (state) => state.hobby.error;
