import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MessageSquare,
  Loader2,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createQuestion, fetchQnA } from "../../redux/slice/qnaSlice";
import {
  selectAllDegrees,
  fetchDegreeSubject,
  selectSubjectsByDegree,
} from "../../redux/slice/degreeSubjectSlice";
import SearchableDropdown from "../common/SearchableDropdown";
import {
  confirmCustomOption,
  normalizeCustomOptionInput,
} from "../../utils/customOptionHelpers";

const AskQuestionModal = ({ onClose, onSubmit, editing, onSuccess }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // ✅ CRITICAL: useState MUST come before any useSelector that depends on state
  const [formData, setFormData] = useState({
    Question: editing?.Question || "",
    Degree_ID: editing?.Degree_ID ? String(editing.Degree_ID) : "",
    Subject_ID: editing?.Subject_ID ? String(editing.Subject_ID) : "",
    New_Degree_Name: "",
    New_Subject_Name: "",
  });

  const [loading, setLoading] = useState(false);

  // Now it's safe to use formData.Degree_ID in useSelector
  const degrees = useSelector(selectAllDegrees);
  const subjects = useSelector(
    selectSubjectsByDegree(Number(formData.Degree_ID) || 0),
  );

  const degreeNames = degrees.map((deg) => deg.degree_name);
  const selectedDegreeName =
    degrees.find((deg) => String(deg.Degree_ID) === formData.Degree_ID)
      ?.degree_name || formData.New_Degree_Name || "";

  const subjectNames = subjects.map((sub) => sub.subject_name);
  const selectedSubjectName =
    subjects.find((sub) => String(sub.Subject_ID) === formData.Subject_ID)
      ?.subject_name || formData.New_Subject_Name || "";

  // If editing prop changes (e.g. user opens a different question to edit), sync form
  useEffect(() => {
    if (editing) {
      setFormData({
        Question: editing.Question || "",
        Degree_ID: editing.Degree_ID ? String(editing.Degree_ID) : "",
        Subject_ID: editing.Subject_ID ? String(editing.Subject_ID) : "",
        New_Degree_Name: "",
        New_Subject_Name: "",
      });
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDegreeSelect = (value) => {
    if (value === "all") {
      setFormData((prev) => ({
        ...prev,
        Degree_ID: "",
        Subject_ID: "",
        New_Degree_Name: "",
        New_Subject_Name: "",
      }));
      return;
    }

    const matched = degrees.find((deg) => deg.degree_name === value);
    setFormData((prev) => ({
      ...prev,
      Degree_ID: matched ? String(matched.Degree_ID) : "",
      Subject_ID: "",
      New_Degree_Name: "",
      New_Subject_Name: "",
    }));
  };

  const handleCustomDegreeSelect = (value) => {
    const normalizedValue = normalizeCustomOptionInput(value);
    if (!normalizedValue || !confirmCustomOption("degree", normalizedValue)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      Degree_ID: "",
      Subject_ID: "",
      New_Degree_Name: normalizedValue,
      New_Subject_Name: "",
    }));
  };

  const handleSubjectSelect = (value) => {
    if (value === "all") {
      setFormData((prev) => ({ ...prev, Subject_ID: "", New_Subject_Name: "" }));
      return;
    }

    const matched = subjects.find((sub) => sub.subject_name === value);
    setFormData((prev) => ({
      ...prev,
      Subject_ID: matched ? String(matched.Subject_ID) : "",
      New_Subject_Name: "",
    }));
  };

  const handleCustomSubjectSelect = (value) => {
    const normalizedValue = normalizeCustomOptionInput(value);
    if (!normalizedValue || !confirmCustomOption("subject", normalizedValue)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      Subject_ID: "",
      New_Subject_Name: normalizedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasDegree = !!(formData.Degree_ID || formData.New_Degree_Name);
    const hasSubject = !!(formData.Subject_ID || formData.New_Subject_Name);

    if (!formData.Question || !hasDegree || !hasSubject)
      return;

    setLoading(true);

    try {
      if (editing) {
        // ✅ EDIT mode — delegate to parent which dispatches updateQuestion
        await onSubmit({
          Question: formData.Question,
          Degree_ID: formData.Degree_ID,
          Subject_ID: formData.Subject_ID,
          New_Degree_Name: formData.New_Degree_Name,
          New_Subject_Name: formData.New_Subject_Name,
        });
      } else {
        // ✅ CREATE mode — dispatch directly
        const payload = {
          Question: formData.Question,
          Degree_ID: formData.Degree_ID ? parseInt(formData.Degree_ID, 10) : "",
          Subject_ID: formData.Subject_ID
            ? parseInt(formData.Subject_ID, 10)
            : "",
          New_Degree_Name: formData.New_Degree_Name,
          New_Subject_Name: formData.New_Subject_Name,
          Added_By: user?.id || user?.S_ID,
        };

        await dispatch(createQuestion(payload)).unwrap();
        await dispatch(fetchDegreeSubject());

        if (onSuccess) {
          await onSuccess();
        } else {
          await dispatch(fetchQnA({ page: 1, limit: 10 }));
        }

        toast.success("Question posted successfully!");
        onClose();
      }
    } catch (err) {
      toast.error(err || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white";

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            {editing ? "Edit the Question" : "Ask a Question"}
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
              <SearchableDropdown
                options={degreeNames}
                value={selectedDegreeName}
                onChange={handleDegreeSelect}
                placeholder="Search degree..."
                text="All Degrees"
                icon={GraduationCap}
                className="w-full"
                allowCustom
                customTypeLabel="degree"
                onCustomSelect={handleCustomDegreeSelect}
              />
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Subject Topic <span className="text-red-500">*</span>
              </label>
              {formData.Degree_ID || formData.New_Degree_Name ? (
                <SearchableDropdown
                  options={subjectNames}
                  value={selectedSubjectName}
                  onChange={handleSubjectSelect}
                  placeholder="Search subject..."
                  text="All Subjects"
                  icon={BookOpen}
                  className="w-full"
                  allowCustom
                  customTypeLabel="subject"
                  onCustomSelect={handleCustomSubjectSelect}
                />
              ) : (
                <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-400 bg-slate-50 cursor-not-allowed">
                  Select Degree First
                </div>
              )}
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
              !(formData.Degree_ID || formData.New_Degree_Name) ||
              !(formData.Subject_ID || formData.New_Subject_Name)
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-900/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />{" "}
                {editing ? "Updating..." : "Posting..."}
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />{" "}
                {editing ? "Update Question" : "Post Question"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AskQuestionModal;
