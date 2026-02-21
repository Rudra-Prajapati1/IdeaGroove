// import React, { useState } from "react";
// import { Shield, Calendar, Ban, CheckCircle, Hash, X } from "lucide-react";
// import StudentProfile from "../admin/StudentProfile";

// const UserCard = ({ user, onModerate }) => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const isActive = user.is_Active === 1;

//   return (
//     <>
//       <div
//         className={`group bg-white border-gray-100 border-2 ${
//           isActive ? "border-green-500" : "border-red-500"
//         } rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-lg  hover:border-gray-200`}
//       >
//         <div className="flex items-center gap-4">
//           <div
//             className={`h-12 w-12 rounded-full flex items-center justify-center border-2 font-bold text-lg uppercase
//             ${isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
//           >
//             {user.Name.charAt(0)}
//           </div>

//           <div className="flex flex-col">
//             <div className="flex items-center gap-2">
//               <h4
//                 className="font-bold text-gray-900 leading-tight group-hover:text-[#1B431C] cursor-pointer hover:underline"
//                 onClick={() => setIsProfileOpen(true)}
//               >
//                 {user?.Name.charAt(0).toUpperCase() + user?.Name.slice(1)}
//               </h4>
//               <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
//                 @{user.Username}
//               </span>
//             </div>
//             <p className="text-sm text-gray-500 mb-1">{user.Email}</p>

//             <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
//               <span className="flex items-center gap-1">
//                 <Hash size={12} className="text-blue-500" /> {user.Roll_No}
//               </span>
//               <span className="flex items-center gap-1">
//                 <Calendar size={12} className="text-orange-500" /> Year{" "}
//                 {user.Year}
//               </span>
//               <span className="flex items-center gap-1">
//                 <Shield size={12} className="text-emerald-500" /> S_ID:{" "}
//                 {user.S_ID}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-6">
//           {/* <span
//             className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}
//           >
//             <span
//               className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`}
//             />
//             {isActive ? "Active" : "Deleted/Inactive"}
//           </span> */}

//           <div className="flex flex-col gap-2 min-w-[130px]">
//             <button
//               onClick={() =>
//                 onModerate(isActive ? "block" : "unblock", user.S_ID)
//               }
//               className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border
//       ${
//         isActive
//           ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
//           : "bg-[#1B431C] text-white hover:bg-[#153416] border-[#1B431C]"
//       }`}
//             >
//               {isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
//               {isActive ? "Deactivate" : "Activate"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MODAL OVERLAY */}
//       {isProfileOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
//             {/* 2. Pass the data and the close function to the profile component */}
//             <StudentProfile
//               user={user}
//               onClose={() => setIsProfileOpen(false)}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserCard;
import React, { useState } from "react";
import { Shield, Calendar, Ban, CheckCircle, Hash, User } from "lucide-react";
import StudentProfile from "../admin/StudentProfile";

const formatYear = (year) => {
  const y = String(year);
  if (y.length === 4) {
    return `20${y.slice(0, 2)} – 20${y.slice(2)}`;
  }
  return y;
};

const UserCard = ({ user, onModerate }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isActive = user.is_Active === 1;
  const showAvatar = !user?.Profile_Pic || imgError;

  return (
    <>
      <div
        className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between
          transition-all duration-200 hover:shadow-md border border-gray-100 hover:border-gray-200"
      >
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-4">
          {/* Profile Pic / Avatar */}
          {showAvatar ? (
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg uppercase shrink-0
                ${isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-400"}`}
            >
              {user.Name.charAt(0)}
            </div>
          ) : (
            <img
              src={user.Profile_Pic}
              alt={user.Name}
              onError={() => setImgError(true)}
              className="h-12 w-12 rounded-xl object-cover shrink-0 border border-gray-100"
            />
          )}

          {/* Details */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h4
                className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-emerald-700 transition-colors"
                onClick={() => setIsProfileOpen(true)}
              >
                {user.Name.charAt(0).toUpperCase() + user.Name.slice(1)}
              </h4>
              <span className="text-[10px] text-gray-400 font-medium">
                @{user.Username}
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-1.5">{user.Email}</p>

            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                <Hash size={10} /> {user.Roll_No}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                <Calendar size={10} /> {formatYear(user.Year)}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Shield size={10} /> {user.S_ID}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium
              text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <User size={12} />
            View
          </button>

          <button
            onClick={() =>
              onModerate(isActive ? "block" : "unblock", user.S_ID)
            }
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors
              ${
                isActive
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
              }`}
          >
            {isActive ? <Ban size={12} /> : <CheckCircle size={12} />}
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsProfileOpen(false)
          }
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <StudentProfile
              id={user?.S_ID}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
