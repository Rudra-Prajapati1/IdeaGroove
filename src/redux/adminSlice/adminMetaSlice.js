import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { buildDegreeSubjectMap, normalizeArrayResponse } from "./adminHelpers";

const initialState = {
  degreeSubjectMap: {},
  degreeStatus: "idle",
  degreeError: null,
  hobbies: [],
  hobbiesStatus: "idle",
  hobbiesError: null,
};

export const fetchAdminDegreeSubjectData = createAsyncThunk(
  "adminMeta/fetchAdminDegreeSubjectData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/degreeSubject/allDegreeSubject");
      return buildDegreeSubjectMap(data?.degreeSubject || []);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin degree data",
      );
    }
  },
);

export const fetchAdminHobbies = createAsyncThunk(
  "adminMeta/fetchAdminHobbies",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/hobbies");
      return normalizeArrayResponse(data, ["hobbies", "data"])
        .map((item) => item?.Hobby_Name ?? item?.hobby_name ?? String(item))
        .filter(Boolean)
        .sort((a, b) => String(a).localeCompare(String(b)));
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin hobbies",
      );
    }
  },
);

const adminMetaSlice = createSlice({
  name: "adminMeta",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDegreeSubjectData.pending, (state) => {
        state.degreeStatus = "loading";
        state.degreeError = null;
      })
      .addCase(fetchAdminDegreeSubjectData.fulfilled, (state, action) => {
        state.degreeStatus = "succeeded";
        state.degreeSubjectMap = action.payload;
      })
      .addCase(fetchAdminDegreeSubjectData.rejected, (state, action) => {
        state.degreeStatus = "failed";
        state.degreeError = action.payload;
      })
      .addCase(fetchAdminHobbies.pending, (state) => {
        state.hobbiesStatus = "loading";
        state.hobbiesError = null;
      })
      .addCase(fetchAdminHobbies.fulfilled, (state, action) => {
        state.hobbiesStatus = "succeeded";
        state.hobbies = action.payload;
      })
      .addCase(fetchAdminHobbies.rejected, (state, action) => {
        state.hobbiesStatus = "failed";
        state.hobbiesError = action.payload;
      });
  },
});

export default adminMetaSlice.reducer;

export const selectAdminDegreeSubjectMap = (state) =>
  state.adminMeta.degreeSubjectMap;

export const selectAdminDegreeOptions = createSelector(
  selectAdminDegreeSubjectMap,
  (degreeSubjectMap) => Object.keys(degreeSubjectMap).sort((a, b) => a.localeCompare(b)),
);

export const selectAdminHobbyOptions = (state) => state.adminMeta.hobbies;
