import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  createSelector,
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

  createStatus: "idle",
  createError: null,

  updateStatus: "idle",
  updateError: null,

  previewGroups: [],
  previewStatus: "idle",
  previewError: null,

  userGroups: [],
  userStatus: "idle",
  userError: null,
});

/* =========================================================
   FETCH ALL GROUPS
========================================================= */

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (
    { page = 1, limit = 9, search = "", filter = "all" } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(filter && filter !== "all" && { filter }),
      });
      const { data } = await api.get(`/groups?${params.toString()}`);

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

/* =========================================================
   CREATE GROUP
========================================================= */

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/groups/create", payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create group",
      );
    }
  },
);

/* =========================================================
   UPDATE GROUP
========================================================= */

export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async (payload, { rejectWithValue }) => {
    try {
      // payload: { Room_ID, Room_Name, Based_On, Description }
      const { data } = await api.post("/groups/update", payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update group",
      );
    }
  },
);

/* =========================================================
   JOIN GROUP
========================================================= */

export const joinGroup = createAsyncThunk(
  "groups/joinGroup",
  async ({ Room_ID, Student_ID }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/groups/joinGroup", {
        Room_ID,
        Student_ID,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to join group",
      );
    }
  },
);

/* =========================================================
   LEAVE GROUP
========================================================= */

export const leaveGroup = createAsyncThunk(
  "groups/leaveGroup",
  async ({ Room_ID, Student_ID }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/groups/leaveGroup", {
        Room_ID,
        Student_ID,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to leave group",
      );
    }
  },
);

/* =========================================================
   DELETE GROUP
========================================================= */

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (Room_ID, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/groups/delete/${Room_ID}`);
      return { Room_ID, message: data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete group",
      );
    }
  },
);

/* =========================================================
   PREVIEW GROUPS
========================================================= */

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

/* =========================================================
   USER GROUPS
========================================================= */

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

/* =========================================================
   SLICE
========================================================= */

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH ALL */
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

      /* CREATE */
      .addCase(createGroup.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createGroup.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      /* UPDATE */
      .addCase(updateGroup.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateGroup.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      /* DELETE — optimistic remove from adapter */
      .addCase(deleteGroup.fulfilled, (state, action) => {
        groupsAdapter.removeOne(state, action.payload.Room_ID);
      })

      /* PREVIEW */
      .addCase(fetchPreviewGroups.pending, (state) => {
        state.previewStatus = "loading";
      })
      .addCase(fetchPreviewGroups.fulfilled, (state, action) => {
        state.previewStatus = "succeeded";
        state.previewGroups = action.payload;
      })
      .addCase(fetchPreviewGroups.rejected, (state, action) => {
        state.previewStatus = "failed";
        state.previewError = action.payload;
      })

      /* USER GROUPS */
      .addCase(fetchUserGroups.pending, (state) => {
        state.userStatus = "loading";
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

/* =========================================================
   SELECTORS
========================================================= */

export const { selectAll: selectAllGroups, selectById: selectGroupById } =
  groupsAdapter.getSelectors((state) => state.groups);

export const selectGroupsStatus = (state) => state.groups.status;
export const selectGroupsError = (state) => state.groups.error;

export const selectCreateGroupStatus = (state) => state.groups.createStatus;
export const selectCreateGroupError = (state) => state.groups.createError;

export const selectUpdateGroupStatus = (state) => state.groups.updateStatus;
export const selectUpdateGroupError = (state) => state.groups.updateError;

export const selectGroupsPagination = createSelector(
  (state) => state.groups.page,
  (state) => state.groups.totalPages,
  (state) => state.groups.total,
  (page, totalPages, total) => ({ page, totalPages, total }),
);

export const selectPreviewGroups = (state) => state.groups.previewGroups;
export const selectPreviewGroupsStatus = (state) => state.groups.previewStatus;
export const selectPreviewGroupsError = (state) => state.groups.previewError;

export const selectUserGroups = (state) => state.groups.userGroups;
export const selectUserGroupsStatus = (state) => state.groups.userStatus;
export const selectUserGroupsError = (state) => state.groups.userError;
