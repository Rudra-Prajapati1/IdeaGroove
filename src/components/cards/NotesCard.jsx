import React, { useState } from "react";
import { Download, User, Calendar, Edit2, Trash2 } from "lucide-react";
import ComplaintButton from "../ComplaintButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteNote } from "../../redux/slice/notesSlice";
import { ConfirmationBox } from "../common/ConfirmationBox";
import toast from "react-hot-toast";
import api from "../../api/axios";

const NotesCard = ({
  note,
  style,
  isAuth,
  currentUserId,
  onEdit,
  onDeleteSuccess,
  authorLabel,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const NoteIcon = style.icon;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const isOwner = isAuth && Number(note.Author_ID) === Number(currentUserId);
  const authorName =
    note.Author_Username || note.Username || note.Author || "Anonymous";
  const authorId = note.Author_ID || note.AuthorId || note.Author_Id || null;
  const fileName = note.File_Name
    ? note.File_Name
    : note.Note_File
      ? note.Note_File.split("/").pop()?.split("?")[0]
      : "";

  const formattedDate = note.Added_on
    ? new Date(note.Added_on).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Just now";

  const getPdfThumbnail = (fileUrl) => {
    if (!fileUrl) return null;

    return fileUrl
      .replace("/raw/upload/", "/image/upload/")
      .replace("/upload/", "/upload/pg_1,w_400,h_250,c_fill,f_jpg,q_auto/");
  };

  const thumbnailUrl = getPdfThumbnail(note.Note_File);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteNote(note.N_ID)).unwrap();
      toast.success("Notes Deleted Successfully!");
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete notes";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  /* =================== DOWNLOAD =================== */
  const handleDownload = async () => {
    if (!isAuth) {
      toast.error("Please login to download notes");
      return;
    }
    if (!note.Note_File) {
      toast.error("File not available");
      return;
    }

    // Use fetch to get the file as a blob — avoids Cloudinary 401 on fl_attachment
    toast.loading("Preparing download...", { id: "download" });

    try {
      const { data } = await api.get(`/notes/download/${note.N_ID}`);

      if (!data?.url) {
        throw new Error("Download URL missing");
      }

      const link = document.createElement("a");
      link.href = data.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started!", { id: "download" });
    } catch (err) {
      const message =
        err?.response?.status === 401
          ? "Please login again to download notes"
          : "Failed to download file";
      toast.error(message, { id: "download" });
    }
  };

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmationBox
          type="Note"
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group relative">
        <div className={`h-40 relative overflow-hidden`}>
          {thumbnailUrl && !thumbError ? (
            <>
              <img
                src={thumbnailUrl}
                alt="PDF Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setThumbError(true)}
              />
              <div className="absolute inset-0 bg-black/10" />
            </>
          ) : (
            <div
              className={`${style.color} w-full h-full flex items-center justify-center`}
            >
              <NoteIcon className="w-16 h-16 text-white opacity-25 group-hover:scale-110 transition-transform duration-500" />
            </div>
          )}

          {isAuth && !isOwner && (
            <div className="absolute top-3 left-3 z-10">
              <ComplaintButton
                onClick={() =>
                  navigate(
                    `/submit-complaint/notes/${note.N_ID}/${note.Description}`,
                  )
                }
                element="notes"
              />
            </div>
          )}

          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 z-10">
            <span className="text-[10px] font-bold text-white tracking-wide uppercase">
              {note.Subject_Name || "General"}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-md font-bold text-slate-800 mb-2 leading-tight truncate">
            {fileName || note.Subject_Name || "Untitled Note"}
          </h3>

          <div className="flex flex-wrap gap-y-1 gap-x-4 mb-3 text-xs text-slate-500 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {authorLabel ? (
                <span className="font-medium text-slate-700">
                  {authorLabel}
                </span>
              ) : authorId ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/${authorId}`);
                  }}
                  className="font-medium text-slate-700 hover:underline"
                >
                  {authorName}
                </button>
              ) : (
                <span className="font-medium text-slate-700">{authorName}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
            {note.Description || "No description provided."}
          </p>

          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50">
            <button
              onClick={handleDownload}
              className={`flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                isAuth
                  ? "hover:bg-slate-800 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            {isAuth && isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={onEdit}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                  title="Edit Note"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesCard;
