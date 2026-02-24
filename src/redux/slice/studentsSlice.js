// import {
//   createAsyncThunk,
//   createEntityAdapter,
//   createSlice,
// } from "@reduxjs/toolkit";
// import api from "../../api/axios"; // Assuming you have this for API calls

// const studentsAdapter = createEntityAdapter({
//   selectId: (student) => student.student_id,
//   sortComparer: (a, b) => a.Name.localeCompare(b.Name), // Alphabetical sort
// });

// const initialState = studentsAdapter.getInitialState({
//   status: "idle",
//   error: null,
//   page: 1,
//   totalPages: 1,
//   total: 0,
// });

// export const fetchStudents = createAsyncThunk(
//   "students/fetchStudents",
//   async (
//     { q = "", department = "All Departments", page = 1, limit = 20 } = {},
//     { rejectWithValue },
//   ) => {
//     try {
//       const { data } = await api.get(`/students/search`, {
//         params: { q, department, page, limit },
//       });
//       return {
//         data: data.data,
//         page: data.pagination.page,
//         totalPages: data.pagination.totalPages,
//         total: data.pagination.total,
//       };
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.error || "Failed to fetch students",
//       );
//     }
//   },
// );

// // 🔹 Update Student
// export const updateStudentProfile = createAsyncThunk(
//   "students/updateStudentProfile",
//   async (updatedData, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post(`/students/update`, updatedData);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.error || "Failed to update profile",
//       );
//     }
//   },
// );

// // 🔹 Delete Student
// export const deleteStudentAccount = createAsyncThunk(
//   "students/deleteStudentAccount",
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.get(`/students/delete/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.error || "Failed to delete account",
//       );
//     }
//   },
// );

// const studentsSlice = createSlice({
//   name: "students",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStudents.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchStudents.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.page = action.payload.page;
//         state.totalPages = action.payload.totalPages;
//         state.total = action.payload.total;
//         studentsAdapter.setAll(state, action.payload.data);
//       })
//       .addCase(fetchStudents.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })

//       .addCase(updateStudentProfile.fulfilled, (state, action) => {
//         studentsAdapter.upsertOne(state, action.payload);
//       })

//       .addCase(deleteStudentAccount.fulfilled, (state, action) => {
//         studentsAdapter.removeOne(state, action.payload);
//       });
//   },
// });

// export default studentsSlice.reducer;

// export const { selectAll: selectAllStudents, selectById: selectStudentById } =
//   studentsAdapter.getSelectors((state) => state.students);

// export const selectStudentsStatus = (state) => state.students.status;
// export const selectStudentsError = (state) => state.students.error;
// export const selectStudentsPagination = (state) => ({
//   page: state.students.page,
//   totalPages: state.students.totalPages,
//   total: state.students.total,
// });

import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

// 1. Adapter Configuration
const studentsAdapter = createEntityAdapter({
  selectId: (student) => student.student_id || student.S_ID, // Handle varied ID names
  sortComparer: (a, b) => (a.Name || "").localeCompare(b.Name || ""),
});

const initialState = studentsAdapter.getInitialState({
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,
});

// 🔹 Fetch Students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (
    { q = "", department = "All Departments", page = 1, limit = 20 } = {},
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.get(`/students/search`, {
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
        err.response?.data?.error || "Failed to fetch students",
      );
    }
  },
);

// 🔹 Update Student (FIXED)
export const updateStudentProfile = createAsyncThunk(
  "students/updateStudentProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/students/update`, updatedData);

      // FIXED: The backend returns { message: "...", updatedUser: {...} }
      // We must return the user object, not "data.data" (which is undefined)
      return response.data.updatedUser || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update profile",
      );
    }
  },
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
        err.response?.data?.error || "Failed to delete account",
      );
    }
  },
);

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
        studentsAdapter.setAll(state, action.payload.data);
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        // Upsert requires a valid entity object with an ID
        if (action.payload) {
          studentsAdapter.upsertOne(state, action.payload);
        }
      })

      // Delete
      .addCase(deleteStudentAccount.fulfilled, (state, action) => {
        studentsAdapter.removeOne(state, action.payload);
      });
  },
});

export default studentsSlice.reducer;

export const { selectAll: selectAllStudents, selectById: selectStudentById } =
  studentsAdapter.getSelectors((state) => state.students);

export const selectStudentsStatus = (state) => state.students.status;
export const selectStudentsError = (state) => state.students.error;
export const selectStudentsPagination = (state) => ({
  page: state.students.page,
  totalPages: state.students.totalPages,
  total: state.students.total,
});
