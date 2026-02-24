import { AlertTriangle, X } from 'lucide-react';
import React from 'react';

export const ConfirmationBox = ({onClose,onConfirm,type}) => {
  return (
    <div>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
               onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#1A3C20] mb-2">
                Are you sure?
              </h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                This action is permanent and cannot be undone. 
                {type === "Account" &&
                 <span>All your progress
                and profile data will be deleted forever.</span>
                }
               
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={onConfirm}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                  Yes, Delete My {type}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}


