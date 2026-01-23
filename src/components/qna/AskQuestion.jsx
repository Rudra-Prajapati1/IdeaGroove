import React, { useState } from "react";
import { X, MessageSquare, Loader2 } from "lucide-react";
import { useSelector } from "react-redux"; // To get current user ID

// MOCK IDs for Degrees/Subjects (Replace with real IDs or data from API)
// Ideally, you should pass these 'options' as props from the parent component
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
  const { user } = useSelector((state) => state.auth); // Get User ID from Redux

  const [formData, setFormData] = useState({
    Question: "", // Matches DB column 'Question'
    Degree_ID: "", // Matches DB column 'Degree_ID'
    Subject_ID: "", // Matches DB column 'Subject_ID'
    // Description is NOT in your table image, but useful for UI.
    // If your DB doesn't have it, we might append it to 'Question' or ignore it.
    Description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset subject if degree changes
    if (name === "Degree_ID") {
      setFormData((prev) => ({ ...prev, Subject_ID: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Question || !formData.Degree_ID || !formData.Subject_ID)
      return;

    setLoading(true);

    // Prepare Payload matching DB Schema
    const payload = {
      Question: formData.Question, // + (formData.Description ? `\n\n${formData.Description}` : ""), // Optional: Append desc
      Degree_ID: parseInt(formData.Degree_ID),
      Subject_ID: parseInt(formData.Subject_ID),
      Added_By: user?.id || 1, // Fallback ID if not logged in
      Is_Active: 1,
    };

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      onSubmit(payload); // Send correctly formatted data to parent
      onClose();
    }, 1000);
  };

  return (
    // ✅ Z-INDEX FIX: z-[1000] ensures it covers the Navbar (usually z-50)
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-poppins">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
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

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6">
          <form
            id="ask-question-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Question Input (Mapped to 'Question') */}
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm font-medium"
                required
                maxLength={255} // Matches varchar(255)
              />
              <p className="text-xs text-slate-400 mt-1 text-right">
                {formData.Question.length}/255
              </p>
            </div>

            {/* Degree Selection (Mapped to 'Degree_ID') */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Degree Program <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="Degree_ID"
                  value={formData.Degree_ID}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white appearance-none cursor-pointer"
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
            </div>

            {/* Subject Selection (Mapped to 'Subject_ID') */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Subject Topic <span className="text-red-500">*</span>
              </label>
              <select
                name="Subject_ID"
                value={formData.Subject_ID}
                onChange={handleChange}
                disabled={!formData.Degree_ID}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
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

            {/* Optional Description (Not in table, but good UX) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Additional Details{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                name="Description"
                rows={4}
                placeholder="Add context, code snippets, or specific errors..."
                value={formData.Description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="ask-question-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-md shadow-green-600/20 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Posting...
              </>
            ) : (
              "Post Question"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionModal;
