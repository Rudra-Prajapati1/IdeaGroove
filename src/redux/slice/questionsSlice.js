import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const questionsAdapter = createEntityAdapter({
  selectId: (questions) => questions.Q_ID,
  sortComparer: (a, b) => new Date(b.Added_On) - new Date(a.Added_On),
});

const initialState = questionsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/collections/${
          import.meta.env.VITE_MOCKMAN_API_KEY
        }/693edc11b6dbbbd14cf90cb7/documents`
      );

      return data.map((d) => d.data);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch Question");
    }
  }
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
        questionsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  selectAll: selectAllQuestions,
  selectById: selectQuestionById,
  selectIds: selectQuestionIds,
  selectEntities: selectQuestionEntities,
} = questionsAdapter.getSelectors((state) => state.questions);

export const selectQuestionsStatus = (state) => state.questions.status;
export const selectQuestionsError = (state) => state.questions.error;

export default questionsSlice.reducer;
