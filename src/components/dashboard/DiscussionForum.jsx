import React, { useState } from "react";
import { BookOpen, Filter, GraduationCap, Plus } from "lucide-react";
import Controls from "../common/Controls";
import AskQuestionModal from "../qna/AskQuestion";
import QnACard from "../cards/QnACard";
import { selectIsAuthenticated, selectUser } from "../../redux/slice/authSlice";
import ActionButton from "../common/ActionButton";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllDegrees,
  selectSubjectsByDegree,
} from "../../redux/slice/degreeSubjectSlice";
import { updateQuestion } from "../../redux/slice/qnaSlice";
import toast from "react-hot-toast";

const DiscussionForum = ({
  discussions,
  search,
  filter,
  selectedDegree,
  selectedSubject,
  onSearchChange,
  onFilterChange,
  onDegreeChange,
  onSubjectChange,
  onRefetch,
  isRefetching, // ✅ subtle loading signal — no unmounting
}) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.S_ID || currentUser?.id || null;

  const [showAskModal, setShowAskModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const degrees = useSelector(selectAllDegrees);
  const subjects = useSelector(
    selectSubjectsByDegree(Number(selectedDegree) || 0),
  );

  const handleQuestionSubmit = async (data) => {
    if (editing) {
      try {
        await dispatch(
          updateQuestion({
            Q_ID: editing.Q_ID,
            Question: data.Question,
            Degree_ID: parseInt(data.Degree_ID),
            Subject_ID: parseInt(data.Subject_ID),
          }),
        ).unwrap();

        onRefetch();
        toast.success("Question updated successfully!");
      } catch (err) {
        toast.error(err || "Failed to update question");
      }
    }

    setShowAskModal(false);
    setEditing(null);
  };

  const handleDeletePost = (postId) => {
    console.log("Deleted QnA ID:", postId);
  };

  const handleEditClick = (post) => {
    setEditing(post);
    setShowAskModal(true);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {showAskModal && (
        <AskQuestionModal
          onClose={() => {
            setShowAskModal(false);
            setEditing(null);
          }}
          editing={editing}
          onSubmit={handleQuestionSubmit}
        />
      )}

      {/* Header Controls */}
      <div className="relative z-40">
        <div className="max-w-6xl mx-auto px-4 -mt-8 flex justify-between items-center mb-8">
          <Controls
            search={search}
            setSearch={onSearchChange}
            filter={filter}
            setFilter={onFilterChange}
            searchPlaceholder="Search questions or answers..."
            filterOptions={{
              All: "all",
              "Newest to Oldest": "newest_to_oldest",
              "Oldest to Newest": "oldest_to_newest",
            }}
          />
          <ActionButton
            label="Ask Question"
            icon={Plus}
            disabled={!isAuth}
            disabledMessage="Please login to ask a question"
            onClick={() => setShowAskModal(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SIDEBAR (FILTERS) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-4">
              <Filter className="w-4 h-4 text-green-600" />
              <h3>Filter by Category</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Degree
                </label>
                <select
                  value={selectedDegree}
                  onChange={(e) => onDegreeChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                >
                  <option value="">All Degrees</option>
                  {degrees.map((deg) => (
                    <option key={deg.Degree_ID} value={deg.Degree_ID}>
                      {deg.degree_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDegree && subjects.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => onSubjectChange(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((sub) => (
                      <option key={sub.Subject_ID} value={sub.Subject_ID}>
                        {sub.subject_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(selectedDegree || selectedSubject) && (
                <button
                  onClick={() => {
                    onDegreeChange("");
                    onSubjectChange("");
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium underline w-full text-center"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT (FEED) */}
        {/* ✅ Subtle opacity transition while refetching — no unmount, no focus loss */}
        <div
          className={`lg:col-span-9 space-y-6 transition-opacity duration-200 ${
            isRefetching ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          {discussions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="text-lg font-medium">
                {search || selectedDegree || selectedSubject
                  ? "No discussions match your filters"
                  : "No questions yet"}
              </p>
              {isAuth && (
                <p className="mt-2 text-sm">Be the first to ask a question!</p>
              )}
            </div>
          ) : (
            discussions.map((post) => (
              <QnACard
                key={post.Q_ID || post.A_ID}
                post={post}
                isAuth={isAuth}
                currentUserId={currentUserId}
                onEdit={() => handleEditClick(post)}
                onDelete={handleDeletePost}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscussionForum;
