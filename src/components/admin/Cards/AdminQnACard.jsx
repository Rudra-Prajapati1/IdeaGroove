import { MessageSquare, Ban, CheckCircle, Eye } from "lucide-react";

const AdminQnACard = ({ qna, onToggleBlock }) => {
  const isBlocked = qna.status === "blocked";

  // Dynamic styles based on status
  const statusStyles = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blocked: "bg-red-50 text-red-600 border-red-100",
  };

  const borderAccent = isBlocked ? "border-l-red-500" : "border-l-emerald-500";

  return (
    <div
      className={`group relative bg-white border border-gray-100 border-l-4 ${borderAccent} rounded-xl p-5 flex items-center justify-between transition-all hover:shadow-lg hover:border-gray-200`}
    >
      {/* LEFT: Content & Info */}
      <div className="flex flex-col gap-2 flex-1 pr-6">
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${statusStyles[qna.status]}`}
          >
            {qna.status}
          </span>
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
            <Eye size={12} /> 1.2k Views • {qna.time}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors cursor-pointer">
          {qna.title}
        </h3>

        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
              {qna.author.charAt(0)}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Asked by{" "}
              <span className="text-gray-900 font-bold">{qna.author}</span>
            </p>
          </div>

          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
            {qna.subject}
          </span>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <MessageSquare size={14} className="text-slate-300" />
            {qna.answersCount} Replies
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => onToggleBlock(qna.id)}
          disabled={isBlocked}
          className={`flex items-center justify-center gap-1.5 px-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            isBlocked
              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
              : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
          }`}
        >
          <Ban size={14} />
          Block
        </button>

        <button
          onClick={() => onToggleBlock(qna.id)}
          disabled={!isBlocked}
          className={`flex items-center justify-center gap-1.5 px-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            !isBlocked
              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
              : "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500 shadow-sm shadow-emerald-200"
          }`}
        >
          <CheckCircle size={14} />
          Unblock
        </button>
      </div>
    </div>
  );
};

export default AdminQnACard;
