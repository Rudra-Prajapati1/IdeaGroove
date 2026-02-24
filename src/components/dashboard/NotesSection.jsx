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
import Controls from "../common/Controls";
import NotesCard from "../cards/NotesCard";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import ActionButton from "../common/ActionButton";
import AddNotes from "../notes/AddNotes";
import { selectUser } from "../../redux/slice/authSlice";
import {
  selectAllDegrees,
  selectSubjectsByDegree,
} from "../../redux/slice/degreeSubjectSlice";

const STYLE_VARIANTS = [
  { color: "bg-blue-600", icon: Code2 },
  { color: "bg-emerald-500", icon: FlaskConical },
  { color: "bg-orange-500", icon: TrendingUp },
  { color: "bg-pink-500", icon: Palette },
  { color: "bg-slate-600", icon: Sigma },
  { color: "bg-sky-500", icon: BrainCircuit },
];

const NotesSection = ({ notes }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showAddNotes, setShowAddNotes] = useState(false);
  const [editing, setEditing] = useState(null);

  const degrees = useSelector(selectAllDegrees);
  const subjects = useSelector(
    selectSubjectsByDegree(Number(selectedDegree) || 0),
  );

  const filteredNotes = notes
    .filter((note) => {
      if (selectedDegree && note.Degree_ID !== Number(selectedDegree))
        return false;
      if (selectedSubject && note.Subject_ID !== Number(selectedSubject))
        return false;

      const matchesSearch =
        note.Note_File?.toLowerCase().includes(search.toLowerCase()) ||
        note.Description?.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.Added_on);
      const dateB = new Date(b.Added_on);

      if (filter === "newest_to_oldest") return dateB - dateA;
      if (filter === "oldest_to_newest") return dateA - dateB;
      return 0;
    });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {(showAddNotes || editing) && (
        <AddNotes
          onClose={() => {
            setShowAddNotes(false);
            setEditing(null);
          }}
          editing={editing}
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
                  {degrees.map((deg) => (
                    <option key={deg.Degree_ID} value={deg.Degree_ID}>
                      {deg.degree_name}
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
                    {subjects.map((sub) => (
                      <option key={sub.Subject_ID} value={sub.Subject_ID}>
                        {sub.subject_name}
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
                  key={note.N_ID}
                  note={note}
                  style={STYLE_VARIANTS[index % STYLE_VARIANTS.length]}
                  isAuth={isAuth}
                  currentUserId={user?.S_ID}
                  onEdit={() => setEditing(note)}
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
