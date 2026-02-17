import React, { useEffect } from "react";
import NotesCard from "../cards/NotesCard"; // Ensure this path is correct
import FilledTitle from "../common/FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotes,
  selectAllNotes,
  selectNotesError,
  selectNotesStatus,
} from "../../redux/slice/notesSlice";
import { selectIsAuthenticated } from "../../redux/slice/authSlice"; // Import Auth selector
import ShowMoreButton from "../common/ShowMoreButton";
import Loading from "../common/Loading";
import {
  Code2,
  FlaskConical,
  TrendingUp,
  Palette,
  Sigma,
  BrainCircuit,
} from "lucide-react"; // Icons for the card styles

// 1. Define Style Variants (Matches your full Notes page)
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

const NotesSection = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const notes = useSelector(selectAllNotes);
  const status = useSelector(selectNotesStatus);
  const error = useSelector(selectNotesError);
  const isAuth = useSelector(selectIsAuthenticated); // Get Auth Status

  // 2. MOCK USER ID (Simulates logged-in user for Edit/Delete check)
  const MOCK_CURRENT_USER_ID = 104;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotes());
    }
  }, [status, dispatch]);

  // 3. Define Mock Handlers for the Cards
  const handleReport = (e, id) => {
    e.stopPropagation();
    console.log("Report Note ID:", id);
  };
  const handleDownload = (path) => console.log("Download:", path);
  const handleEdit = (id) => console.log("Edit Note ID:", id);
  const handleDelete = (id) => console.log("Delete Note ID:", id);

  return (
    <section className="flex flex-col px-6 sm:px-10 py-8 items-center bg-[#FFFBEB]">
      <FilledTitle text="Notes" />

      {status === "loading" && <Loading text="loading notes" />}
      {status === "failed" && <p>Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-10 px-4">
        {status === "succeeded" &&
          notes
            .slice(0, 3)
            .map((note, index) => (
              <NotesCard
                key={note.N_ID}
                note={note}
                index={index}
                style={STYLE_VARIANTS[index % STYLE_VARIANTS.length]}
                isAuth={isAuth}
                currentUserId={MOCK_CURRENT_USER_ID}
                onReport={handleReport}
                onDownload={handleDownload}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>

      <ShowMoreButton text="View More Notes" path="/notes" />
    </section>
  );
};

export default NotesSection;
