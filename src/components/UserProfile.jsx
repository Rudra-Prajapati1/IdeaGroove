import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/students/all");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getStatusColor = (status) => {
    if (status === "online") return "bg-green-500";
    if (status === "away") return "bg-amber-500";
    return "bg-slate-400";
  };

  if (loading)
    return <div className="text-center py-20">Loading Creative Minds...</div>;

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-8 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Discover Creative Minds
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">
          Showing {users.length} results
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.S_ID}
            className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center">
                {user.Profile_Pic ? (
                  <img
                    src={user.Profile_Pic}
                    alt={user.Name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary capitalize">
                    {user.Name[0]}
                  </span>
                )}
              </div>
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status || "offline")}`}
              ></span>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-1 capitalize">
              {user.Name}
            </h2>
            <p className="text-xs font-bold text-[#2D4F33] mb-4 uppercase tracking-wide">
              {user.Degree_Name}
            </p>

            {/* Link to the Dynamic Profile Dashboard */}
            <Link
              to={`/dashboard/${user.S_ID}`}
              className="w-full bg-[#1A3C20] hover:bg-[#2D4F33] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors shadow-lg"
            >
              <UserPlus size={16} />
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
