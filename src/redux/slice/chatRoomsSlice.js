import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const groupsAdapter = createEntityAdapter({
  selectId: (group) => group.Room_ID,
  sortComparer: (a, b) => new Date(b.Created_On) - new Date(a.Created_On),
});

const initialState = groupsAdapter.getInitialState({
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,

  previewGroups: [],
  previewStatus: "idle",
  previewError: null,

  userGroups: [],
  userStatus: "idle",
  userError: null,
});

/* ================= FETCH ALL GROUPS ================= */

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async ({ page = 1, limit = 9 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/groups?page=${page}&limit=${limit}`);

      return {
        data: data.data,
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        total: data.pagination.total,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch groups",
      );
    }
  },
);

/* ================= PREVIEW ================= */

export const fetchPreviewGroups = createAsyncThunk(
  "groups/fetchPreviewGroups",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/groups?page=1&limit=3`);
      return data.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch preview groups");
    }
  },
);

/* ================= USER GROUPS ================= */

export const fetchUserGroups = createAsyncThunk(
  "groups/fetchUserGroups",
  async ({ userId, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/groups/user/${userId}?page=${page}&limit=${limit}`,
      );

      return {
        data: data.data,
        page: data.pagination?.page || 1,
        totalPages: data.pagination?.totalPages || 1,
        total: data.pagination?.total || 0,
      };
    } catch (err) {
      return rejectWithValue("Failed to fetch user groups");
    }
  },
);

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ===== ALL ===== */
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;

        groupsAdapter.setAll(state, action.payload.data);
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ===== PREVIEW ===== */
      .addCase(fetchPreviewGroups.pending, (state) => {
        state.previewStatus = "loading";
        state.previewError = null;
      })
      .addCase(fetchPreviewGroups.fulfilled, (state, action) => {
        state.previewStatus = "succeeded";
        state.previewGroups = action.payload;
      })
      .addCase(fetchPreviewGroups.rejected, (state, action) => {
        state.previewStatus = "failed";
        state.previewError = action.payload;
      })

      /* ===== USER ===== */
      .addCase(fetchUserGroups.pending, (state) => {
        state.userStatus = "loading";
        state.userError = null;
      })
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.userGroups = action.payload.data;
      })
      .addCase(fetchUserGroups.rejected, (state, action) => {
        state.userStatus = "failed";
        state.userError = action.payload;
      });
  },
});

export default groupsSlice.reducer;

/* ================= SELECTORS ================= */

export const { selectAll: selectAllGroups, selectById: selectGroupById } =
  groupsAdapter.getSelectors((state) => state.groups);

export const selectGroupsStatus = (state) => state.groups.status;

export const selectGroupsError = (state) => state.groups.error;

export const selectGroupsPagination = (state) => ({
  page: state.groups.page,
  totalPages: state.groups.totalPages,
  total: state.groups.total,
});

export const selectPreviewGroups = (state) => state.groups.previewGroups;

export const selectPreviewGroupsStatus = (state) => state.groups.previewStatus;

export const selectPreviewGroupsError = (state) => state.groups.previewError;

export const selectUserGroups = (state) => state.groups.userGroups;

export const selectUserGroupsStatus = (state) => state.groups.userStatus;

export const selectUserGroupsError = (state) => state.groups.userError;
