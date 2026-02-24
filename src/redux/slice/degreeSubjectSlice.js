import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ======================================================
   THUNK : Fetch Degree - Subject Mapping
====================================================== */

export const fetchDegreeSubject = createAsyncThunk(
  "degreeSubject/fetchDegreeSubject",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/degreeSubject/allDegreeSubject");

      // API:
      // { status: true, degreeSubject: [...] }

      return response.data.degreeSubject;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch degree subject",
      );
    }
  },
);

/* ======================================================
   INITIAL STATE
====================================================== */

const initialState = {
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  data: [], // full mapping
  degree: [], // unique degrees
  subject: [], // unique subjects
};

/* ======================================================
   SLICE
====================================================== */

const degreeSubjectSlice = createSlice({
  name: "degreeSubject",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ---------------- PENDING ---------------- */
      .addCase(fetchDegreeSubject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      /* ---------------- SUCCESS ---------------- */
      .addCase(fetchDegreeSubject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;

        /* ===== Extract Unique Degrees ===== */
        const uniqueDegrees = [
          ...new Map(
            action.payload.map((item) => [
              item.Degree_ID,
              {
                Degree_ID: item.Degree_ID,
                degree_name: item.degree_name,
              },
            ]),
          ).values(),
        ];

        /* ===== Extract Unique Subjects ===== */
        const uniqueSubjects = [
          ...new Map(
            action.payload.map((item) => [
              item.Subject_ID,
              {
                Subject_ID: item.Subject_ID,
                subject_name: item.subject_name,
              },
            ]),
          ).values(),
        ];

        state.degree = uniqueDegrees;
        state.subject = uniqueSubjects;
      })

      /* ---------------- ERROR ---------------- */
      .addCase(fetchDegreeSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default degreeSubjectSlice.reducer;

/* ======================================================
   SELECTORS (VERY IMPORTANT PART)
====================================================== */

/* ---------- Base Selector ---------- */
const selectDegreeSubjectState = (state) => state.degreeSubject;

/* ---------- Status ---------- */
export const selectDegreeSubjectStatus = createSelector(
  [selectDegreeSubjectState],
  (degreeSubject) => degreeSubject.status,
);

/* ---------- Error ---------- */
export const selectDegreeSubjectError = createSelector(
  [selectDegreeSubjectState],
  (degreeSubject) => degreeSubject.error,
);

/* ---------- Full Mapping ---------- */
export const selectAllDegreeSubject = createSelector(
  [selectDegreeSubjectState],
  (degreeSubject) => degreeSubject.data,
);

/* ---------- All Degrees ---------- */
export const selectAllDegrees = createSelector(
  [selectDegreeSubjectState],
  (degreeSubject) => degreeSubject.degree,
);

/* ---------- All Subjects ---------- */
export const selectAllSubjects = createSelector(
  [selectDegreeSubjectState],
  (degreeSubject) => degreeSubject.subject,
);

/* ======================================================
   DYNAMIC SELECTORS
====================================================== */

/* ---------- Subjects By Degree (DEPENDENT DROPDOWN) ---------- */
export const selectSubjectsByDegree = (degreeId) =>
  createSelector([selectAllDegreeSubject], (data) =>
    data.filter((item) => item.Degree_ID === degreeId),
  );

/* ---------- Degree By Subject (Reverse Mapping - Very Useful) ---------- */
export const selectDegreesBySubject = (subjectId) =>
  createSelector([selectAllDegreeSubject], (data) =>
    data.filter((item) => item.Subject_ID === subjectId),
  );
