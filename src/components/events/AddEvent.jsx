import React, { useState } from "react";
import { X, Calendar, ImagePlus, Loader2, Info } from "lucide-react";
import { useSelector } from "react-redux";

const AddEventOverlay = ({ onClose, onUpload }) => {
  const { user } = useSelector((state) => state.auth); // Get User ID from auth slice

  const [formData, setFormData] = useState({
    Description: "",
    Event_Date: "",
    Poster_File: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, Poster_File: e.target.files[0] }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({
        ...prev,
        Poster_File: e.dataTransfer.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Poster_File || !formData.Event_Date) return;

    setLoading(true);

    const submissionData = new FormData();
    submissionData.append("Poster_File", formData.Poster_File);
    submissionData.append("Description", formData.Description);
    submissionData.append("Event_Date", formData.Event_Date);
    submissionData.append("Added_By", user?.id || 1); // ID from DB Schema
    submissionData.append("Added_On", new Date().toISOString());
    submissionData.append("Is_Active", 1);

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      onUpload ? onUpload(submissionData) : console.log("Uploaded:", formData);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-poppins">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Matching AddNotes Style */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Create New Event
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
            id="add-event-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Poster Upload Area */}
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
                  ${formData.Poster_File ? "bg-green-50 border-green-200" : ""}
                `}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  required
                />

                {formData.Poster_File ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={URL.createObjectURL(formData.Poster_File)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-md mb-2"
                    />
                    <p className="text-sm font-semibold text-green-700 line-clamp-1">
                      {formData.Poster_File.name}
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
                      PNG, JPG or WEBP (Max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Event Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="Description"
                rows={4}
                required
                placeholder="Details about the event (venue, time, etc.)..."
                value={formData.Description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm resize-none"
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Date of the Event <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="Event_Date"
                  required
                  value={formData.Event_Date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white"
                />
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
            form="add-event-form"
            disabled={loading || !formData.Poster_File || !formData.Event_Date}
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-900/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
              </>
            ) : (
              "Publish Event"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventOverlay;
