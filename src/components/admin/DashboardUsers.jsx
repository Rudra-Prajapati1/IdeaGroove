import React, { useMemo } from "react";
import UserCard from "./Cards/AdminUserCard";

const DashboardUsers = ({ users, searchTerm, filterStatus, onModerate }) => {
  // Filter logic based on passed props
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        user.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterStatus]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-inter">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 font-poppins">Recent Users</h3>
        <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredUsers.length} Found
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 bg-gray-50/30">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onModerate={onModerate} // Pass trigger function down
            />
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
  );
};

export default DashboardUsers;