import React, { useState } from "react";
import { createPortal } from "react-dom"; // 1. Import createPortal
import {
  X,
  MessageSquare,
  Loader2,
  BookOpen,
  GraduationCap,
  FileText,
} from "lucide-react";
import { useSelector } from "react-redux";

// --- Mock Data ---
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

const AskQuestionModal = ({ onClose, onSubmit }) => {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    Question: "",
    Degree_ID: "",
    Subject_ID: "",
    Description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "Degree_ID") {
      setFormData((prev) => ({ ...prev, Subject_ID: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Question || !formData.Degree_ID || !formData.Subject_ID)
      return;

    setLoading(true);

    const payload = {
      Question: formData.Question,
      Degree_ID: parseInt(formData.Degree_ID),
      Subject_ID: parseInt(formData.Subject_ID),
      Added_By: user?.id || 1,
      Is_Active: 1,
    };

    setTimeout(() => {
      setLoading(false);
      onSubmit(payload);
      onClose();
    }, 1500);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white";

  // 2. Wrap the JSX in createPortal
  return createPortal(
    // 3. Update Z-Index to [9999] and increase blur to 'md' or 'lg'
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Ask a Question
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
            id="ask-question-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Question Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Question"
                placeholder="e.g. How do I implement Binary Search?"
                value={formData.Question}
                onChange={handleChange}
                className={inputClass}
                required
                maxLength={255}
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1 text-right">
                {formData.Question.length}/255
              </p>
            </div>

            {/* Degree Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Degree Program <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="Degree_ID"
                  value={formData.Degree_ID}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                  required
                >
                  <option value="">Select Degree</option>
                  {DEGREE_OPTIONS.map((deg) => (
                    <option key={deg.id} value={deg.id}>
                      {deg.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Subject Topic <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="Subject_ID"
                  value={formData.Subject_ID}
                  onChange={handleChange}
                  disabled={!formData.Degree_ID}
                  className={`${inputClass} appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-400`}
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
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
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
            form="ask-question-form"
            disabled={
              loading ||
              !formData.Question ||
              !formData.Degree_ID ||
              !formData.Subject_ID
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-900/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Posting...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" /> Post Question
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body, // Target: Render directly into body
  );
};

export default AskQuestionModal;
