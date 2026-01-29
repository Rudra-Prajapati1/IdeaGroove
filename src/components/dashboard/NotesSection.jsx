import React, { useState } from "react";
import {
  Upload,
  Filter,
  GraduationCap,
  BookOpen,
  Code2,
  FlaskConical,
  TrendingUp,
  Palette,
  Sigma,
  BrainCircuit,
} from "lucide-react";
import Controls from "../Controls";
import NotesCard from "../notes/NotesCard";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import ActionButton from "../ActionButton";
import AddNotes from "../notes/AddNotes";

const DEGREE_SUBJECTS = {
  "Computer Science": ["DBMS", "React", "Java", "Web Development"],
  Engineering: [
    "Operating Systems",
    "REST API",
    "Computer Networks",
    "Compiler Design",
    "Software Engineering",
  ],
};

const MOCK_NOTES = [
  {
    id: 1,
    file: "rest_api_notes.pdf",
    description: "REST API principles and HTTP methods",
    degree: "Engineering",
    subject: "REST API",
    addedOn: "2025-02-02",
    addedBy: 105,
  },
  {
    id: 2,
    file: "react_basics_notes.pdf",
    description: "Introduction to React and components",
    degree: "Computer Science",
    subject: "React",
    addedOn: "2025-01-08",
    addedBy: 102,
  },
  {
    id: 3,
    file: "os_deadlock_notes.pdf",
    description: "Deadlock concepts and prevention",
    degree: "Engineering",
    subject: "Operating Systems",
    addedOn: "2025-01-12",
    addedBy: 103,
  },
  {
    id: 4,
    file: "dbms_unit1_notes.pdf",
    description: "ER models and normalization",
    degree: "Computer Science",
    subject: "DBMS",
    addedOn: "2025-01-05",
    addedBy: 101,
  },
];

const STYLE_VARIANTS = [
  { color: "bg-blue-600", icon: Code2 },
  { color: "bg-emerald-500", icon: FlaskConical },
  { color: "bg-orange-500", icon: TrendingUp },
  { color: "bg-pink-500", icon: Palette },
  { color: "bg-slate-600", icon: Sigma },
  { color: "bg-sky-500", icon: BrainCircuit },
];

const NotesSection = () => {
  const isAuth = useSelector(selectIsAuthenticated);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showAddNotes, setShowAddNotes] = useState(false);

  const filteredNotes = MOCK_NOTES.filter((note) => {
    if (selectedDegree && note.degree !== selectedDegree) return false;
    if (selectedSubject && note.subject !== selectedSubject) return false;

    const matchesSearch =
      note.file.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  }).sort((a, b) => {
    const dateA = new Date(a.addedOn);
    const dateB = new Date(b.addedOn);

    if (filter === "newest_to_oldest") return dateB - dateA;
    if (filter === "oldest_to_newest") return dateA - dateB;
    return 0;
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {showAddNotes && (
        <AddNotes
          onClose={() => setShowAddNotes(false)}
          onUpload={(formData) => {
            console.log("Notes upload payload:", formData);
          }}
        />
      )}
      <div className="relative z-40">
        <div className="max-w-6xl mx-auto px-4 -mt-8 flex justify-between items-center mb-8">
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

          <ActionButton
            label="Upload Notes"
            icon={Upload}
            disabled={!isAuth}
            disabledMessage="Please login to upload notes"
            onClick={() => setShowAddNotes(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
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

        {/* RIGHT CONTENT — NOTES GRID */}
        <div className="lg:col-span-9 space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="text-lg font-medium">
                No notes found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <NotesCard
                  key={note.id}
                  note={{
                    Note_File: note.file,
                    Description: note.description,
                    Added_By: note.addedBy,
                    Added_On: note.addedOn,
                  }}
                  style={STYLE_VARIANTS[index % STYLE_VARIANTS.length]}
                  isAuth={isAuth}
                  currentUserId={104}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NotesSection;
