import React, { useState } from "react";
import { X, Users, MessageSquare, Loader2, Info, Hash } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// This would typically come from a separate 'hobbies' slice or API
const HOBBY_OPTIONS = [
  { id: 1, name: "Photography" },
  { id: 2, name: "Coding" },
  { id: 3, name: "Gaming" },
  { id: 4, name: "Music" },
  { id: 5, name: "Sports" },
];

const AddGroupOverlay = ({ onClose, initialData }) => {
  const { user } = useSelector((state) => state.auth); // Get current student ID
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState({
    Room_Name: "",
    Based_on: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Room_Name" && value.length > 150) {
      toast.error("Group name cannot exceed 150 characters");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Room_Name.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (!formData.Based_on) {
      toast.error("Please select an interest");
      return;
    }

    setLoading(true);

    const submissionData = {
      Room_Type: "group",
      Room_Name: formData.Room_Name.trim(),
      Based_on: parseInt(formData.Based_on),
      Created_By: user?.id || 1,
      Is_Active: 1,
      ...(isEditMode && { G_ID: initialData.G_ID }),
    };

    setTimeout(() => {
      setLoading(false);
      toast.success(
        isEditMode
          ? "Group updated successfully"
          : "Group created successfully",
      );
      onUpload?.(submissionData);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-poppins">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky Style */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            {isEditMode ? "Edit Group Details" : "Create New Group"}
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
            id="add-group-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Group Name Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Room_Name"
                maxLength={150} // Constrained by schema
                required
                placeholder="e.g., Coding Enthusiasts"
                value={formData.Room_Name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white"
              />
              <div className="mt-1 text-xs text-right">
                <span
                  className={
                    formData.Room_Name.length >= 140
                      ? "text-red-500 font-medium"
                      : "text-slate-400"
                  }
                >
                  {formData.Room_Name.length} / 150
                </span>
              </div>
            </div>

            {/* Hobby/Based_on Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Interest Basis <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="Based_on"
                  required
                  value={formData.Based_on}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white appearance-none cursor-pointer"
                >
                  <option value="">Select a Hobby</option>
                  {HOBBY_OPTIONS.map((hobby) => (
                    <option key={hobby.id} value={hobby.id}>
                      {hobby.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-4 h-4" />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Sticky with Actions */}
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
            form="add-group-form"
            disabled={loading || !formData.Room_Name || !formData.Based_on}
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-900/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                {isEditMode ? "Save Changes" : "Create Group"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroupOverlay;
