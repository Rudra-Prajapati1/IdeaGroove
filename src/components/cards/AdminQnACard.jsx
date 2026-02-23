import React, { useState } from "react";
import {
  MessageSquare,
  Ban,
  CheckCircle,
  Clock,
  Hash,
  User,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import StudentProfile from "../admin/StudentProfile";

const AdminQnACard = ({ qna, onModerate, onModerateAnswer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = qna.status === "active";
  const answers = qna.answers || [];
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div
      className={`bg-white border-2 border-gray-100 ${isActive ? "hover:border-green-300 hover:shadow-green-200" : "hover:border-red-300 hover:shadow-red-200"} rounded-2xl flex flex-col transition-all hover:shadow-lg group overflow-hidden mb-4  hover:border-gray-200`}
    >
      <div className="p-5 flex items-center justify-between">
        <div className="flex flex-col gap-2 flex-1 pr-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              <Hash size={10} /> {qna.id}
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${!isActive ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
            >
              {isActive ? "Active" : "Blocked"}
            </span>
            <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
              <Clock size={12} />{" "}
              {new Date(qna.addedOn).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800 font-poppins line-clamp-2">
            {qna.question}
          </h3>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <button
                onClick={() => setIsProfileOpen(true)}
                title="View student profile"
                className="group/author flex items-center gap-1.5 hover:text-[#1B431C] transition-colors"
              >
                <User
                  size={12}
                  className="text-gray-400 group-hover/author:text-[#1B431C] transition-colors"
                />
                <span>
                  Asked by{" "}
                  <span className="font-bold text-gray-900 group-hover/author:text-[#1B431C] underline underline-offset-2 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
                    {qna.authorName}
                  </span>
                </span>
                <ExternalLink
                  size={12}
                  className="text-gray-300 opacity-0 group-hover/author:opacity-100 transition-opacity"
                />
              </button>
            </p>
            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase">
              <GraduationCap size={12} /> {qna.degreeName}
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
              {qna.subjectName}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <MessageSquare size={14} /> {qna.answersCount} Answers{" "}
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[130px]">
          <button
            onClick={() => onModerate("block", group.id)}
            disabled={!isActive}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
                        ${
                          !isActive
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"
                        }`}
          >
            <Ban size={12} /> Block
          </button>
          <button
            onClick={() => onModerate("unblock", group.id)}
            disabled={isActive}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
                        ${
                          isActive
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-[#1B431C] text-white hover:bg-[#153416]"
                        }`}
          >
            <CheckCircle size={12} /> Unblock
          </button>
        </div>
      </div>

      {/* --- EXPANDED ANSWERS SECTION --- */}
      {isExpanded && (
        <div className="bg-gray-50 p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Answers
          </h4>
          <div className="space-y-3">
            {answers.length > 0 ? (
              answers.map((ans) => {
                const isAnsActive = ans.status === "active";
                return (
                  <div
                    key={ans.id}
                    className={`bg-white p-4 rounded-xl border flex items-center justify-between transition-all ${!isAnsActive ? "border-red-100 bg-red-50/30" : "border-gray-200 shadow-sm"}`}
                  >
                    <div className="flex-1 pr-4">
                      {/* Flow: Name -> Time -> Status Badge */}
                      <div className="flex items-center gap-6 mb-1">
                        <p className="text-xs font-bold text-gray-800">
                          {ans.author}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {ans.time}
                        </span>
                        <span
                          className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${!isAnsActive ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
                        >
                          {isAnsActive ? "Active" : "Blocked"}
                        </span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${!isAnsActive ? "text-gray-400 italic line-through" : "text-gray-600"}`}
                      >
                        {ans.text}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          onModerateAnswer("block", qna.id, ans.id)
                        }
                        disabled={!isAnsActive}
                        className={`p-2 rounded-lg transition-all ${!isAnsActive ? "text-gray-200" : "text-red-400 hover:bg-red-50 hover:text-red-600"}`}
                        title="Block Answer"
                      >
                        <Ban size={16} />
                      </button>
                      <button
                        onClick={() =>
                          onModerateAnswer("unblock", qna.id, ans.id)
                        }
                        disabled={isAnsActive}
                        className={`p-2 rounded-lg transition-all ${isAnsActive ? "text-gray-200" : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"}`}
                        title="Unblock Answer"
                      >
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-400 italic text-center py-4">
                No replies found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsProfileOpen(false)
          }
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <StudentProfile
              id={qna.authorId} // Assuming Added_By contains the S_ID of the uploader
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQnACard;
