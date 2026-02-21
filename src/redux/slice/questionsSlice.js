import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const questionsAdapter = createEntityAdapter({
  selectId: (question) => question.Q_ID,
  sortComparer: (a, b) => new Date(b.Added_On) - new Date(a.Added_On),
});

const initialState = questionsAdapter.getInitialState({
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,
});

/* ================= FETCH QUESTIONS ================= */

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/qna?page=${page}&limit=${limit}`);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch questions",
      );
    }
  },
);

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { QnA, page, totalPages, total } = action.payload;

        state.page = page;
        state.totalPages = totalPages;
        state.total = total;

        // Extract unique questions
        const uniqueQuestions = [];
        const seen = new Set();

        QnA.forEach((row) => {
          if (!seen.has(row.Q_ID)) {
            seen.add(row.Q_ID);
            uniqueQuestions.push({
              Q_ID: row.Q_ID,
              Question: row.Question,
              Question_Author: row.Question_Author,
              Added_On: row.Added_On,
              Total_Answers: row.Total_Answers,
            });
          }
        });

        questionsAdapter.setAll(state, uniqueQuestions);
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default questionsSlice.reducer;

export const { selectAll: selectAllQuestions, selectById: selectQuestionById } =
  questionsAdapter.getSelectors((state) => state.questions);

export const selectQuestionsStatus = (state) => state.questions.status;

export const selectQuestionsError = (state) => state.questions.error;
