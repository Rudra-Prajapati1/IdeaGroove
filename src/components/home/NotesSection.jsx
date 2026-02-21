import React, { useEffect } from "react";
import NotesCard from "../cards/NotesCard";
import FilledTitle from "../common/FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPreviewNotes,
  selectPreviewNotes,
  selectPreviewStatus,
  selectPreviewError,
} from "../../redux/slice/notesSlice";
import { selectIsAuthenticated, selectUser } from "../../redux/slice/authSlice";
import ShowMoreButton from "../common/ShowMoreButton";
import Loading from "../common/Loading";
import {
  Code2,
  FlaskConical,
  TrendingUp,
  Palette,
  Sigma,
  BrainCircuit,
} from "lucide-react";

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

  const previewNotes = useSelector(selectPreviewNotes);
  const previewStatus = useSelector(selectPreviewStatus);
  const previewError = useSelector(selectPreviewError);

  const isAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // ✅ Real Logged-in User ID
  const currentUserId = user?.S_ID;

  useEffect(() => {
    if (previewStatus === "idle") {
      dispatch(fetchPreviewNotes());
    }
  }, [previewStatus, dispatch]);

  return (
    <section className="flex flex-col px-6 sm:px-10 py-8 items-center bg-[#FFFBEB]">
      <FilledTitle text="Notes" />

      {previewStatus === "loading" && <Loading text="loading notes" />}

      {previewStatus === "failed" && <p>Error: {previewError}</p>}

      {previewStatus === "succeeded" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-10 px-4">
          {previewNotes?.length > 0 ? (
            previewNotes.map((note) => (
              <NotesCard
                key={note.N_ID}
                note={note}
                index={index}
                style={STYLE_VARIANTS[index % STYLE_VARIANTS.length]}
                isAuth={isAuth}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">
              No notes available
            </p>
          )}
        </div>
      )}

      <ShowMoreButton text="View More Notes" path="/notes" />
    </section>
  );
};

export default NotesSection;
