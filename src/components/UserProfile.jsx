import React from 'react';
import { UserPlus } from 'lucide-react';

const UserProfile = () => {
  // Mock data based on the provided image
  const users = [
    { id: 1, name: "Sarah Jenkins", role: "Product Design Senior", tags: ["FIGMA", "UX RESEARCH", "MOTION"], status: "online", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { id: 2, name: "Alex Chen", role: "Computer Science Junior", tags: ["REACT", "AI/ML", "PYTHON"], status: "away", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { id: 3, name: "Marcus Rivera", role: "Marketing Sophomore", tags: ["SEO", "ADS", "STRATEGY"], status: "online", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
    { id: 4, name: "Lina Park", role: "Mechanical Engineering", tags: ["CAD", "3D PRINT", "PHYSICS"], status: "offline", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lina" },
    { id: 5, name: "Jamie Walsh", role: "Fine Arts Senior", tags: ["OIL PAINT", "SCULPTURE", "GALLERY"], status: "online", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie" },
    { id: 6, name: "Omar Farooq", role: "Data Science Junior", tags: ["R STATS", "SQL", "D3.JS"], status: "online", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" },
    { id: 7, name: "Elise Thorne", role: "Journalism Sophomore", tags: ["COPYWRITING", "EDITING", "PODCASTING"], status: "away", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elise" },
    { id: 8, name: "Leo Da Silva", role: "Architecture Junior", tags: ["REVIT", "SKETCHUP", "DESIGN"], status: "online", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo" },
  ];

  // Helper to determine status dot color
  const getStatusColor = (status) => {
    if (status === 'online') return 'bg-green-500';
    if (status === 'away') return 'bg-amber-500';
    return 'bg-slate-400';
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-8 font-sans">
      {/* Header Row */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Discover Creative Minds</h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Showing 428 results</p>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1"
          >
            {/* Profile Image & Status Dot */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></span>
            </div>

            {/* Name & Role */}
            <h2 className="text-lg font-bold text-slate-800 mb-1">{user.name}</h2>
            <p className="text-xs font-bold text-[#2D4F33] mb-4 uppercase tracking-wide">{user.role}</p>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-6 min-h-[48px]">
              {user.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 bg-slate-50 text-[9px] font-black text-slate-400 border border-slate-100 rounded-md uppercase tracking-tighter"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Connect Button */}
            <button className="w-full bg-[#1A3C20] hover:bg-[#2D4F33] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors active:scale-95 shadow-lg shadow-emerald-900/10">
              <UserPlus size={16} />
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;