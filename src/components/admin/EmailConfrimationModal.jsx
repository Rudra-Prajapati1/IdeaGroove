import React from "react";
import { X, Ban, CheckCircle, AlertCircle, Send, Eye } from "lucide-react";

const EmailConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  actionType, 
  targetType, 
  reason, 
  setReason, 
  loading,
  children // This allows us to inject the text or the dropdown
}) => {
  if (!isOpen) return null;

  const isBlock = actionType === "block";
  const isView = actionType === "view";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 border border-gray-100 font-inter">
        
        {/* Header: Dynamic Color */}
        <div className={`p-6 text-white flex justify-between items-center ${
          isView ? "bg-[#062D1C]" : isBlock ? "bg-red-600" : "bg-[#1B431C]"
        }`}>
          <div className="flex items-center gap-3">
            {isView ? <Eye className="w-6 h-6" /> : isBlock ? <Ban className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
            <h2 className="text-xl font-bold font-poppins capitalize">
              {actionType} {targetType}
            </h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Injecting the custom content (The Message or The Select) */}
          {children}

          {!isView && (
            <>
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-xs text-blue-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>An automated notice will be sent to the user regarding this change.</p>
              </div>

              <textarea
                rows="4"
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#1B431C]/40 text-sm resize-none"
                placeholder="Reason for update..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {isView ? "Close" : "Cancel"}
            </button>
            
            {!isView && (
              <button
                onClick={onSubmit}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                  isBlock ? "bg-red-600 shadow-red-100" : "bg-[#1B431C] shadow-green-100"
                } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? "Updating..." : <>Confirm <Send className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;