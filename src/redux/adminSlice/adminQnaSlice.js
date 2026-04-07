import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  items: [],
  total: 0,
  status: "idle",
  error: null,
  actionStatus: "idle",
  actionError: null,
};

export const fetchAdminQna = createAsyncThunk(
  "adminQna/fetchAdminQna",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/qna");
      const qnas = (data?.QnA || []).map((qna) => ({
        id: qna.Q_ID,
        question: qna.Question,
        authorName: qna.Question_Author,
        authorId: qna.Author_Id,
        addedOn: qna.Added_On,
        answersCount: qna.Total_Answers,
        degreeName: qna.Degree_Name,
        subjectName: qna.Subject_Name,
        status: Number(qna.Is_Active) === 1 ? "active" : "blocked",
        answers: (qna.Answers || []).map((answer) => ({
          id: answer.A_ID,
          text: answer.Answer,
          author: answer.Answer_Author,
          authorId: answer.Answer_Author_Id,
          time: answer.Answered_On,
          status: Number(answer.Is_Active) === 1 ? "active" : "blocked",
        })),
      }));

      return { total: data?.total || qnas.length, items: qnas };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin qna",
      );
    }
  },
);

export const moderateAdminQnaItem = createAsyncThunk(
  "adminQna/moderateAdminQnaItem",
  async ({ action, targetType, id, questionId, reason }, { rejectWithValue }) => {
    try {
      await api.post("/admin/toggle-block", { type: targetType, id, reason });
      return { action, targetType, id, questionId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update admin qna item",
      );
    }
  },
);

const adminQnaSlice = createSlice({
  name: "adminQna",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminQna.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminQna.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total = action.payload.total;
        state.items = action.payload.items;
      })
      .addCase(fetchAdminQna.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(moderateAdminQnaItem.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(moderateAdminQnaItem.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.map((qna) => {
          if (
            action.payload.targetType === "question" &&
            qna.id === action.payload.id
          ) {
            return {
              ...qna,
              status: action.payload.action === "block" ? "blocked" : "active",
            };
          }

          if (
            action.payload.targetType === "answer" &&
            qna.id === action.payload.questionId
          ) {
            return {
              ...qna,
              answers: qna.answers.map((answer) =>
                answer.id === action.payload.id
                  ? {
                      ...answer,
                      status:
                        action.payload.action === "block"
                          ? "blocked"
                          : "active",
                    }
                  : answer,
              ),
            };
          }

          return qna;
        });
      })
      .addCase(moderateAdminQnaItem.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      });
  },
});

export default adminQnaSlice.reducer;

export const selectAdminQna = (state) => state.adminQna.items;
export const selectAdminQnaActionStatus = (state) =>
  state.adminQna.actionStatus;

export const selectAdminQnaStats = createSelector(
  (state) => state.adminQna.total,
  selectAdminQna,
  (total, qnas) => {
    const activeQuestions = qnas.filter((qna) => qna.status === "active");
    const blockedQuestions = qnas.filter((qna) => qna.status === "blocked");
    const totalQuestions = total || qnas.length;

    return [
      {
        title: "Total Questions",
        value: totalQuestions,
        infoText: `${qnas.reduce((sum, qna) => sum + qna.answersCount, 0)} total answers`,
        color: "green",
        type: "total",
      },
      {
        title: "Active Questions",
        value: activeQuestions.length,
        infoText: `${totalQuestions ? Math.round((activeQuestions.length / totalQuestions) * 100) : 0}% visible questions`,
        color: "yellow",
        type: "pending",
      },
      {
        title: "Inactive Questions",
        value: blockedQuestions.length,
        infoText: `${blockedQuestions.length} moderated questions`,
        color: "red",
        type: "blocked",
      },
    ];
  },
);
