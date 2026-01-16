import { FileText, Ban, CheckCircle } from "lucide-react";

const AdminNoteCard = ({ note, onToggleBlock }) => {
  const isBlocked = note.status === "blocked";

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600" />
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {note.subject || "General"}
          </span>
        </div>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isBlocked ? "Blocked" : "Active"}
        </span>
      </div>

      {/* CONTENT */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 leading-tight">
          {note.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-3">
          {note.description || "No description provided."}
        </p>
      </div>

      {/* META */}
      <div className="text-xs text-slate-400">
        Uploaded by <span className="font-medium">{note.uploadedBy}</span>
      </div>

      {/* ACTION */}
      <button
        onClick={() => onToggleBlock(note.id)}
        className={`mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
          isBlocked
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isBlocked ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Unblock
          </>
        ) : (
          <>
            <Ban className="w-4 h-4" />
            Block
          </>
        )}
      </button>
    </div>
  );
};

export default AdminNoteCard;
