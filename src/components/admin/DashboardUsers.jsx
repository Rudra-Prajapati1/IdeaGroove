import React, { useMemo } from "react";
import UserCard from "./Cards/AdminUserCard";

const DashboardUsers = ({
  users,
  searchTerm,
  filterDegree,
  filterYear,
  onModerate,
}) => {
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        !s ||
        user.name?.toLowerCase().includes(s) ||
        user.email?.toLowerCase().includes(s) ||
        user.username?.toLowerCase().includes(s) ||
        user.rollNo?.toLowerCase().includes(s);

      const matchesDegree =
        filterDegree === "all" || user.degree === filterDegree;
      const matchesYear =
        filterYear === "all" || user.year.toString() === filterYear;

      return matchesSearch && matchesDegree && matchesYear;
    });
  }, [users, searchTerm, filterDegree, filterYear]);
  return (
    <div className="bg-whitw rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-inter">
      <div className="p-6 border-b bg-primary border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white font-poppins">
          Recent Users
        </h3>
        <span className="text-[10px] font-black text-gray-400 bg-white px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredUsers.length} Found
        </span>
      </div>

      <div className="p-4 bg-gray-50/20">
        <div className="flex flex-col gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onModerate={onModerate} />
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-2">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
                No Users Match Your Search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;
