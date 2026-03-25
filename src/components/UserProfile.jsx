import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchStudents,
  selectAllStudents,
  selectStudentsStatus,
  selectStudentsPagination,
} from "../redux/slice/studentsSlice";
import PaginationControls from "./common/PaginationControls";
import { selectUser } from "../redux/slice/authSlice";
import GradientAvatar from "./common/GradientAvatar";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams(); // Added setSearchParams for pagination
  const students = useSelector(selectAllStudents);
  const status = useSelector(selectStudentsStatus);
  const pagination = useSelector(selectStudentsPagination);
  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.S_ID || currentUser?.id || null;

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const department = searchParams.get("department") || "All Departments";
    const page = searchParams.get("page") || 1;
    dispatch(fetchStudents({ q, department, page }));
  }, [dispatch, searchParams]);

  const getStatusColor = (status) => {
    if (status === "online") return "bg-green-500";
    if (status === "away") return "bg-amber-500";
    return "bg-slate-400";
  };

  if (status === "loading")
    return <div className="text-center py-20">Loading Creative Minds...</div>;
  if (status === "failed")
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load students
      </div>
    );

  if (students.length === 0)
    return (
      <div className="text-center py-20 text-slate-600">
        No students found matching your search.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-8 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-8">

        <h1 className="text-2xl font-bold text-slate-800">
          Discover Creative Minds
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">
          Showing {pagination.total} results
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {students.map((user) => {
          const isCurrentUser = String(user.S_ID) === String(currentUserId);

          return (
            <div
              key={user.S_ID}
              className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center">
                  <GradientAvatar
                    name={user.Name}
                    imageSrc={user.Profile_Pic}
                    alt={user.Name}
                    className="rounded-full"
                    textClassName="text-2xl capitalize"
                  />
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

              <Link
                to={isCurrentUser ? "/dashboard" : `/dashboard/${user.S_ID}`}
                className="w-full bg-[#1A3C20] hover:bg-[#2D4F33] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors shadow-lg"
              >
                <UserPlus size={16} />
                View Profile
              </Link>
            </div>
          );
        })}
      </div>

      <PaginationControls
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        className="mt-8"
        onPageChange={(page) => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set("page", String(page));
          setSearchParams(nextParams);
        }}
      />
    </div>
  );
};

export default UserProfile;
