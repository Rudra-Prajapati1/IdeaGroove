import React from "react";
import { MessageSquare, Ban, CheckCircle, Eye } from "lucide-react";

const AdminQnACard = ({ qna, onModerate }) => {
  const isBlocked = qna.status === "blocked";

  return (
    <div className={`bg-white border border-gray-100 border-l-4 ${isBlocked ? 'border-l-red-500' : 'border-l-emerald-500'} rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-lg`}>
      
      <div className="flex flex-col gap-2 flex-1 pr-6">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${isBlocked ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            {qna.status}
          </span>
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
            <Eye size={12} /> 1.2k Views • {qna.time}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-800 font-poppins">{qna.title}</h3>

        <div className="flex items-center gap-4 mt-1">
          <p className="text-xs text-gray-500 font-medium">Asked by <span className="text-gray-900 font-bold">{qna.author}</span></p>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">{qna.subject}</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <MessageSquare size={14} /> {qna.answersCount} Replies
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 min-w-[130px]">
        <button
          onClick={() => onModerate("block", qna.id)}
          disabled={isBlocked}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border
            ${isBlocked ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed grayscale" : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"}`}
        >
          <Ban size={14} /> Block
        </button>

        <button
          onClick={() => onModerate("unblock", qna.id)}
          disabled={!isBlocked}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border
            ${!isBlocked ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed grayscale" : "bg-[#1B431C] text-white hover:bg-[#153416]"}`}
        >
          <CheckCircle size={14} /> Unblock
        </button>
      </div>
    </div>
  );
};

export default AdminQnACard;