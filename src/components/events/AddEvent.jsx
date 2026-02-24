import React, { useRef, useState } from "react";
import { X, Calendar, ImagePlus, Loader2, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";
import { createEvent, updateEvent } from "../../redux/slice/eventsSlice";
import { selectUser } from "../../redux/slice/authSlice";

const AddEventOverlay = ({ onClose, onSuccess, initialData }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const fileInputRef = useRef(null);
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    Description: initialData?.Description || "",
    Event_Date: initialData?.Event_Date?.split("T")[0] || "",
    Poster_File: null,
  });

  const [previewUrl, setPreviewUrl] = useState(
    initialData?.Poster_File || null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
  ];
  const MAX_SIZE = 5 * 1024 * 1024;
  const MAX_DESCRIPTION_LENGTH = 255;
  const TODAY = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Description" && value.length > MAX_DESCRIPTION_LENGTH) {
      toast.error("Maximum 255 characters allowed");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only PNG, JPG, SVG or WEBP images are allowed");
      return false;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Poster size must be under 5MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!validateFile(file)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, Poster_File: file }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (!validateFile(file)) return;

      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        Poster_File: file,
      }));
    }
  };

  /* ---------- SUBMIT VALIDATION AND DISPATCH ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && !formData.Poster_File) {
      toast.error("Event poster is required");
      return;
    }

    if (!formData.Event_Date) {
      toast.error("Event date is required");
      return;
    }

    if (formData.Event_Date < TODAY) {
      toast.error("Event date cannot be in the past");
      return;
    }

    setLoading(true);

    const submissionData = new FormData();
    submissionData.append("Description", formData.Description.trim() || null);
    submissionData.append("Event_Date", formData.Event_Date);

    if (formData.Poster_File) {
      submissionData.append("Poster_File", formData.Poster_File);
    }

    try {
      if (isEditMode) {
        // Correct format for updateEvent thunk: { id, formData }
        await dispatch(
          updateEvent({
            id: initialData.E_ID,
            formData: submissionData,
          }),
        ).unwrap();
        toast.success("Event updated successfully");
      } else {
        // For create: just pass FormData directly
        submissionData.append("Added_By", user?.S_ID || user?.id || 1);
        await dispatch(createEvent(submissionData)).unwrap();
        toast.success("Event posted successfully");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.log(err);

      let errorMessage = isEditMode
        ? "Failed to update event"
        : `Failed to create event`;

      if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI (UNCHANGED) ---------- */

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-poppins">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            {isEditMode ? "Edit Event Details" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          <form
            id="add-event-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Poster Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Event Poster <span className="text-red-500">*</span>
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer
                  ${isDragging ? "border-green-500 bg-green-50" : "border-slate-300 hover:border-green-400 hover:bg-slate-50"}
                  ${previewUrl ? "bg-green-50 border-green-200" : ""}
                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  required={!isEditMode}
                />

                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-md mb-2"
                    />
                    <p className="text-sm font-semibold text-green-700 line-clamp-1">
                      {formData.Poster_File?.name || "Current Poster"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-slate-100 rounded-full mb-3 text-slate-500">
                      <ImagePlus className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      Click to upload or drag and drop poster
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG, SVG or WEBP (Max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Event Description{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                name="Description"
                rows={4}
                maxLength={255}
                placeholder="Details about the event (venue, time, etc.)..."
                value={formData.Description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm resize-none"
              />

              {/* Character Counter */}
              <div className="mt-1 text-xs text-right">
                <span
                  className={
                    formData.Description.length >= MAX_DESCRIPTION_LENGTH - 10
                      ? "text-red-500 font-medium"
                      : "text-slate-400"
                  }
                >
                  {formData.Description.length} / {MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Date of the Event <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="Event_Date"
                required
                value={formData.Event_Date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-event-form"
            disabled={
              loading ||
              !formData.Event_Date ||
              (!isEditMode && !formData.Poster_File)
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-900/10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? (
              <>{isEditMode ? "Updating..." : "Publishing..."}</>
            ) : (
              <>{isEditMode ? "Save Changes" : "Publish Event"}</>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddEventOverlay;
  