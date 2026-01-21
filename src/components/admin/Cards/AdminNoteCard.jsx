import { CheckCircle, Ban, User, MoreVertical } from "lucide-react";

const AdminNoteCard = ({ note, onToggleBlock }) => {
  const isBlocked = note.status === "blocked";

  // Helper to simulate the image categories seen in your reference
  const getPlaceholderImage = (subject) => {
    const s = subject?.toLowerCase();
    if (s?.includes("os") || s?.includes("web"))
      return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80";
    if (s?.includes("dbms") || s?.includes("ai"))
      return "https://images.unsplash.com/photo-1504868584819-f8e90526354a?w=400&q=80";
    return "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* IMAGE SECTION */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={getPlaceholderImage(note.subject)}
          alt={note.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Floating Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
              isBlocked ? "bg-orange-500" : "bg-emerald-500"
            }`}
          >
            {isBlocked ? "Flagged" : "Verified"}
          </span>
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {note.subject}
          </span>
        </div>

        <h3 className="text-md font-bold text-gray-800 leading-tight mb-1 line-clamp-1">
          {note.title}
        </h3>

        <div className="flex items-center gap-2 mt-3">
          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <User size={12} className="text-gray-500" />
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Uploaded by <span className="text-gray-700">{note.uploadedBy}</span>
          </p>
        </div>
      </div>

      {/* ACTION FOOTER */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-3">
        <button
          onClick={() => onToggleBlock(note.id)}
          disabled={isBlocked}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            isBlocked
              ? "bg-red-50 text-red-300 cursor-not-allowed"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          <Ban size={14} />
          Block
        </button>

        <button
          onClick={() => onToggleBlock(note.id)}
          disabled={!isBlocked}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            !isBlocked
              ? "bg-emerald-50 text-emerald-300 cursor-not-allowed"
              : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200"
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
