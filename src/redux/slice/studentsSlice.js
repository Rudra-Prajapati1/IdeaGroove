import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ===============================
   ENTITY ADAPTER
================================= */

const studentsAdapter = createEntityAdapter({
  selectId: (student) => student.S_ID, // Standardized ID
  sortComparer: (a, b) =>
    (a.Name || "").localeCompare(b.Name || ""),
});

/* ===============================
   INITIAL STATE
================================= */

const initialState = studentsAdapter.getInitialState({
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,

  // Logged-in profile
  currentStudent: null,
  currentStatus: "idle",
  currentError: null,

  // Master lists
  colleges: [],
  degrees: [],
  hobbies: [],
});

/* ===============================
   THUNKS
================================= */

// 🔹 Fetch Students (Search Page)
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (
    { q = "", department = "All Departments", page = 1, limit = 20 } = {},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get("/students/search", {
        params: { q, department, page, limit },
      });

      return {
        data: data.data,
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        total: data.pagination.total,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch students"
      );
    }
  }
);

// 🔹 Fetch Logged-in Student
export const fetchCurrentStudent = createAsyncThunk(
  "students/fetchCurrentStudent",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/students/me/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
);

// 🔹 Update Student
export const updateStudentProfile = createAsyncThunk(
  "students/updateStudentProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/students/update",
        updatedData
      );

      // Backend returns { message, updatedUser }
      return (
        response.data.updatedUser || response.data
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          "Failed to update profile"
      );
    }
  }
);

// 🔹 Delete Student
export const deleteStudentAccount = createAsyncThunk(
  "students/deleteStudentAccount",
  async (id, { rejectWithValue }) => {
    try {
      await api.get(`/students/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          "Failed to delete account"
      );
    }
  }
);

/* ===== MASTER LIST THUNKS ===== */

export const fetchAllColleges = createAsyncThunk(
  "students/fetchAllColleges",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/students/meta/colleges"
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          "Failed to fetch colleges"
      );
    }
  }
);

export const fetchAllDegrees = createAsyncThunk(
  "students/fetchAllDegrees",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/students/meta/degrees"
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          "Failed to fetch degrees"
      );
    }
  }
);

export const fetchAllHobbiesMaster = createAsyncThunk(
  "students/fetchAllHobbiesMaster",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/students/meta/hobbies"
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          "Failed to fetch hobbies"
      );
    }
  }
);

/* ===============================
   SLICE
================================= */

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ===== FETCH STUDENTS ===== */
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
        studentsAdapter.setAll(
          state,
          action.payload.data
        );
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ===== FETCH CURRENT STUDENT ===== */
      .addCase(fetchCurrentStudent.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
      })
      .addCase(fetchCurrentStudent.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.currentStudent = action.payload;
      })
      .addCase(fetchCurrentStudent.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.payload;
      })

      /* ===== UPDATE STUDENT ===== */
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        if (action.payload) {
          studentsAdapter.upsertOne(
            state,
            action.payload
          );

          if (
            state.currentStudent &&
            state.currentStudent.S_ID ===
              action.payload.S_ID
          ) {
            state.currentStudent = action.payload;
          }
        }
      })

      /* ===== DELETE STUDENT ===== */
      .addCase(deleteStudentAccount.fulfilled, (state, action) => {
        studentsAdapter.removeOne(
          state,
          action.payload
        );

        if (
          state.currentStudent &&
          state.currentStudent.S_ID ===
            action.payload
        ) {
          state.currentStudent = null;
        }
      })

      /* ===== MASTER LISTS ===== */
      .addCase(fetchAllColleges.fulfilled, (state, action) => {
        state.colleges = action.payload;
      })
      .addCase(fetchAllDegrees.fulfilled, (state, action) => {
        state.degrees = action.payload;
      })
      .addCase(fetchAllHobbiesMaster.fulfilled, (state, action) => {
        state.hobbies = action.payload;
      });
  },
});

export default studentsSlice.reducer;

/* ===============================
   SELECTORS
================================= */

export const {
  selectAll: selectAllStudents,
  selectById: selectStudentById,
} = studentsAdapter.getSelectors(
  (state) => state.students
);

export const selectStudentsStatus = (state) =>
  state.students.status;

export const selectStudentsError = (state) =>
  state.students.error;

export const selectStudentsPagination = (state) => ({
  page: state.students.page,
  totalPages: state.students.totalPages,
  total: state.students.total,
});

export const selectCurrentStudent = (state) =>
  state.students.currentStudent;

export const selectCurrentStudentStatus = (state) =>
  state.students.currentStatus;

export const selectCurrentStudentError = (state) =>
  state.students.currentError;

export const selectAllColleges = (state) =>
  state.students.colleges;

export const selectAllDegrees = (state) =>
  state.students.degrees;

export const selectAllHobbiesMaster = (state) =>
  state.students.hobbies;