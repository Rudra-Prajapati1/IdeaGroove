import { CheckCircle, Ban, User } from "lucide-react";

const AdminNoteCard = ({ note, onModerate }) => {
  const isBlocked = note.status === "blocked";

  const getPlaceholderImage = (subject) => {
    const s = subject?.toLowerCase();
    if (s?.includes("os") || s?.includes("web"))
      return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80";
    if (s?.includes("dbms") || s?.includes("ai"))
      return "https://images.unsplash.com/photo-1504868584819-f8e90526354a?w=400&q=80";
    return "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80";
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group border-l-4 ${isBlocked ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
      {/* IMAGE SECTION */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={getPlaceholderImage(note.subject)}
          alt={note.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
              isBlocked ? "bg-red-500" : "bg-emerald-500"
            }`}
          >
            {isBlocked ? "Flagged" : "Verified"}
          </span>
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tight">
            {note.subject}
          </span>
        </div>

        <h3 className="text-md font-bold text-gray-800 leading-tight mb-1 line-clamp-1 font-poppins group-hover:text-[#1B431C]">
          {note.title}
        </h3>

        <div className="flex items-center gap-2 mt-3 font-inter">
          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 uppercase font-black text-[10px] text-gray-400">
            {note.uploadedBy.charAt(0)}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Uploaded by <span className="text-gray-700 font-bold">{note.uploadedBy}</span>
          </p>
        </div>
      </div>

      {/* ACTION FOOTER */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-3">
        <button
          onClick={() => onModerate("block", note.id)}
          disabled={isBlocked}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            isBlocked
              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50 grayscale"
              : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
          }`}
        >
          <Ban size={14} />
          Block
        </button>

        <button
          onClick={() => onModerate("unblock", note.id)}
          disabled={!isBlocked}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            !isBlocked
              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50 grayscale"
              : "bg-[#1B431C] text-white hover:bg-[#153416] border-[#1B431C] shadow-lg shadow-green-100"
          }`}
        >
          <CheckCircle size={14} />
          Unblock
        </button>
      </div>
    </div>
  );
};

export default AdminNoteCard;