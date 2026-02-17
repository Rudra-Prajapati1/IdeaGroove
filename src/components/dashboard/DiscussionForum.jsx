import React, { useState } from "react";
import { Filter, Plus, BookOpen, GraduationCap } from "lucide-react";
import Controls from "../common/Controls";
import AskQuestionModal from "../qna/AskQuestion";
import QnACard from "../cards/QnACard"; // ✅ Import the new component
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import ActionButton from "../common/ActionButton";

const DiscussionForum = ({ MOCK_DISCUSSIONS, DEGREE_SUBJECTS }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  let MOCK_CURRENT_USER_ID = 0;
  if (isAuth) {
    MOCK_CURRENT_USER_ID = 2;
  }

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // Handlers
  const handleQuestionSubmit = (data) => console.log("New Question:", data);

  // const handleEditPost = (postId) => {
  //   console.log("Edit Post ID:", postId);
  // };

  const handleDeletePost = (postId) => {
    if (window.confirm("Delete this discussion?")) {
      console.log("Delete Post ID:", postId);
    }
  };

  const filteredDiscussions = MOCK_DISCUSSIONS.filter((post) => {
    if (selectedDegree && post.degree !== selectedDegree) return false;
    if (selectedSubject && post.subject !== selectedSubject) return false;

    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  }).sort((a, b) => {
    const dateA = new Date(a.askedOn);
    const dateB = new Date(b.askedOn);

    if (filter === "newest_to_oldest") {
      return dateB - dateA;
    }

    if (filter === "oldest_to_newest") {
      return dateA - dateB;
    }

    return 0; // "all"
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {(showAskModal || editing) && (
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
            searchPlaceholder="Search questions..."
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
        {/* --- LEFT SIDEBAR (FILTERS) --- */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-4">
              <Filter className="w-4 h-4 text-green-600" />
              <h3>Filter by Category</h3>
            </div>

            {/* Filter Dropdowns (Same as before) */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Select Degree
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
                  {Object.keys(DEGREE_SUBJECTS).map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDegree && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Select Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                  >
                    <option value="">All Subjects</option>
                    {DEGREE_SUBJECTS[selectedDegree].map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
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
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT CONTENT (FEED) --- */}
        <div className="lg:col-span-9 space-y-4">
          {filteredDiscussions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="text-lg font-medium">
                No discussions match your search.
              </p>
            </div>
          ) : (
            filteredDiscussions.map((post) => (
              <QnACard
                key={post.id}
                post={post}
                isAuth={isAuth}
                currentUser={MOCK_CURRENT_USER_ID} // Pass Mock User Name
                onEdit={() => setEditing(post)}
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
