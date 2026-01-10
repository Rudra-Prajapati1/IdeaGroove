import React, { useState } from "react";
import {
  Filter,
  Plus,
  MessageSquare,
  Eye,
  ChevronUp,
  ChevronDown,
  Send,
  BookOpen,
  GraduationCap,
} from "lucide-react";

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
    title: "Clarification on Project Submission Guidelines for CS202",
    excerpt:
      "Please ensure that all repositories are public before submitting the link...",
    views: 230,
    votes: 42,
    degree: "Computer Science",
    subject: "Web Development",
    pinned: true,
    avatarColor: "bg-green-100",
    answers: [
      {
        id: 101,
        author: "Sarah J.",
        time: "1h ago",
        text: "Does this apply to the group project as well?",
        votes: 5,
      },
      {
        id: 102,
        author: "Prof. H. Smith",
        time: "50m ago",
        text: "Yes, it applies to all submissions.",
        votes: 12,
      },
    ],
  },
  {
    id: 2,
    author: "Jessica S.",
    time: "45m ago",
    title: "Help needed with Linear Algebra Eigenvalues",
    excerpt:
      "I'm struggling to understand the geometric interpretation of eigenvalues in 3D space...",
    views: 45,
    votes: 18,
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
    excerpt:
      "Can someone explain entropy in a closed system versus an open system?",
    views: 102,
    votes: 8,
    degree: "Engineering",
    subject: "Thermodynamics",
    pinned: false,
    avatarColor: "bg-orange-100",
    answers: [
      {
        id: 103,
        author: "David K.",
        time: "2h ago",
        text: "Think of it as disorder increasing over time...",
        votes: 3,
      },
    ],
  },
];

const DiscussionForum = () => {
  // Filter States
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // UI States
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");

  // Toggle "View Answers"
  const toggleAnswers = (postId) => {
    setExpandedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  // Filter Logic
  const filteredDiscussions = MOCK_DISCUSSIONS.filter((post) => {
    if (selectedDegree && post.degree !== selectedDegree) return false;
    if (selectedSubject && post.subject !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Discussion Forum
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Select your degree and subject to find relevant questions
          </p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
          <Plus className="w-4 h-4" />
          Ask Question
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT SIDEBAR (FILTERS) --- */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-4">
              <Filter className="w-4 h-4 text-green-600" />
              <h3>Filter Questions</h3>
            </div>

            <div className="space-y-6">
              {/* Degree Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Select Degree
                </label>
                <select
                  value={selectedDegree}
                  onChange={(e) => {
                    setSelectedDegree(e.target.value);
                    setSelectedSubject(""); // Reset subject when degree changes
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="">All Degrees</option>
                  {Object.keys(DEGREE_SUBJECTS).map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Dropdown (Conditional) */}
              {selectedDegree && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Select Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
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

              {/* Clear Filters Button */}
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

        {/* --- RIGHT CONTENT (FEED) --- */}
        <div className="lg:col-span-9 space-y-4">
          {filteredDiscussions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No questions found for this selection.
            </div>
          ) : (
            filteredDiscussions.map((post) => {
              const isExpanded = expandedPosts.includes(post.id);

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6 flex gap-6">
                    {/* Vote Column */}
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <button className="text-slate-400 hover:text-green-600 hover:bg-green-50 p-1 rounded transition-colors">
                        <ChevronUp className="w-6 h-6" />
                      </button>
                      <span className="font-bold text-slate-700">
                        {post.votes}
                      </span>
                      <button className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors">
                        <ChevronDown className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1">
                      {/* Metadata Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div
                          className={`w-6 h-6 rounded-full ${post.avatarColor} flex items-center justify-center text-xs font-bold text-slate-600`}
                        >
                          {post.author.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-500">
                          <span className="font-medium text-slate-700">
                            {post.author}
                          </span>{" "}
                          • {post.time}
                        </span>

                        {/* Degree & Subject Badges */}
                        <div className="ml-auto flex gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wide rounded border border-slate-200">
                            {post.degree}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold uppercase tracking-wide rounded border border-blue-100">
                            {post.subject}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                        {post.title}
                      </h3>

                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                            <Eye className="w-4 h-4" /> {post.views} Views
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                            <MessageSquare className="w-4 h-4" />{" "}
                            {post.answers.length} Answers
                          </div>
                        </div>

                        <button
                          onClick={() => toggleAnswers(post.id)}
                          className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                            isExpanded
                              ? "bg-slate-100 text-slate-700"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {isExpanded ? "Hide Answers" : "View Answers"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* --- ANSWERS SECTION (Collapsible) --- */}
                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-100 p-6 animate-in fade-in slide-in-from-top-1">
                      {/* List of Answers */}
                      <div className="space-y-4 mb-6">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">
                          {post.answers.length} Answers
                        </h4>

                        {post.answers.length > 0 ? (
                          post.answers.map((answer) => (
                            <div
                              key={answer.id}
                              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    {answer.author.charAt(0)}
                                  </div>
                                  <span className="text-xs font-bold text-slate-700">
                                    {answer.author}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    • {answer.time}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600">
                                {answer.text}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400 italic">
                            No answers yet. Be the first!
                          </p>
                        )}
                      </div>

                      {/* User Input Area */}
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-green-700 border border-green-200">
                          You
                        </div>
                        <div className="flex-1">
                          <textarea
                            placeholder="Write your answer here..."
                            rows={2}
                            className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none bg-white"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                          />
                          <div className="flex justify-end mt-2">
                            <button className="flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                              <Send className="w-3 h-3" /> Post Answer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;

// import React, { useState } from "react";
// import { Filter, Plus, BookOpen, GraduationCap } from "lucide-react";
// import QnACard from "../qna/QnACard";

// // ... Keep your DEGREE_SUBJECTS and MOCK_DISCUSSIONS data here ...
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
//   // ... your mock data array ...
//   {
//     id: 1,
//     author: "Prof. H. Smith",
//     time: "2h ago",
//     title: "Clarification on Project Submission Guidelines for CS202",
//     excerpt:
//       "Please ensure that all repositories are public before submitting the link...",
//     views: 230,
//     votes: 42,
//     degree: "Computer Science",
//     subject: "Web Development",
//     pinned: true,
//     avatarColor: "bg-green-100",
//     answers: [
//       {
//         id: 101,
//         author: "Sarah J.",
//         time: "1h ago",
//         text: "Does this apply to group project?",
//         votes: 5,
//       },
//       {
//         id: 102,
//         author: "Prof. H. Smith",
//         time: "50m ago",
//         text: "Yes, applies to all.",
//         votes: 12,
//       },
//     ],
//   },
//   {
//     id: 2,
//     author: "Jessica S.",
//     time: "45m ago",
//     title: "Help needed with Linear Algebra Eigenvalues",
//     excerpt: "I'm struggling to understand the geometric interpretation...",
//     views: 45,
//     votes: 18,
//     degree: "Mathematics",
//     subject: "Linear Algebra",
//     pinned: false,
//     avatarColor: "bg-blue-100",
//     answers: [],
//   },
//   // ... etc
// ];

// const DiscussionForum = () => {
//   // Filter States
//   const [selectedDegree, setSelectedDegree] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");

//   // UI States
//   const [expandedPosts, setExpandedPosts] = useState([]);

//   // Toggle "View Answers"
//   const toggleAnswers = (postId) => {
//     setExpandedPosts((prev) =>
//       prev.includes(postId)
//         ? prev.filter((id) => id !== postId)
//         : [...prev, postId]
//     );
//   };

//   // Filter Logic
//   const filteredDiscussions = MOCK_DISCUSSIONS.filter((post) => {
//     if (selectedDegree && post.degree !== selectedDegree) return false;
//     if (selectedSubject && post.subject !== selectedSubject) return false;
//     return true;
//   });

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins bg-slate-50 min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800">
//             Discussion Forum
//           </h2>
//           <p className="text-slate-500 text-sm mt-1">
//             Select your degree and subject to find relevant questions
//           </p>
//         </div>
//         <button className="flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
//           <Plus className="w-4 h-4" />
//           Ask Question
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* --- LEFT SIDEBAR (FILTERS) --- */}
//         <div className="lg:col-span-3 space-y-6">
//           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8">
//             <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-4">
//               <Filter className="w-4 h-4 text-green-600" />
//               <h3>Filter Questions</h3>
//             </div>

//             <div className="space-y-6">
//               {/* Degree Dropdown */}
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

//               {/* Subject Dropdown */}
//               {selectedDegree && (
//                 <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
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

//               {/* Clear Filters */}
//               {(selectedDegree || selectedSubject) && (
//                 <button
//                   onClick={() => {
//                     setSelectedDegree("");
//                     setSelectedSubject("");
//                   }}
//                   className="text-xs text-red-500 hover:text-red-600 font-medium underline w-full text-center"
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* --- RIGHT CONTENT (FEED) --- */}
//         <div className="lg:col-span-9 space-y-4">
//           {filteredDiscussions.length === 0 ? (
//             <div className="text-center py-12 text-slate-500">
//               No questions found for this selection.
//             </div>
//           ) : (
//             filteredDiscussions.map((post) => (
//               <QnACard
//                 key={post.id}
//                 data={post}
//                 isExpanded={expandedPosts.includes(post.id)}
//                 onToggleAnswer={toggleAnswers}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiscussionForum;
