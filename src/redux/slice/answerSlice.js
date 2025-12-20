import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
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

export const fetchAnswers = createAsyncThunk(
  "answers/fetchAnswers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/collections/${
          import.meta.env.VITE_MOCKMAN_API_KEY
        }/693edc5cb6dbbbd14cf90cdd/documents`
      );

      return data.map((d) => d.data);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch answers");
    }
  }
);

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.status = "succeeded";
        answersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action?.payload || action.error.message;
      });
  },
});

export const {
  selectAll: selectAllAnswers,
  selectById: selectAnswerById,
  selectIds: selectAnswerIds,
  selectEntities: selectAnswerEntities,
} = answersAdapter.getSelectors((state) => state.answers);

export const selectAnswerByQuestionId = (Q_ID) =>
  createSelector([selectAllAnswers], (answers) =>
    answers.filter((a) => a.Q_ID === Q_ID)
  );

export const selectAnswerCountByQuestionId = (Q_ID) =>
  createSelector(
    [selectAllAnswers],
    (answers) => answers.filter((a) => a.Q_ID === Q_ID).length
  );

export const selectAnswersStatus = (state) => state.answers.status;
export const selectAnswersError = (state) => state.answers.error;

export default answersSlice.reducer;
