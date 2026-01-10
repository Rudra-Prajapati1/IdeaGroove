import React from "react";
import {
  Download,
  Upload,
  FileText,
  Code2,
  FlaskConical,
  TrendingUp,
  Palette,
  Sigma,
  BrainCircuit,
  Loader2,
  AlertCircle,
} from "lucide-react";

// 1. Style Mapping for vibrant cards
const STYLE_VARIANTS = [
  { color: "bg-blue-600", textColor: "text-blue-600", icon: Code2 },
  {
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    icon: FlaskConical,
  },
  { color: "bg-orange-500", textColor: "text-orange-500", icon: TrendingUp },
  { color: "bg-pink-500", textColor: "text-pink-500", icon: Palette },
  { color: "bg-slate-600", textColor: "text-slate-600", icon: Sigma },
  { color: "bg-sky-500", textColor: "text-sky-500", icon: BrainCircuit },
];

const NotesSection = ({ notes = [], status = "succeeded", error = null }) => {
  // Loading State
  if (status === "loading") {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-green-600" />
        <p>Loading your notes...</p>
      </div>
    );
  }

  // Error State
  if (status === "failed") {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Error: {error || "Failed to load notes"}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">My Notes</h2>
          <p className="text-slate-500 text-sm mt-1">
            Access your uploaded study materials
          </p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
          <Upload className="w-4 h-4" />
          Upload Notes
        </button>
      </div>

      {/* Empty State */}
      {status === "succeeded" && notes.length === 0 && (
        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
          <p>No notes found. Upload one to get started!</p>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, index) => {
          // Cycle through styles based on index
          const style = STYLE_VARIANTS[index % STYLE_VARIANTS.length];
          const NoteIcon = style.icon;

          return (
            <div
              key={note.N_ID || index}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group"
            >
              {/* Colored Header */}
              <div
                className={`${style.color} h-32 relative p-4 transition-colors duration-300`}
              >
                {/* File Type Badge (Top Left) */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                  <FileText className={`w-3 h-3 ${style.textColor}`} />
                  <span className={`text-[10px] font-bold ${style.textColor}`}>
                    PDF {/* You can map this too: note.File_Type || 'PDF' */}
                  </span>
                </div>

                {/* Subject Badge (Top Right) - Replaces Star */}
                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[10px] font-bold text-white tracking-wide uppercase">
                    {note.Subject || "General"}
                  </span>
                </div>

                {/* Large Watermark Icon */}
                <div className="w-full h-full flex items-center justify-center">
                  <NoteIcon className="w-16 h-16 text-white opacity-25 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                  {/* Using your field name: Note_File */}
                  {note.Note_File || note.title || "Untitled Note"}
                </h3>

                <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                  {/* Using your field name: Description */}
                  {note.Description || "No description provided."}
                </p>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-slate-50">
                  <button
                    disabled={true} // Kept disabled as per your snippet
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotesSection;
