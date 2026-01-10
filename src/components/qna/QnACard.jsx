import React from "react";
import { useSelector } from "react-redux";
import { selectAnswerCountByQuestionId } from "../../redux/slice/answerSlice";

const QnACard = ({ question }) => {
  const answerCount = useSelector(selectAnswerCountByQuestionId(question.Q_ID));

  return (
    <div className="border-3 px-6 py-6 font-inter rounded-xl shadow-md hover:shadow-md/20 text-primary flex flex-col gap-3 hover:scale-103 duration-300">
      <p className="font-semibold tracking-wider text-lg">
        <span className="font-bold italic">Q.</span> {question.Question}
      </p>
      <div className="flex md:px-10 justify-between items-center md:items-end">
        <span className="font-semibold font-poppins text-sm">
          Total Answers: {answerCount}
        </span>
        <button
          type="submit"
          className="border-3 p-2 rounded-2xl font-bold bg-primary text-white text-xs md:text-sm cursor-pointer hover:bg-white hover:text-primary"
        >
          View All Answers
        </button>
      </div>
    </div>
  );
};

export default QnACard;
// import React, { useState } from "react";
// import {
//   MessageSquare,
//   Eye,
//   ChevronUp,
//   ChevronDown,
//   Send,
//   AlertCircle,
// } from "lucide-react";

// const QnACard = ({ data, isExpanded = false, onToggleAnswer }) => {
//   const [userAnswer, setUserAnswer] = useState("");

//   // --- 1. SAFETY CHECK: Guard Clause ---
//   // If the parent doesn't pass 'data', return null or a placeholder to prevent crash
//   if (!data) {
//     return null;
//     // Or return <div className="p-4 text-red-500">Error: Missing data prop</div>;
//   }

//   // --- Logic to handle different data structures ---
//   const title = data.title || data.Question || "Untitled Question";
//   const author = data.author || "Anonymous";
//   const time = data.time || "Recently";
//   const votes = data.votes || 0;
//   const views = data.views || 0;
//   const degree = data.degree || "General";
//   const subject = data.subject || "N/A";
//   const excerpt = data.excerpt || data.Description || "";
//   const avatarColor = data.avatarColor || "bg-slate-200";
//   const answers = data.answers || [];

//   const displayAnswerCount = answers.length;

//   // Handler for the "View Answers" button
//   const handleToggle = () => {
//     if (onToggleAnswer) {
//       onToggleAnswer(data.id || data.Q_ID);
//     } else {
//       console.warn("onToggleAnswer prop is missing in QnACard");
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
//       <div className="p-6 flex gap-6">
//         {/* --- Vote Column --- */}
//         <div className="flex flex-col items-center gap-1 min-w-[40px]">
//           <button className="text-slate-400 hover:text-green-600 hover:bg-green-50 p-1 rounded transition-colors">
//             <ChevronUp className="w-6 h-6" />
//           </button>
//           <span className="font-bold text-slate-700">{votes}</span>
//           <button className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors">
//             <ChevronDown className="w-6 h-6" />
//           </button>
//         </div>

//         {/* --- Content Column --- */}
//         <div className="flex-1">
//           {/* Metadata Header */}
//           <div className="flex flex-wrap items-center gap-2 mb-3">
//             <div
//               className={`w-6 h-6 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold text-slate-600`}
//             >
//               {author && typeof author === "string" ? author.charAt(0) : "?"}
//             </div>
//             <span className="text-xs text-slate-500">
//               <span className="font-medium text-slate-700">{author}</span> •{" "}
//               {time}
//             </span>

//             {/* Badges */}
//             <div className="ml-auto flex gap-2">
//               <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wide rounded border border-slate-200">
//                 {degree}
//               </span>
//               <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold uppercase tracking-wide rounded border border-blue-100">
//                 {subject}
//               </span>
//             </div>
//           </div>

//           {/* Title */}
//           <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
//             {title}
//           </h3>

//           {/* Excerpt/Body */}
//           <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-2">
//             {excerpt}
//           </p>

//           {/* Footer Stats & Actions */}
//           <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
//                 <Eye className="w-4 h-4" /> {views} Views
//               </div>
//               <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
//                 <MessageSquare className="w-4 h-4" /> {displayAnswerCount}{" "}
//                 Answers
//               </div>
//             </div>

//             <button
//               onClick={handleToggle}
//               className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
//                 isExpanded
//                   ? "bg-slate-100 text-slate-700"
//                   : "text-green-600 hover:bg-green-50"
//               }`}
//             >
//               {isExpanded ? "Hide Answers" : "View Answers"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- ANSWERS EXPANDABLE SECTION --- */}
//       {isExpanded && (
//         <div className="bg-slate-50 border-t border-slate-100 p-6 animate-in fade-in slide-in-from-top-1">
//           {/* List of Answers */}
//           <div className="space-y-4 mb-6">
//             <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">
//               {displayAnswerCount} Answers
//             </h4>

//             {answers.length > 0 ? (
//               answers.map((answer, index) => (
//                 <div
//                   key={answer.id || index}
//                   className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <div className="flex items-center gap-2">
//                       <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
//                         {answer.author ? answer.author.charAt(0) : "A"}
//                       </div>
//                       <span className="text-xs font-bold text-slate-700">
//                         {answer.author}
//                       </span>
//                       <span className="text-[10px] text-slate-400">
//                         • {answer.time}
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-sm text-slate-600">{answer.text}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-slate-400 italic">
//                 No answers yet. Be the first to answer!
//               </p>
//             )}
//           </div>

//           {/* User Input Area */}
//           <div className="flex gap-3 items-start">
//             <div className="w-8 h-8 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-green-700 border border-green-200">
//               You
//             </div>
//             <div className="flex-1">
//               <textarea
//                 placeholder="Write your answer here..."
//                 rows={2}
//                 className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none bg-white"
//                 value={userAnswer}
//                 onChange={(e) => setUserAnswer(e.target.value)}
//               />
//               <div className="flex justify-end mt-2">
//                 <button className="flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
//                   <Send className="w-3 h-3" /> Post Answer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QnACard;
