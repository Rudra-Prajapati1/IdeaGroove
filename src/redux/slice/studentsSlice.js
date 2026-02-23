import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios"; // Assuming you have this for API calls

const studentsAdapter = createEntityAdapter({
  selectId: (student) => student.S_ID,
  sortComparer: (a, b) => a.Name.localeCompare(b.Name), // Alphabetical sort
});

const initialState = studentsAdapter.getInitialState({
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,
});

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

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
