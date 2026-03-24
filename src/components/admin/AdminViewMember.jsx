import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ExternalLink,
  Info,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import StudentProfile from "./StudentProfile";

const AdminViewMembers = ({ group, setIsModalOpen }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const roomId = group?.id ?? group?.Room_ID;
  const groupName = group?.Name ?? group?.Room_Name ?? "Study Group";
  const groupCategory = group?.Based_On ?? group?.Hobby_Name ?? "General";
  useEffect(() => {
    if (!roomId) {
      setMembers([]);
      setError("Missing group details");
      return undefined;
    }

    const controller = new AbortController();

    const fetchViewMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const reponse = await fetch(
          `${baseUrl}/groups/viewMembers/${roomId}`,
          { signal: controller.signal },
        );

        if (!reponse.ok) {
          throw new Error("Failed to fetch View Members");
        }

        const data = await reponse.json();
        setMembers(Array.isArray(data.membersDetails) ? data.membersDetails : []);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchViewMembers();
    return () => controller.abort();
  }, [baseUrl, roomId]);

  // Filter members based on search
  const filteredMembers = members.filter((m) =>
    String(m.name || m.Name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[84vh] flex flex-col font-inter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0f3d1e] via-[#1B431C] to-emerald-700 px-8 py-8 text-white">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          >
            <X size={18} />
          </button>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-24 w-40 bg-gradient-to-r from-emerald-300/20 to-transparent blur-2xl" />

          <div className="relative flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/80">
                    Group Members
                  </span>
                  <span className="rounded-full bg-emerald-200/20 px-3 py-1 text-[11px] font-semibold text-emerald-50">
                    {members.length || group.Member_Count || 0} active members
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight font-poppins">
                  {groupName}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-50/85">
                  Open any member profile directly from here without searching
                  through the admin cards.
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/85">
              {groupCategory}
            </span>
          </div>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#f7faf7]">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-gray-900 font-bold mb-3">
              <Info className="w-4 h-4 text-primary" />
              <h4>About this group</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">
              {group.Description || "No description provided for this group."}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-900 font-bold">Group Members</h4>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                List
              </span>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-14 rounded-2xl bg-gray-50 animate-pulse"
                  />
                ))
              ) : error ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : filteredMembers.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  No members found.
                </p>
              ) : (
                filteredMembers.map((member, index) => {
                  const isAdmin = String(member.role || "").toLowerCase() === "admin";
                  const displayName =
                    member.name || member.username || member.Name || "Unknown";
                  const memberId = member.S_ID || member.Student_ID || index;

                  return (
                    <div
                      key={memberId}
                      className="flex items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white px-4 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm overflow-hidden border border-emerald-100">
                          {member.Profile_Pic ? (
                            <img
                              src={member.Profile_Pic}
                              alt={displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={`https://i.pravatar.cc/150?u=${memberId}`}
                              alt={displayName}
                            />
                          )}
                        </div>
                        <div>
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <p className="font-bold text-gray-900 text-sm">
                              {displayName}
                            </p>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                                isAdmin
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {isAdmin ? "Admin" : "Member"}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-gray-400">
                            {member.username
                              ? `@${member.username}`
                              : "Student profile available"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          {isAdmin ? "Leads the group" : "Community member"}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedStudentId(memberId)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-[#1B431C] transition-colors hover:bg-[#1B431C] hover:text-white"
                        >
                          View Profile
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="flex-1 py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      {selectedStudentId && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedStudentId(null)
          }
        >
          <div className="relative bg-[#f8faf8] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
            <StudentProfile
              id={selectedStudentId}
              onClose={() => setSelectedStudentId(null)}
            />
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
};

export default AdminViewMembers;
