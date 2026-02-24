import React, { useState } from "react";
import { MessageSquare, Send, Edit2, Trash2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ComplaintButton from "../ComplaintButton";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { createAnswer, deleteQuestion } from "../../redux/slice/qnaSlice";
import { selectAuth } from "../../redux/slice/authSlice";
import { ConfirmationBox } from "../common/ConfirmationBox";
import api from "../../api/axios";

const QnACard = ({ post, isAuth, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [localAnswers, setLocalAnswers] = useState(() => {
    const raw = post.Answers;
    if (!raw) return [];
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  });

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");
  const [deletingAnswerId, setDeletingAnswerId] = useState(null);
  const [answerActionLoading, setAnswerActionLoading] = useState(false);

  if (!post) return null;

  const { user } = useSelector(selectAuth);
  const isOwner = post.Author_Id === user.id;

  // Single source of truth for current user's display name
  const currentUsername = user.username || user.Username || user.name || "";

  const askedDate = post.Added_On
    ? new Date(post.Added_On).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const handleToggle = () => setIsExpanded(!isExpanded);

  /* =================== QUESTION DELETE =================== */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteQuestion(post.Q_ID)).unwrap();
      toast.success("Question Deleted Successfully!");
      if (onDelete) onDelete(post.Q_ID);
    } catch (err) {
      toast.error(err || "Failed to delete question");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  /* =================== ANSWER SUBMIT =================== */
  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    try {
      await dispatch(
        createAnswer({
          Answer: answerText,
          Q_ID: post.Q_ID,
          Answered_By: user.id || user.S_ID,
        }),
      ).unwrap();

      // ✅ FIX: fetch real answers from backend to get the actual A_ID
      // Using Date.now() as A_ID caused 404 on edit because the fake ID
      // doesn't exist in the DB
      const { data } = await api.get(`/qna/answers/${post.Q_ID}`);
      if (data?.answers) {
        setLocalAnswers(data.answers);
      }

      toast.success("Answer posted successfully!");
      setAnswerText("");
    } catch (err) {
      toast.error(err || "Failed to post answer");
    }
  };

  /* =================== ANSWER EDIT =================== */
  const handleStartEditAnswer = (ans) => {
    setEditingAnswerId(ans.A_ID);
    setEditingAnswerText(ans.Answer);
  };

  const handleCancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditingAnswerText("");
  };

  const handleSaveAnswer = async (A_ID) => {
    if (!editingAnswerText.trim()) return;
    setAnswerActionLoading(true);
    try {
      await api.post("/qna/updateAnswer", {
        A_ID,
        Answer: editingAnswerText,
      });

      setLocalAnswers((prev) =>
        prev.map((a) =>
          a.A_ID === A_ID ? { ...a, Answer: editingAnswerText } : a,
        ),
      );

      toast.success("Answer updated successfully!");
      setEditingAnswerId(null);
      setEditingAnswerText("");
    } catch (err) {
      toast.error("Failed to update answer");
    } finally {
      setAnswerActionLoading(false);
    }
  };

  /* =================== ANSWER DELETE =================== */
  const handleDeleteAnswer = async () => {
    setAnswerActionLoading(true);
    try {
      await api.get(`/qna/deleteAnswer/${deletingAnswerId}`);

      setLocalAnswers((prev) =>
        prev.filter((a) => a.A_ID !== deletingAnswerId),
      );

      toast.success("Answer deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete answer");
    } finally {
      setAnswerActionLoading(false);
      setDeletingAnswerId(null);
    }
  };

  /* =================== HELPERS =================== */
  const authorName = post.Question_Author || "Unknown";
  const authorInitial = authorName.charAt(0);

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmationBox
          type="Question"
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}

      {deletingAnswerId && (
        <ConfirmationBox
          type="Answer"
          onClose={() => setDeletingAnswerId(null)}
          onConfirm={handleDeleteAnswer}
        />
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* --- POST HEADER & CONTENT --- */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold overflow-hidden">
                {post.Profile_Pic ? (
                  <img
                    src={post.Profile_Pic}
                    className="rounded-full w-full h-full object-cover"
                    alt={authorName}
                  />
                ) : (
                  authorInitial.toUpperCase()
                )}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {post.Question_Author}
              </span>
              <span className="text-xs text-slate-400">
                • Asked on {askedDate || "Just now"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {post.Subject_Name && (
                <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-md border border-green-100">
                  {post.Subject_Name}
                </span>
              )}

              {isOwner ? (
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={onEdit}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                    title="Edit Question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <ComplaintButton
                  onClick={() => navigate(`/submitComplaint/qna/${post.Q_ID}`)}
                  element="question"
                />
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {post.Question}
          </h3>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <MessageSquare className="w-4 h-4" />
              {localAnswers.length > 0
                ? `${localAnswers.length} Answers`
                : "0 Answers"}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuth) {
                  toast.error("Please login to view the answers");
                  return;
                }
                handleToggle();
              }}
              className={`${!isAuth && "cursor-not-allowed"} text-green-600 text-sm font-semibold hover:underline`}
            >
              {isExpanded ? "Hide Answers" : "View Answers"}
            </button>
          </div>
        </div>

        {/* --- EXPANDED ANSWERS SECTION --- */}
        {isExpanded && (
          <div className="bg-slate-50 p-8 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-4 mb-8">
              {localAnswers.length > 0 ? (
                localAnswers.map((ans) => {
                  const isAnswerOwner = ans.Answer_Author === currentUsername;
                  const isEditingThis = editingAnswerId === ans.A_ID;

                  return (
                    <div
                      key={ans.A_ID}
                      className="bg-white p-5 rounded-2xl border border-slate-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-800">
                          {ans.Answer_Author}
                          <span className="text-slate-400 font-normal ml-2">
                            {new Date(ans.Answered_On).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </p>

                        {isAnswerOwner && !isEditingThis && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditAnswer(ans)}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                              title="Edit Answer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeletingAnswerId(ans.A_ID)}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                              title="Delete Answer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditingThis ? (
                        <div className="flex flex-col gap-2 mt-1">
                          <textarea
                            value={editingAnswerText}
                            onChange={(e) =>
                              setEditingAnswerText(e.target.value)
                            }
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1A3C20]/20 outline-none text-sm resize-none bg-slate-50"
                            rows="3"
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleCancelEditAnswer}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                              <X className="w-3 h-3" /> Cancel
                            </button>
                            <button
                              onClick={() => handleSaveAnswer(ans.A_ID)}
                              disabled={
                                answerActionLoading || !editingAnswerText.trim()
                              }
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1A3C20] hover:bg-[#153416] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              {answerActionLoading ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">{ans.Answer}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400 italic text-center">
                  No answers yet. Be the first!
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Add your answer..."
                className="flex-1 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#1A3C20]/20 outline-none text-sm resize-none bg-white"
                rows="2"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim()}
                className="bg-[#1A3C20] text-white p-4 rounded-2xl self-end hover:bg-[#153416] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QnACard;
