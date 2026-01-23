import React, { useState } from "react";
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
  AlertTriangle,
  AlertCircle,
  Filter,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddNotes from "../notes/AddNotes";

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

const DEGREE_SUBJECTS = {
  "Computer Science": [
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Operating Systems",
  ],
  Mathematics: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math"],
  Engineering: ["Thermodynamics", "Circuit Theory", "Mechanics", "Robotics"],
  Business: ["Marketing", "Finance", "Economics", "Management"],
};

const NotesSection = ({ notes = [], status = "succeeded", error = null }) => {
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [addNotes, setAddNotes] = useState(false);
  const navigate = useNavigate();
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
  const handleReportClick = (e, noteId) => {
    e.stopPropagation();

    navigate(`/submitComplaint/notes/${noteId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins">
      {addNotes && (
        <AddNotes
          onClose={() => setAddNotes(false)}
          onUpload={(data) => console.log("Uploading:", data)}
        />
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        {/* <div>
          <h2 className="text-4xl font-bold text-slate-900">My Notes</h2>
          <p className="text-slate-500 text-sm mt-1">
            Access your uploaded study materials
          </p>
        </div> */}
        <button
          onClick={() => setAddNotes(!addNotes)}
          className="flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
        >
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-4">
              <Filter className="w-4 h-4 text-green-600" />
              <h3>Filter by Category</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Select Degree
                </label>
                <select
                  value={selectedDegree}
                  onChange={(e) => {
                    setSelectedDegree(e.target.value);
                    setSelectedSubject("");
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="">All Degrees</option>
                  {Object.keys(DEGREE_SUBJECTS).map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDegree && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Select Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  >
                    <option value="">All Subjects</option>
                    {DEGREE_SUBJECTS[selectedDegree].map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {(selectedDegree || selectedSubject) && (
                <button
                  onClick={() => {
                    setSelectedDegree("");
                    setSelectedSubject("");
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium underline w-full text-center"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-9 space-y-4">
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
                    <div className="absolute top-4 left-4">
                      <button
                        onClick={handleReportClick}
                        className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-red-500 text-white backdrop-blur-md rounded-full transition-all duration-300"
                        title="Report note"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
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
      </div>
    </div>
  );
};

export default NotesSection;
