// import {
//   createAsyncThunk,
//   createEntityAdapter,
//   createSlice,
// } from "@reduxjs/toolkit";
// import api from "../../api/axios"; // Assuming you have this for API calls

// const studentsAdapter = createEntityAdapter({
<<<<<<< HEAD
//   selectId: (student) => student.student_id,
=======
//   selectId: (student) => student.S_ID,
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
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

<<<<<<< HEAD
=======


>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
// // 🔹 Update Student
// export const updateStudentProfile = createAsyncThunk(
//   "students/updateStudentProfile",
//   async (updatedData, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post(`/students/update`, updatedData);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
<<<<<<< HEAD
//         err.response?.data?.error || "Failed to update profile",
//       );
//     }
//   },
=======
//         err.response?.data?.error || "Failed to update profile"
//       );
//     }
//   }
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
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
<<<<<<< HEAD
//         err.response?.data?.error || "Failed to delete account",
//       );
//     }
//   },
// );

=======
//         err.response?.data?.error || "Failed to delete account"
//       );
//     }
//   }
// );


>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
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

<<<<<<< HEAD
=======


>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
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
<<<<<<< HEAD
=======

/* ===============================
   ENTITY ADAPTER
================================= */
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7

// 1. Adapter Configuration
const studentsAdapter = createEntityAdapter({
<<<<<<< HEAD
  selectId: (student) => student.student_id || student.S_ID, // Handle varied ID names
  sortComparer: (a, b) => (a.Name || "").localeCompare(b.Name || ""),
=======
  selectId: (student) => student.S_ID,
  sortComparer: (a, b) => a.Name.localeCompare(b.Name),
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
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

  // Master lists for dropdowns
  colleges: [],
  degrees: [],
  hobbies: [],
});

<<<<<<< HEAD
// 🔹 Fetch Students
=======
/* ===============================
   THUNKS
================================= */

// 🔹 Fetch Students (Search Page)
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
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

<<<<<<< HEAD
// 🔹 Update Student (FIXED)
=======
// 🔹 Fetch Logged-in Student Profile
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
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
export const updateStudentProfile = createAsyncThunk(
  "students/updateStudentProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
<<<<<<< HEAD
      const response = await api.post(`/students/update`, updatedData);

      // FIXED: The backend returns { message: "...", updatedUser: {...} }
      // We must return the user object, not "data.data" (which is undefined)
      return response.data.updatedUser || response.data;
=======
      const { data } = await api.post("/students/update", updatedData);
      return data;
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
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

<<<<<<< HEAD
=======
/* ===== MASTER LIST THUNKS ===== */

export const fetchAllColleges = createAsyncThunk(
  "students/fetchAllColleges",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/students/meta/colleges");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch colleges");
    }
  }
);

export const fetchAllDegrees = createAsyncThunk(
  "students/fetchAllDegrees",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/students/meta/degrees");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch degrees");
    }
  }
);

export const fetchAllHobbiesMaster = createAsyncThunk(
  "students/fetchAllHobbiesMaster",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/students/meta/hobbies");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch hobbies");
    }
  }
);

/* ===============================
   SLICE
================================= */

>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
<<<<<<< HEAD
      // Fetch
=======
      /* ===== FETCH STUDENTS ===== */
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
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

<<<<<<< HEAD
      // Update
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        // Upsert requires a valid entity object with an ID
        if (action.payload) {
          studentsAdapter.upsertOne(state, action.payload);
        }
      })

      // Delete
=======
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
        studentsAdapter.upsertOne(state, action.meta.arg);
        if (
          state.currentStudent &&
          state.currentStudent.S_ID === action.meta.arg.student_id
        ) {
          state.currentStudent = {
            ...state.currentStudent,
            ...action.meta.arg,
          };
        }
      })

      /* ===== DELETE STUDENT ===== */
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
      .addCase(deleteStudentAccount.fulfilled, (state, action) => {
        studentsAdapter.removeOne(state, action.payload);
        if (
          state.currentStudent &&
          state.currentStudent.S_ID === action.payload
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
} = studentsAdapter.getSelectors((state) => state.students);

export const selectStudentsStatus = (state) => state.students.status;
export const selectStudentsError = (state) => state.students.error;
export const selectStudentsPagination = (state) => ({
  page: state.students.page,
  totalPages: state.students.totalPages,
  total: state.students.total,
});
<<<<<<< HEAD
=======

export const selectCurrentStudent = (state) => state.students.currentStudent;
export const selectCurrentStudentStatus = (state) => state.students.currentStatus;
export const selectCurrentStudentError = (state) => state.students.currentError;

// Master List Selectors
export const selectAllColleges = (state) => state.students.colleges;
export const selectAllDegrees = (state) => state.students.degrees;
export const selectAllHobbiesMaster = (state) => state.students.hobbies;
>>>>>>> 956b3b8ed8a4583780208093e954fbe1ec9e65f7
