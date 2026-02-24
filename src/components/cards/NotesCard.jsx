import React, { useState } from "react";
import { Download, User, Calendar, Edit2, Trash2 } from "lucide-react";
import ComplaintButton from "../ComplaintButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteNote } from "../../redux/slice/notesSlice";
import { ConfirmationBox } from "../common/ConfirmationBox";
import toast from "react-hot-toast";
import { ConfirmationBox } from "../common/ConfirmationBox";

const NotesCard = ({
  note,
  style,
  isAuth,
  currentUserId,
  onEdit,
  onDeleteSuccess,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const NoteIcon = style.icon;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const isOwner = isAuth && Number(note.Author_ID) === Number(currentUserId);

  const [isDeleteOpen,setIsDeleteOpen] = useState(false);

  const formattedDate = note.Added_on
    ? new Date(note.Added_on).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Just now";

  // Build Cloudinary PDF first-page thumbnail URL
  // Cloudinary supports: /image/upload/<transformations>/v.../file.pdf
  // Adding pg_1,w_400,h_300,c_fill,f_jpg converts page 1 to a JPG thumbnail
  const getPdfThumbnail = (fileUrl) => {
    if (!fileUrl) return null;

    return fileUrl
      .replace("/raw/upload/", "/image/upload/")
      .replace("/upload/", "/upload/pg_1,w_400,h_250,c_fill,f_jpg,q_auto/");
  };

  const thumbnailUrl = getPdfThumbnail(note.Note_File);

  /* =================== DELETE =================== */
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
  const handleDownload = () => {
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

    fetch(note.Note_File)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch file");
        return res.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        // Use stored File_Name or derive from URL
        const fileName =
          note.File_Name || note.Note_File.split("/").pop() || "notes.pdf";
        link.download = fileName.endsWith(".pdf")
          ? fileName
          : `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        toast.success("Download started!", { id: "download" });
      })
      .catch(() => {
        toast.error("Failed to download file", { id: "download" });
      });
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
                onClick={() => navigate(`/submitComplaint/notes/${note.N_ID}`)}
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
          <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
            {note.Subject_Name || note.Degree_Name || "Untitled Note"}
          </h3>

          <div className="flex flex-wrap gap-y-1 gap-x-4 mb-3 text-xs text-slate-500 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">
                {note.Author || "Anonymous"}
              </span>
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
