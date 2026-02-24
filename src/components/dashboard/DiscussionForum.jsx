import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, Filter, GraduationCap, Plus } from "lucide-react";
import Controls from "../common/Controls";
import AskQuestionModal from "../qna/AskQuestion";
import QnACard from "../cards/QnACard";
import { selectIsAuthenticated, selectUser } from "../../redux/slice/authSlice";
import ActionButton from "../common/ActionButton";
import { useSelector } from "react-redux";
import {
  selectAllDegrees,
  selectSubjectsByDegree,
} from "../../redux/slice/degreeSubjectSlice";

const DiscussionForum = ({ discussions }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.S_ID || currentUser?.id || null;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const degrees = useSelector(selectAllDegrees);
  const subjects = useSelector(
    selectSubjectsByDegree(Number(selectedDegree) || 0),
  );

  // Filter & sort real data
  const filteredDiscussions = useMemo(() => {
    return discussions
      .filter((post) => {
        if (selectedDegree && post.Degree_ID !== Number(selectedDegree))
          return false;
        if (selectedSubject && post.Subject_ID !== Number(selectedSubject))
          return false;

        // Search across question or answer text
        const matchesSearch =
          (post.Question?.toLowerCase().includes(search.toLowerCase()) ??
            false) ||
          (post.Answer?.toLowerCase().includes(search.toLowerCase()) ?? false);

        return matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.Added_On || a.Answered_On || 0);
        const dateB = new Date(b.Added_On || b.Answered_On || 0);

        if (filter === "newest_to_oldest") return dateB - dateA;
        if (filter === "oldest_to_newest") return dateA - dateB;
        return 0;
      });
  }, [discussions, search, filter, selectedDegree, selectedSubject]);

  const handleQuestionSubmit = (data) => {
    console.log("New/Edited Question:", data);
    // TODO: dispatch create/update thunk here when you implement it
    setShowAskModal(false);
    setEditing(null);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Delete this discussion?")) {
      console.log("Delete QnA ID:", postId);
      // TODO: dispatch delete thunk here (question or answer)
    }
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
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
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
                  onChange={(e) => {
                    setSelectedDegree(e.target.value);
                    setSelectedSubject("");
                  }}
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
                    onChange={(e) => setSelectedSubject(e.target.value)}
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
                    setSelectedDegree("");
                    setSelectedSubject("");
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
        <div className="lg:col-span-9 space-y-6">
          {filteredDiscussions.length === 0 ? (
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
            filteredDiscussions.map((post) => (
              <QnACard
                key={post.Q_ID || post.A_ID}
                post={post}
                isAuth={isAuth}
                currentUserId={currentUserId}
                onEdit={() => setEditing(post)}
                onDelete={() => handleDeletePost(post.Q_ID || post.A_ID)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscussionForum;
