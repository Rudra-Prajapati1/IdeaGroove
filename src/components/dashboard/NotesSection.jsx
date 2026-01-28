import React, { useState } from "react";
import {
  Upload,
  Code2,
  FlaskConical,
  TrendingUp,
  Palette,
  Sigma,
  BrainCircuit,
  Filter,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddNotes from "../notes/AddNotes";
import Controls from "../Controls";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import Loading from "../Loading";
import NotesCard from "../notes/NotesCard";

// Style Mapping
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
  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [addNotes, setAddNotes] = useState(false);


  // MOCK USER ID for ownership check (In real app, get from Redux)
  let MOCK_CURRENT_USER_ID = 0;
  if (isAuth) {
    MOCK_CURRENT_USER_ID = 104;
  }
  // --- Filter and Sort Logic ---
  const filteredNotes = notes
    .filter((note) => {
      // 1. Search Logic
      const matchesSearch =
        note?.Description?.toLowerCase().includes(search.toLowerCase()) ||
        note?.Note_File?.toLowerCase().includes(search.toLowerCase());

      // 2. Degree Filter Logic
      const matchesDegree = selectedDegree
        ? note?.Degree === selectedDegree
        : true;

      // 3. Subject Filter Logic
      const matchesSubject = selectedSubject
        ? note?.Subject === selectedSubject
        : true;

      return matchesSearch && matchesDegree && matchesSubject;
    })
    .sort((a, b) => {
      // 4. Sorting Logic (Based on Added_On date)
      const dateA = new Date(a.Added_On);
      const dateB = new Date(b.Added_On);

      if (filter === "newest_to_oldest") {
        return dateB - dateA; // Most recent first
      } else if (filter === "oldest_to_newest") {
        return dateA - dateB; // Oldest first
      }
      return 0; // Default order
    });

  // --- Handlers ---
  const handleReportClick = (e, noteId) => {
    e.stopPropagation();
    navigate(`/submitComplaint/notes/${noteId}`);
  };

  const handleDownload = (filePath) => {
    console.log("Download:", filePath);
  };

  const handleEdit = (noteId) => {
    console.log("Edit clicked:", noteId);
  };

  const handleDelete = (noteId) => {
    console.log("Delete clicked:", noteId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {addNotes && (
        <AddNotes
          onClose={() => setAddNotes(false)}
          onUpload={(data) => console.log("Uploading:", data)}
        />
      )}

      {/* Header Controls */}
      <div className="relative z-40">
        <div className="max-w-6xl mx-auto px-4 -mt-33 flex justify-between items-center mb-8">
          <Controls
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            searchPlaceholder="Search notes..."
            filterOptions={{
              All: "all",
              "Newest to Oldest": "newest_to_oldest",
              "Oldest to Newest": "oldest_to_newest",
            }}
          />
          <button
            disabled={!isAuth}
            onClick={() => setAddNotes(!addNotes)}
            className={`flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm ${
              !isAuth && "cursor-not-allowed"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Notes
          </button>
        </div>
      </div>

      {status === "loading" && <Loading text="loading notes" />}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}

      {/* Empty State */}
      {status === "succeeded" && filteredNotes.length === 0 && (
        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
          <p>No notes found matching your criteria. Try adjusting your filters!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT SIDEBAR (FILTERS) --- */}
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

        {/* --- RIGHT CONTENT (NOTES GRID) --- */}
        <div className="lg:col-span-9 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <NotesCard
                key={note.N_ID || index}
                note={note}
                index={index}
                style={STYLE_VARIANTS[index % STYLE_VARIANTS.length]}
                isAuth={isAuth}
                currentUserId={MOCK_CURRENT_USER_ID}
                onReport={handleReportClick}
                onDownload={handleDownload}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;