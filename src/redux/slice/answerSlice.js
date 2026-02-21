import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const answersAdapter = createEntityAdapter({
  selectId: (answer) => answer.A_ID,
  sortComparer: (a, b) => new Date(b.Answered_On) - new Date(a.Answered_On),
});

const initialState = answersAdapter.getInitialState({
  status: "idle",
  error: null,
});

/* ================= FETCH ANSWERS ================= */

export const fetchAnswers = createAsyncThunk(
  "answers/fetchAnswers",
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/qna?page=${page}&limit=${limit}`);

      return data.QnA;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch answers",
      );
    }
  },
);

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.status = "succeeded";

        const answers = action.payload
          .filter((row) => row.A_ID)
          .map((row) => ({
            A_ID: row.A_ID,
            Q_ID: row.Q_ID,
            Answer: row.Answer,
            Answer_Author: row.Answer_Author,
            Answered_On: row.Answered_On,
          }));

        answersAdapter.setAll(state, answers);
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default answersSlice.reducer;

export const { selectAll: selectAllAnswers } = answersAdapter.getSelectors(
  (state) => state.answers,
);

export const selectAnswersStatus = (state) => state.answers.status;

export const selectAnswersError = (state) => state.answers.error;
