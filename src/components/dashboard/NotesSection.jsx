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
  const subjects = useSelector(
    selectSubjectsByDegree(Number(selectedDegree) || 0),
  );

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
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Select Degree
                </label>
                <select
                  value={selectedDegree}
                  onChange={(e) => onDegreeChange(e.target.value)}
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
                    onChange={(e) => onSubjectChange(e.target.value)}
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

        {/* RIGHT CONTENT — subtle dim while refetching */}
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
