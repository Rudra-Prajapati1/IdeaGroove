import React, { useState } from "react";
import { Filter, Plus, BookOpen, GraduationCap } from "lucide-react";
import Controls from "../Controls";
import AskQuestionModal from "../qna/AskQuestion";
import QnACard from "../qna/QnACard"; // ✅ Import the new component
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";

// --- Configuration Data ---
const DEGREE_SUBJECTS = {
  "Computer Science": [
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Operating Systems",
  ],
  Mathematics: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math"],
  Engineering: ["Thermodynamics", "Circuit Theory", "Mechanics", "Robotics"],
  Business: ["Marketing", "Finance", "Economics", "Management"],
};

// --- Mock Data ---
const MOCK_DISCUSSIONS = [
  {
    id: 1,
    author: "Prof. H. Smith",
    time: "2h ago",
    title: "Clarification on Project Submission Guidelines",
    excerpt: "Please ensure that all repositories are public...",
    degree: "Computer Science",
    subject: "Web Development",
    pinned: true,
    avatarColor: "bg-green-100",
    answers: [
      {
        id: 101,
        author: "Sarah J.",
        time: "1h ago",
        text: "Does this apply to group projects?",
        votes: 5,
      },
    ],
  },
  {
    id: 2,
    author: "Jessica S.",
    time: "45m ago",
    title: "Help needed with Linear Algebra Eigenvalues",
    excerpt: "I'm struggling to understand the geometric interpretation...",
    degree: "Mathematics",
    subject: "Linear Algebra",
    pinned: false,
    avatarColor: "bg-blue-100",
    answers: [],
  },
  {
    id: 3,
    author: "Michael P.",
    time: "3h ago",
    title: "Thermodynamics: Second Law confusion",
    excerpt: "Can someone explain entropy in a closed system...",
    degree: "Engineering",
    subject: "Thermodynamics",
    pinned: false,
    avatarColor: "bg-orange-100",
    answers: [],
  },
];

const DiscussionForum = () => {
  const isAuth = useSelector(selectIsAuthenticated);
  const MOCK_CURRENT_USER_NAME = "Jessica S.";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);

  // Handlers
  const handleQuestionSubmit = (data) => console.log("New Question:", data);

  const handleEditPost = (postId) => {
    console.log("Edit Post ID:", postId);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Delete this discussion?")) {
      console.log("Delete Post ID:", postId);
    }
  };

  // Filter Logic
  const filteredDiscussions = MOCK_DISCUSSIONS.filter((post) => {
    if (selectedDegree && post.degree !== selectedDegree) return false;
    if (selectedSubject && post.subject !== selectedSubject) return false;

    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {showAskModal && (
        <AskQuestionModal
          onClose={() => setShowAskModal(false)}
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
              Newest: "newest_to_oldest",
              Oldest: "oldest_to_newest",
            }}
          />
          <button
            disabled={!isAuth}
            onClick={() => setShowAskModal(true)}
            className={`${!isAuth && "cursor-not-allowed"} flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm`}
          >
            <Plus className="w-4 h-4" />
            Ask Question
          </button>
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
                currentUser={MOCK_CURRENT_USER_NAME} // Pass Mock User Name
                onEdit={handleEditPost}
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

// import React, { useState } from "react";
// import {
//   Filter,
//   Plus,
//   MessageSquare,
//   Send,
//   BookOpen,
//   GraduationCap,
//   Edit2,
//   Trash2,
// } from "lucide-react";
// import Controls from "../Controls";
// import AskQuestionModal from "../qna/AskQuestion";
// import { useSelector } from "react-redux";
// import { selectIsAuthenticated } from "../../redux/slice/authSlice";

// // --- Configuration Data & Mock Data (Kept from your original) ---
// const DEGREE_SUBJECTS = {
//   "Computer Science": [
//     "Data Structures",
//     "Algorithms",
//     "Web Development",
//     "Operating Systems",
//   ],
//   Mathematics: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math"],
//   Engineering: ["Thermodynamics", "Circuit Theory", "Mechanics", "Robotics"],
//   Business: ["Marketing", "Finance", "Economics", "Management"],
// };
// const MOCK_DISCUSSIONS = [
//   {
//     id: 1,
//     author: "Prof. H. Smith",
//     time: "2h ago",
//     title: "Clarification on Project Submission Guidelines for CS202",
//     excerpt:
//       "Please ensure that all repositories are public before submitting the link...",
//     degree: "Computer Science",
//     subject: "Web Development",
//     pinned: true,
//     avatarColor: "bg-green-100",
//     answers: [
//       {
//         id: 101,
//         author: "Sarah J.",
//         time: "1h ago",
//         text: "Does this apply to group projects?",
//         votes: 5,
//       },
//     ],
//   },
//   {
//     id: 2,
//     author: "Jessica S.",
//     time: "45m ago",
//     title: "Help needed with Linear Algebra Eigenvalues",
//     excerpt:
//       "I'm struggling to understand the geometric interpretation of eigenvalues...",
//     degree: "Mathematics",
//     subject: "Linear Algebra",
//     pinned: false,
//     avatarColor: "bg-blue-100",
//     answers: [],
//   },
//   {
//     id: 3,
//     author: "Michael P.",
//     time: "3h ago",
//     title: "Thermodynamics: Second Law confusion",
//     excerpt:
//       "Can someone explain entropy in a closed system versus an open system?",
//     degree: "Engineering",
//     subject: "Thermodynamics",
//     pinned: false,
//     avatarColor: "bg-orange-100",
//     answers: [
//       {
//         id: 103,
//         author: "David K.",
//         time: "2h ago",
//         text: "Think of it as disorder increasing...",
//         votes: 3,
//       },
//     ],
//   },
// ];

// const DiscussionForum = () => {
//   const isAuth = useSelector(selectIsAuthenticated);
//   const MOCK_CURRENT_USER_NAME = "Jessica S.";

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [selectedDegree, setSelectedDegree] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");

//   const [showAskModal, setShowAskModal] = useState(false);

//   const handleQuestionSubmit = (newQuestionData) => {
//     console.log("New Question Submitted:", newQuestionData);
//   };

//   // UI States
//   const [expandedPosts, setExpandedPosts] = useState([]);
//   const [userAnswer, setUserAnswer] = useState("");

//   // Toggle "View Answers"
//   const toggleAnswers = (postId) => {
//     setExpandedPosts((prev) =>
//       prev.includes(postId)
//         ? prev.filter((id) => id !== postId)
//         : [...prev, postId],
//     );
//   };

//   const handleEditPost = (postId) => {
//     console.log("Edit Post ID:", postId);
//     // Open an edit modal here
//   };

//   const handleDeletePost = (postId) => {
//     if (window.confirm("Are you sure you want to delete this discussion?")) {
//       console.log("Delete Post ID:", postId);
//       // Dispatch delete action here
//     }
//   };

//   // 2. Updated Filter Logic
//   const filteredDiscussions = MOCK_DISCUSSIONS.filter((post) => {
//     // Check Sidebar Filters
//     if (selectedDegree && post.degree !== selectedDegree) return false;
//     if (selectedSubject && post.subject !== selectedSubject) return false;

//     // Check Search Term (Title or Excerpt)
//     const matchesSearch =
//       post.title.toLowerCase().includes(search.toLowerCase()) ||
//       post.excerpt.toLowerCase().includes(search.toLowerCase());

//     return matchesSearch;
//   });

//   return (
//     <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
//       {/* --- RENDER MODAL --- */}
//       {showAskModal && (
//         <AskQuestionModal
//           onClose={() => setShowAskModal(false)}
//           onSubmit={handleQuestionSubmit}
//         />
//       )}

//       {/* 3. Integrated Controls Component */}
//       <div className="relative z-40">
//         <div className="max-w-6xl mx-auto px-4 -mt-8 flex justify-between items-center mb-8">
//           <Controls
//             search={search}
//             setSearch={setSearch}
//             filter={filter}
//             setFilter={setFilter}
//             searchPlaceholder="Search questions or topics..."
//             filterOptions={{
//               All: "all",
//               "Newest to Oldest": "newest_to_oldest",
//               "Oldest to Newest": "oldest_to_newest",
//             }}
//           />

//           <button
//             disabled={!isAuth}
//             onClick={() => setShowAskModal(true)}
//             className={`${!isAuth && "cursor-not-allowed"}  flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm`}
//           >
//             <Plus className="w-4 h-4" />
//             Ask Question
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* --- LEFT SIDEBAR (FILTERS) --- */}
//         <div className="lg:col-span-3 space-y-6">
//           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8">
//             <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-4">
//               <Filter className="w-4 h-4 text-green-600" />
//               <h3>Filter by Category</h3>
//             </div>

//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
//                   <GraduationCap className="w-3 h-3" /> Select Degree
//                 </label>
//                 <select
//                   value={selectedDegree}
//                   onChange={(e) => {
//                     setSelectedDegree(e.target.value);
//                     setSelectedSubject("");
//                   }}
//                   className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
//                 >
//                   <option value="">All Degrees</option>
//                   {Object.keys(DEGREE_SUBJECTS).map((degree) => (
//                     <option key={degree} value={degree}>
//                       {degree}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {selectedDegree && (
//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
//                     <BookOpen className="w-3 h-3" /> Select Subject
//                   </label>
//                   <select
//                     value={selectedSubject}
//                     onChange={(e) => setSelectedSubject(e.target.value)}
//                     className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
//                   >
//                     <option value="">All Subjects</option>
//                     {DEGREE_SUBJECTS[selectedDegree].map((subject) => (
//                       <option key={subject} value={subject}>
//                         {subject}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//               {(selectedDegree || selectedSubject) && (
//                 <button
//                   onClick={() => {
//                     setSelectedDegree("");
//                     setSelectedSubject("");
//                   }}
//                   className="text-xs text-red-500 hover:text-red-600 font-medium underline w-full text-center"
//                 >
//                   Clear Filter
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* --- RIGHT CONTENT (FEED) --- */}
//         <div className="lg:col-span-9 space-y-4">
//           {filteredDiscussions.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
//               <p className="text-lg font-medium">
//                 No discussions match your search.
//               </p>
//               <p className="text-sm">
//                 Try using different keywords or clearing your filters.
//               </p>
//             </div>
//           ) : (
//             filteredDiscussions.map((post) => {
//               const isExpanded = expandedPosts.includes(post.id);

//               // CHECK OWNERSHIP (Compare Mock Name with Post Author)
//               const isOwner = post.author === MOCK_CURRENT_USER_NAME;

//               return (
//                 <div
//                   key={post.id}
//                   className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//                 >
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex items-center gap-2">
//                         <div
//                           className={`w-8 h-8 rounded-full ${post.avatarColor} flex items-center justify-center text-xs font-bold`}
//                         >
//                           {post.author.charAt(0)}
//                         </div>
//                         <span className="text-sm font-semibold text-slate-700">
//                           {post.author}
//                         </span>
//                         <span className="text-xs text-slate-400">
//                           • {post.time}
//                         </span>
//                       </div>

//                       {/* --- TOP RIGHT ACTIONS --- */}
//                       <div className="flex items-center gap-3">
//                         <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-md border border-green-100">
//                           {post.subject}
//                         </span>

//                         {/* EDIT & DELETE BUTTONS (Only if Owner) */}
//                         {isOwner && (
//                           <div className="flex items-center gap-1 ml-2">
//                             <button
//                               onClick={() => handleEditPost(post.id)}
//                               className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                               title="Edit Discussion"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDeletePost(post.id)}
//                               className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                               title="Delete Discussion"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <h3 className="text-lg font-bold text-slate-800 mb-2">
//                       {post.title}
//                     </h3>
//                     <p className="text-slate-600 text-sm mb-4">
//                       {post.excerpt}
//                     </p>

//                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
//                       <div className="flex gap-4">
//                         <div className="flex items-center gap-1 text-slate-500 text-xs">
//                           <MessageSquare className="w-4 h-4" />{" "}
//                           {post.answers.length} Answers
//                         </div>
//                       </div>
//                       <button
//                         disabled={!isAuth}
//                         onClick={() => toggleAnswers(post.id)}
//                         className={`${!isAuth && "cursor-not-allowed"} text-green-600 text-sm font-semibold hover:underline`}
//                       >
//                         {isExpanded ? "Hide Answers" : "View Answers"}
//                       </button>
//                     </div>
//                   </div>

//                   {expandedPosts.includes(post.id) && (
//                     <div className="bg-slate-50 p-8 border-t border-slate-100">
//                       <div className="space-y-4 mb-8">
//                         {post.answers.map((ans) => (
//                           <div
//                             key={ans.id}
//                             className="bg-white p-5 rounded-2xl border border-slate-200"
//                           >
//                             <p className="text-xs font-bold text-slate-800 mb-1">
//                               {ans.author}{" "}
//                               <span className="text-slate-400 font-normal ml-2">
//                                 {ans.time}
//                               </span>
//                             </p>
//                             <p className="text-sm text-slate-600">{ans.text}</p>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="flex gap-4">
//                         <textarea
//                           placeholder="Add your answer..."
//                           className="flex-1 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#1A3C20]/20 outline-none text-sm resize-none"
//                           rows="2"
//                         />
//                         <button className="bg-[#1A3C20] text-white p-4 rounded-2xl self-end">
//                           <Send className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DiscussionForum;
