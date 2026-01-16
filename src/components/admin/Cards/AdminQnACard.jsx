import { MessageSquare, Ban, CheckCircle } from "lucide-react";

const AdminQnACard = ({ qna, onToggleBlock }) => {
  const isBlocked = qna.status === "blocked";

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {qna.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{qna.author}</span>
            <span>• {qna.time}</span>

            <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 font-semibold rounded border border-blue-100 uppercase tracking-wide">
              {qna.subject}
            </span>
          </div>
        </div>

        {/* STATUS */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isBlocked
              ? "bg-red-100 text-red-700"
              : qna.status === "reported"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {qna.status}
        </span>
      </div>

      {/* META */}
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" />
          {qna.answersCount} Answers
        </div>
      </div>

      {/* ACTION */}
      <button
        onClick={() => onToggleBlock(qna.id)}
        className={`mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
          isBlocked
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isBlocked ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Unblock Question
          </>
        ) : (
          <>
            <Ban className="w-4 h-4" />
            Block Question
          </>
        )}
      </button>
    </div>
  );
};

export default AdminQnACard;
