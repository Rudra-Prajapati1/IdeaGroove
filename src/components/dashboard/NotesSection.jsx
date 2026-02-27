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
import { selectIsAuthenticated, selectUser } from "../../redux/slice/authSlice";
import ActionButton from "../common/ActionButton";
import AddNotes from "../notes/AddNotes";
import {
  selectAllDegrees,
  selectAllSubjects,
  selectSubjectsByDegree,
} from "../../redux/slice/degreeSubjectSlice";
import SearchableDropdown from "../common/SearchableDropdown";

const STYLE_VARIANTS = [
  { color: "bg-blue-600", icon: Code2 },
  { color: "bg-emerald-500", icon: FlaskConical },
  { color: "bg-orange-500", icon: TrendingUp },
  { color: "bg-pink-500", icon: Palette },
  { color: "bg-slate-600", icon: Sigma },
  { color: "bg-sky-500", icon: BrainCircuit },
];

const NotesSection = ({
  notes,
  search,
  filter,
  selectedDegree,
  selectedSubject,
  onSearchChange,
  onFilterChange,
  onDegreeChange,
  onSubjectChange,
  isRefetching,
  onRefetch,
}) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [showAddNotes, setShowAddNotes] = useState(false);
  const [editing, setEditing] = useState(null);

  const degrees = useSelector(selectAllDegrees);

  // If degree is selected → show only subjects for that degree
  // If no degree selected → show all subjects (independent filter)
  const subjectsByDegree = useSelector(
    selectSubjectsByDegree(Number(selectedDegree) || 0),
  );
  const allSubjects = useSelector(selectAllSubjects);
  const subjects = selectedDegree ? subjectsByDegree : allSubjects;

  // ── Degree dropdown helpers ─────────────────
  const degreeNames = degrees.map((d) => d.degree_name);

  const handleDegreeSelect = (value) => {
    if (value === "all") {
      onDegreeChange("");
      onSubjectChange(""); // reset subject when degree is cleared
    } else {
      const matched = degrees.find((d) => d.degree_name === value);
      onDegreeChange(matched ? String(matched.Degree_ID) : "");
      onSubjectChange(""); // reset subject when degree changes
    }
  };

  const selectedDegreeName =
    degrees.find((d) => String(d.Degree_ID) === selectedDegree)?.degree_name ||
    "";

  // ── Subject dropdown helpers ────────────────
  const subjectNames = subjects.map((s) => s.subject_name);

  const handleSubjectSelect = (value) => {
    if (value === "all") {
      onSubjectChange("");
    } else {
      const matched = subjects.find((s) => s.subject_name === value);
      onSubjectChange(matched ? String(matched.Subject_ID) : "");
    }
  };

  const selectedSubjectName =
    subjects.find((s) => String(s.Subject_ID) === selectedSubject)
      ?.subject_name || "";

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {(showAddNotes || editing) && (
        <AddNotes
          onClose={() => {
            setShowAddNotes(false);
            setEditing(null);
          }}
          editing={editing}
          onSuccess={() => {
            onRefetch();
            setShowAddNotes(false);
            setEditing(null);
          }}
        />
      )}

      <div className="relative z-40">
        <div className="max-w-6xl mx-auto px-4 -mt-8 flex justify-between items-center mb-8">
          <Controls
            search={search}
            setSearch={onSearchChange}
            filter={filter}
            setFilter={onFilterChange}
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
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-4">
              <Filter className="w-4 h-4 text-green-600" />
              <h3>Filter by Category</h3>
            </div>

            <div className="space-y-6">
              {/* Degree Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Select Degree
                </label>
                <SearchableDropdown
                  options={degreeNames}
                  value={selectedDegreeName}
                  onChange={handleDegreeSelect}
                  placeholder="Search degree..."
                  text="All Degrees"
                  icon={GraduationCap}
                />
              </div>

              {/* Subject Filter — always visible, list adapts to degree */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Select Subject
                </label>
                <SearchableDropdown
                  options={subjectNames}
                  value={selectedSubjectName}
                  onChange={handleSubjectSelect}
                  placeholder="Search subject..."
                  text="All Subjects"
                  icon={BookOpen}
                />
              </div>

              {(selectedDegree || selectedSubject) && (
                <button
                  onClick={() => {
                    onDegreeChange("");
                    onSubjectChange("");
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium underline w-full text-center"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div
          className={`lg:col-span-9 space-y-4 transition-opacity duration-200 ${
            isRefetching ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          {notes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="text-lg font-medium">
                {search || selectedDegree || selectedSubject
                  ? "No notes match your filters"
                  : "No notes found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <NotesCard
                  key={note.N_ID}
                  note={note}
                  style={STYLE_VARIANTS[index % STYLE_VARIANTS.length]}
                  isAuth={isAuth}
                  currentUserId={user?.S_ID || user?.id}
                  onEdit={() => setEditing(note)}
                  onDeleteSuccess={onRefetch}
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
