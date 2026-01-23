import React, { useMemo } from "react";
import AdminQnACard from "./Cards/AdminQnACard";

const AdminQnAGrid = ({ qnas, searchTerm, filterSubject, onModerate }) => {
  const filteredQnAs = useMemo(() => {
    return qnas.filter((qna) => {
      const matchesSearch = qna.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            qna.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === "all" || qna.subject === filterSubject;
      return matchesSearch && matchesSubject;
    });
  }, [qnas, searchTerm, filterSubject]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 font-poppins">Questions Asked</h3>
        <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredQnAs.length} Results
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4 bg-gray-50/20">
        {filteredQnAs.map((qna) => (
          <AdminQnACard key={qna.id} qna={qna} onModerate={onModerate} />
        ))}
      </div>
    </div>
  );
};

export default AdminQnAGrid;