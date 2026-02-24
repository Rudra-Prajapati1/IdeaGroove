import React, { useState } from "react";
import { MessageSquare, Send, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ComplaintButton from "../ComplaintButton";
import toast from "react-hot-toast";

const QnACard = ({ post, isAuth, currentUser, onEdit, onDelete }) => {
  const navigate = useNavigate();
  // Local state for expanding answers
  const [isExpanded, setIsExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");

  // Safe check for undefined post
  if (!post) return null;

  const isOwner = post.id === currentUser;

  const askedDate = post.askedOn
    ? new Date(post.askedOn).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleSubmitAnswer = () => {
    console.log(`Answer to Post ${post.id}:`, answerText);
    setAnswerText("");
  };

  // 2. Safe Access Helpers
  const authorName = post.author || "Unknown";
  const authorInitial = authorName.charAt(0);
  const answers = post.answers || []; // Fallback to empty array

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* --- POST HEADER & CONTENT --- */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full ${post.avatarColor || "bg-gray-100"} flex items-center justify-center text-xs font-bold`}
            >
              {authorInitial}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {post.Question_Author}
            </span>
            <span className="text-xs text-slate-400">
              • Asked on {askedDate || "Just now"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {post.subject && (
              <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-md border border-green-100">
                {post.subject}
              </span>
            )}

            {isOwner ? (
              <div className="flex items-center gap-1 ml-2">
                <button
                  // onClick={() => onEdit(post.id)}
                  onClick={onEdit}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                  title="Edit Discussion"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    toast.success("Question Deleted Successfully!");
                  }}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-blue-100"
                  title="Delete Discussion"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <ComplaintButton
                onClick={() => navigate(`/submitComplaint/qna/${post.id}`)}
                element="question"
              />
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">{post.title}</h3>
        {/* <p className="text-slate-600 text-sm mb-4">{post.excerpt}</p> */}

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <MessageSquare className="w-4 h-4" /> {answers.length} Answers
            </div>
          </div>
          <button
            // disabled={!isAuth}
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
          {/* List of Answers */}
          <div className="space-y-4 mb-8">
            {answers.length > 0 ? (
              answers.map((ans) => (
                <div
                  key={ans.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200"
                >
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    {ans.author}{" "}
                    <span className="text-slate-400 font-normal ml-2">
                      {ans.time}
                    </span>
                  </p>
                  <p className="text-sm text-slate-600">{ans.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic text-center">
                No answers yet. Be the first!
              </p>
            )}
          </div>

          {/* Add Answer Input */}
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
              className="bg-[#1A3C20] text-white p-4 rounded-2xl self-end hover:bg-[#153416] transition-colors shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QnACard;
