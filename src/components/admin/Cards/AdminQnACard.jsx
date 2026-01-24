import React from "react";
import {
  MessageSquare,
  Ban,
  CheckCircle,
  Clock,
  Hash,
  User,
} from "lucide-react";

const AdminQnACard = ({ qna, onModerate }) => {
  // Mapping DD status: Is_Active (BOOLEAN)
  const isActive = qna.status === "active";

  return (
    <div
      className={`bg-white border border-gray-100 border-l-4 ${!isActive ? "border-l-red-500" : "border-l-emerald-500"} rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-lg group`}
    >
      <div className="flex flex-col gap-2 flex-1 pr-6">
        <div className="flex items-center gap-3">
          {/* Mapping Q_ID from DD */}
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
            <Hash size={10} /> {qna.id}
          </span>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${!isActive ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
          >
            {isActive ? "Active" : "Blocked"}
          </span>
          {/* Mapping Added_On from DD */}
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
            <Clock size={12} /> {new Date(qna.addedOn).toLocaleDateString()}
          </span>
        </div>

        {/* Mapping Question text from DD */}
        <h3 className="text-base font-bold text-gray-800 font-poppins line-clamp-2">
          {qna.question}
        </h3>

        <div className="flex items-center gap-4 mt-1">
          {/* Mapping Added_By (Student_ID/Name) from DD */}
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <User size={12} className="text-gray-400" />
            Asked by{" "}
            <span className="text-gray-900 font-bold">{qna.authorName}</span>
          </p>
          {/* Mapping Subject_ID from DD */}
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
            {qna.subjectName}
          </span>
          {/* Logic to represent related answers from answer_tbl */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <MessageSquare size={14} /> {qna.answersCount} Replies
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 min-w-[130px]">
        <button
          onClick={() => onModerate("block", qna.id)}
          disabled={!isActive}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border
            ${!isActive ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50 grayscale" : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"}`}
        >
          <Ban size={14} /> Block
        </button>

        <button
          onClick={() => onModerate("unblock", qna.id)}
          disabled={isActive}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border
            ${isActive ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50 grayscale" : "bg-[#1B431C] text-white hover:bg-[#153416]"}`}
        >
          <CheckCircle size={14} /> Unblock
        </button>
      </div>
    </div>
  );
};

export default AdminQnACard;
