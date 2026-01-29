import React, { useState } from "react";
import { X, UploadCloud, FileText, Loader2 } from "lucide-react";
import { useSelector } from "react-redux"; // To get current user ID
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_PDF_TYPE = "application/pdf";
const MAX_DESCRIPTION_LENGTH = 255;

// MOCK DATA (Replace with API fetch or props)
const DEGREE_OPTIONS = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Mathematics" },
  { id: 3, name: "Engineering" },
  { id: 4, name: "Business" },
];

const SUBJECT_OPTIONS = {
  1: [
    { id: 101, name: "Data Structures" },
    { id: 102, name: "Web Development" },
  ],
  2: [
    { id: 201, name: "Calculus" },
    { id: 202, name: "Linear Algebra" },
  ],
  3: [{ id: 301, name: "Thermodynamics" }],
  4: [{ id: 401, name: "Marketing" }],
};

const AddNotes = ({ onClose, onUpload }) => {
  const { user } = useSelector((state) => state.auth); // Get User ID

  const [formData, setFormData] = useState({
    title: "", // Useful for UI display even if not strictly in DB schema (or map to Note_File name)
    Degree_ID: "",
    Subject_ID: "",
    Description: "",
    file: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Description" && value.length > MAX_DESCRIPTION_LENGTH) {
      toast.error("Description cannot exceed 255 characters");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "Degree_ID") {
      setFormData((prev) => ({ ...prev, Subject_ID: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== ALLOWED_PDF_TYPE) {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("PDF size must be under 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== ALLOWED_PDF_TYPE) {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("PDF size must be under 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Degree_ID) {
      toast.error("Please select a degree");
      return;
    }

    if (!formData.Subject_ID) {
      toast.error("Please select a subject");
      return;
    }

    if (!formData.file) {
      toast.error("Please upload a PDF file");
      return;
    }

    setLoading(true);

    const submissionData = new FormData();
    submissionData.append("Note_File", formData.file);
    submissionData.append("Degree_ID", formData.Degree_ID);
    submissionData.append("Subject_ID", formData.Subject_ID);

    // Description is OPTIONAL as per DD
    submissionData.append("Description", formData.Description.trim() || null);

    submissionData.append("Added_By", user?.id || 1);
    submissionData.append("Is_Active", 1);

    setTimeout(() => {
      setLoading(false);
      toast.success("Notes uploaded successfully 📄");
      onUpload(submissionData);
      onClose();
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-poppins">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-green-600" />
            Upload New Notes
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6">
          <form
            id="add-notes-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Degree Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Degree Program <span className="text-red-500">*</span>
              </label>
              <select
                name="Degree_ID"
                value={formData.Degree_ID}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white cursor-pointer"
                required
              >
                <option value="">Select Degree</option>
                {DEGREE_OPTIONS.map((deg) => (
                  <option key={deg.id} value={deg.id}>
                    {deg.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="Subject_ID"
                value={formData.Subject_ID}
                onChange={handleChange}
                disabled={!formData.Degree_ID}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
                required
              >
                <option value="">
                  {formData.Degree_ID
                    ? "Select Subject"
                    : "Select Degree First"}
                </option>
                {formData.Degree_ID &&
                  SUBJECT_OPTIONS[formData.Degree_ID]?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Description{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                name="Description"
                rows={3}
                maxLength={255}
                placeholder="Brief description about the notes..."
                value={formData.Description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm resize-none"
              />

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

            {/* Drag & Drop File Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Attachment <span className="text-red-500">*</span>
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer
                  ${isDragging ? "border-green-500 bg-green-50" : "border-slate-300 hover:border-green-400 hover:bg-slate-50"}
                  ${formData.file ? "bg-green-50 border-green-200" : ""}
                `}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="application/pdf"
                  required
                />

                {formData.file ? (
                  <div className="flex items-center gap-3 text-green-700">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold line-clamp-1">
                        {formData.file.name}
                      </p>
                      <p className="text-xs opacity-70">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-slate-100 rounded-full mb-3 text-slate-500">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PDF only (Max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
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
            form="add-notes-form"
            disabled={loading || !formData.file}
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Notes"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddNotes;
