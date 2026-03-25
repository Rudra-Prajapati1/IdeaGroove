import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Calendar,
  FileText,
  Loader2,
  MessageSquare,
  Users,
  X,
} from "lucide-react";
import AdminViewMembers from "./AdminViewMember";

const formatDisplayDate = (value, fallback = "Recently") => {
  if (!value) return fallback;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getMetaLabel = (item) => {
  const normalizedRole = item.course?.toLowerCase();

  if (normalizedRole === "admin" || normalizedRole === "creator") {
    return "Role";
  }

  if (normalizedRole === "member") {
    return "Role";
  }

  return "Course";
};

const StudentProfile = ({ id, onClose }) => {
  const [filter, setFilter] = useState("none");
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef({});
  const containerRef = useRef(null);

  const hobbiesList = useMemo(() => {
    if (!Array.isArray(profile?.hobbies)) return [];
    return profile.hobbies
      .map((hobby) => hobby?.Hobby_Name)
      .filter(Boolean);
  }, [profile?.hobbies]);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setProfileError("");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/students/profile/${id}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error("Failed to load student profile");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Profile refresh error:", err);
        setProfile(null);
        setProfileError(err.message || "Failed to load student profile");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProfile(false);
        }
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (filter === "none" || !id) return;

    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/students/${id}/activities?type=${filter}`,
        );
        const data = await res.json();
        const nextActivities = Array.isArray(data)
          ? data
              .filter(
                (item) =>
                  item?.Is_Active !== 0 &&
                  item?.is_Active !== 0 &&
                  item?.status !== 0 &&
                  item?.status !== "blocked",
              )
              .map((item) => ({
                ...item,
                answers: Array.isArray(item.answers)
                  ? item.answers.filter(
                      (answer) =>
                        answer?.Is_Active !== 0 && answer?.is_Active !== 0,
                    )
                  : item.answers,
              }))
          : [];
        setActivities(nextActivities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [filter, id]);

  useEffect(() => {
    const activeTab = tabRefs.current[filter];
    if (activeTab && containerRef.current) {
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const tabRect = activeTab.getBoundingClientRect();
      setIndicatorStyle({
        width: tabRect.width,
        transform: `translateX(${tabRect.left - containerLeft}px)`,
      });
    }
  }, [filter]);

  const notes = profile?.notes_count ?? 0;
  const questions = profile?.questions_count ?? 0;
  const events = profile?.events_count ?? 0;
  const groups = profile?.groups_count ?? 0;
  const complaints = profile?.complaints_count ?? 0;

  const totalCount = notes + questions + events + groups + complaints;

  const notesPercent = totalCount ? (notes / totalCount) * 100 : 0;
  const questionsPercent = totalCount ? (questions / totalCount) * 100 : 0;
  const eventsPercent = totalCount ? (events / totalCount) * 100 : 0;
  const groupsPercent = totalCount ? (groups / totalCount) * 100 : 0;
  const complaintsPercent = totalCount ? (complaints / totalCount) * 100 : 0;

  return (
    <div className="bg-[#f8faf8] w-full font-sans">
      {/* Top Green Header */}
      <div className="bg-[#f8faf8] text-[#0f3d1e] p-5 flex justify-between items-center sticky top-0 z-30 border-b border-emerald-100/60">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Student Report</h1>
        </div>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-10 py-5 max-w-4xl mx-auto">
        {loadingProfile ? (
          <div className="space-y-8 animate-pulse">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="h-10 w-56 rounded-2xl bg-emerald-100/70" />
                <div className="h-4 w-28 rounded-full bg-gray-200" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-[#0f3d1e] shadow-sm">
                <Loader2 size={16} className="animate-spin" />
                Opening profile...
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-gray-100 bg-white px-5 py-6 shadow-sm"
                >
                  <div className="mb-3 h-3 w-20 rounded-full bg-gray-200" />
                  <div className="h-5 w-32 rounded-xl bg-emerald-50" />
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 h-3 w-36 rounded-full bg-gray-200" />
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="h-44 w-44 rounded-full bg-emerald-50" />
                <div className="grid flex-1 grid-cols-2 gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-3 w-20 rounded-full bg-gray-200" />
                      <div className="h-7 w-28 rounded-xl bg-gray-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-dashed border-emerald-200 bg-white/80 px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                Loading activity insights and contribution history...
              </p>
            </div>
          </div>
        ) : profileError ? (
          <div className="rounded-[28px] border border-red-100 bg-white px-8 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-xl font-black text-gray-800">
              Unable to open this profile
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500">
              {profileError}
            </p>
          </div>
        ) : (
          <>
        {/* Main Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-[#0f3d1e] tracking-tight mb-1">
              {profile?.Name
                ? profile.Name.charAt(0).toUpperCase() + profile.Name.slice(1)
                : ""}
            </h2>
            <p className="text-gray-500 font-semibold text-sm">
              @{profile?.Username}
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mb-12">
          <h3 className="text-xs font-black text-gray-800 mb-2 uppercase tracking-widest">
            Profile Information
          </h3>
          <hr className="border-emerald-50 mb-8" />

          <div className="grid grid-cols-2 gap-y-10">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                College
              </p>
              <p className="text-sm font-bold text-gray-800">
                {profile?.College_Name}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Roll No
              </p>
              <p className="text-sm font-bold text-gray-800">
                {profile?.Roll_No}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Email Address
              </p>
              <p className="text-sm font-bold text-gray-800">
                {profile?.Email}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Hobbies
              </p>
              {hobbiesList.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {hobbiesList.map((hobby) => (
                    <span
                      key={hobby}
                      className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-[#0f3d1e]"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-800">
                  No hobbies listed
                </p>
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Status
              </p>
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${profile?.is_Active === 1 ? "bg-emerald-400" : "bg-red-400 shadow-sm"}`}
                ></span>
                <p className="text-sm font-bold text-gray-800">
                  {profile?.is_Active === 1 ? "Active Member" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Analysis Section */}
        <div className="bg-gray-50/70 rounded-3xl border border-gray-100 p-8 mb-10">
          <h3 className="text-[#0f3d1e] font-black text-sm uppercase tracking-wider mb-8">
            Engagement Analysis
          </h3>

          <div className="flex flex-col lg:flex-row items-center justify-around gap-12">
            {/* CALCULATED DONUT CHART */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg
                className="w-full h-full -rotate-90 scale-110"
                viewBox="0 0 36 36"
              >
                {/* Background Ring */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-gray-100"
                  strokeWidth="4"
                ></circle>

                {/* 1. Notes Shared (40%) - Starts at 0, Length 40 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#0f3d1e]"
                  strokeWidth="4"
                  strokeDasharray={`${notesPercent} 100`}
                  strokeDashoffset="0"
                ></circle>

                {/* 2. Q&A Responses (25%) - Starts at 40, Length 25 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#4caf50]"
                  strokeWidth="4"
                  strokeDasharray={`${questionsPercent} 100`}
                  strokeDashoffset={`-${notesPercent}`}
                ></circle>

                {/* 3. Events (20%) - Starts at 65 (40+25), Length 20 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#1b5e20]"
                  strokeWidth="4"
                  strokeDasharray={`${eventsPercent} 100`}
                  strokeDashoffset={`-${notesPercent + questionsPercent}`}
                ></circle>

                {/* 4. Groups (10%) - Starts at 85 (40+25+20), Length 10 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#81c784]"
                  strokeWidth="4"
                  strokeDasharray={`${groupsPercent} 100`}
                  strokeDashoffset={`-${notesPercent + questionsPercent + eventsPercent}`}
                ></circle>

                {/* 5. Complaints (5%) - Starts at 95 (40+25+20+10), Length 5 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#c8e6c9]"
                  strokeWidth="4"
                  strokeDasharray={`${complaintsPercent} 100`}
                  strokeDashoffset={`-${notesPercent + questionsPercent + eventsPercent + groupsPercent}`}
                ></circle>
              </svg>

              <div className="absolute text-center">
                <span className="block text-4xl font-black text-[#0f3d1e] leading-none">
                  {totalCount}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">
                  Activities
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <StatItem
                label="Notes Shared"
                value={profile?.notes_count || 0}
                percent={
                  profile?.notes_count / totalCount > 0
                    ? `${((profile.notes_count / totalCount) * 100).toFixed(1)}%`
                    : "0%"
                }
                color="bg-[#0f3d1e]"
                onClick={() => setFilter("Notes")}
              />
              <StatItem
                label="Q&A Responses"
                value={profile?.questions_count || 0}
                percent={
                  profile?.questions_count / totalCount > 0
                    ? `${((profile.questions_count / totalCount) * 100).toFixed(1)}%`
                    : "0%"
                }
                color="bg-[#4caf50]"
                onClick={() => setFilter("QnA")}
              />
              <StatItem
                label="Events"
                value={profile?.events_count || 0}
                percent={
                  profile?.events_count / totalCount > 0
                    ? `${((profile.events_count / totalCount) * 100).toFixed(1)}%`
                    : "0%"
                }
                color="bg-[#1b5e20]"
                onClick={() => setFilter("Events")}
              />
              <StatItem
                label="Groups"
                value={profile?.groups_count || 0}
                percent={
                  profile?.groups_count / totalCount > 0
                    ? `${((profile.groups_count / totalCount) * 100).toFixed(1)}%`
                    : "0%"
                }
                color="bg-[#81c784]"
                onClick={() => setFilter("Groups")}
              />
              <StatItem
                label="Complaints"
                value={profile?.complaints_count || 0}
                percent={
                  profile?.complaints_count / totalCount > 0
                    ? `${((profile.complaints_count / totalCount) * 100).toFixed(1)}%`
                    : "0%"
                }
                color="bg-[#c8e6c9]"
                onClick={() => setFilter("Complaints")}
              />
            </div>
          </div>
        </div>

        <div className="sticky top-[72px] z-20 pt-2 pb-4 bg-[#f8faf8]">
          <div
            ref={containerRef}
            className="relative flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit shadow-sm"
          >
          {/* Sliding indicator */}
            <div
              className="absolute top-1 bottom-1 left-0 bg-[#1B431C] rounded-lg shadow-sm transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />

            {["Notes", "QnA", "Events", "Groups", "Complaints"].map(
              (category) => (
                <button
                  key={category}
                  ref={(el) => (tabRefs.current[category] = el)}
                  onClick={() => setFilter(category)}
                  className={`relative z-10 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors duration-300
            ${filter === category ? "text-white" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {category}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Dynamic Activity List */}
        {filter !== "none" ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-100">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-widest">
                Recent{" "}
                <span className="text-[#0f3d1e] underline decoration-emerald-200 underline-offset-4">
                  {filter}
                </span>{" "}
                Activities
              </h3>
              <button
                onClick={() => setFilter("none")}
                className="px-4 py-1.5 rounded-full
             text-[11px] font-semibold uppercase tracking-wider
             bg-red-100/70 backdrop-blur
             text-red-600 border border-red-200
             hover:bg-red-500 hover:text-white
             transition-all duration-300 shadow-sm"
              >
                Clear Filter
              </button>
            </div>

            <div className="space-y-6">
              {loadingActivities ? (
                <p className="text-center text-gray-400 py-4">Loading...</p>
              ) : activities.length > 0 ? (
                activities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 pb-6 border-b border-gray-50 last:border-0 group/item"
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-emerald-50 p-3 rounded-2xl group-hover/item:bg-[#0f3d1e] transition-colors">
                        <FileText
                          size={20}
                          className="text-[#0f3d1e] group-hover/item:text-white"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-base leading-tight group-hover/item:text-[#0f3d1e] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                          {item.type && (
                            <>
                              {item.course?.toLowerCase() === "creator" ||
                              item.course?.toLowerCase() === "member" ||
                              item.course?.toLowerCase() === "admin"
                                ? "Hobby"
                                : "Category"}
                              :{" "}
                              <span className="text-gray-600">{item.type}</span>
                            </>
                          )}
                          {item.type && item.course && " • "}
                          {item.course && (
                            <>
                              {getMetaLabel(item)}
                              :{" "}
                              <span className="uppercase text-gray-600 font-bold">
                                {item.course}
                              </span>
                            </>
                          )}
                        </p>

                        {filter === "QnA" && Array.isArray(item.answers) && (
                          <div className="mt-3 space-y-2">
                            {item.answers.length > 0 ? (
                              item.answers.map((answer) => (
                                <div
                                  key={answer.id}
                                  className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3"
                                >
                                  <div className="flex items-start gap-2 text-[#0f3d1e]">
                                    <MessageSquare size={14} className="mt-0.5" />
                                    <div>
                                      <p className="text-sm font-semibold text-gray-800">
                                        {answer.answer}
                                      </p>
                                      <p className="text-[11px] mt-1 text-gray-500 font-medium">
                                        Answered by{" "}
                                        <span className="font-bold text-[#0f3d1e]">
                                          {answer.answeredBy ||
                                            answer.answeredByUsername ||
                                            "Unknown"}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-400 italic">
                                No answers available for this question.
                              </p>
                            )}
                          </div>
                        )}

                        {filter === "Events" && item.eventDate && (
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                              <Calendar size={13} />
                              Event Date: {formatDisplayDate(item.eventDate)}
                            </div>
                            <span className="text-xs font-medium text-gray-400">
                              Added on {formatDisplayDate(item.date)}
                            </span>
                          </div>
                        )}

                        {filter === "Groups" && (
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#0f3d1e]">
                              <Users size={13} />
                              {item.memberCount || 0} Members
                            </span>
                            <button
                              onClick={() =>
                                setSelectedGroup({
                                  id: item.roomId,
                                  Name: item.title,
                                  Based_On: item.type,
                                  Description: item.description,
                                  Member_Count: item.memberCount,
                                })
                              }
                              className="rounded-full border border-[#1B431C] px-3 py-1 text-xs font-semibold text-[#1B431C] hover:bg-[#1B431C] hover:text-white transition-colors"
                            >
                              View Members
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {filter !== "Events" && (
                      <span className="text-[10px] font-black text-gray-300 uppercase group-hover/item:text-gray-500 shrink-0 pt-1">
                        {formatDisplayDate(item.date)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 italic py-4">
                  No recent activities found for this category.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-300 text-sm font-bold italic tracking-wide">
              Select a category above to visualize detailed engagement metrics.
            </p>
          </div>
        )}
          </>
        )}
      </div>

      {selectedGroup && (
        <AdminViewMembers
          group={selectedGroup}
          setIsModalOpen={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};

// Reusable Stat Component
const StatItem = ({ label, value, percent, color, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer group select-none flex flex-col items-center lg:items-start"
  >
    <div className="flex items-center gap-3 mb-2">
      <span
        className={`w-3 h-3 rounded-full ${color} shadow-sm group-hover:scale-125 transition-transform`}
      ></span>
      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#0f3d1e] transition-colors">
        {label}
      </span>
    </div>
    <p className="text-2xl font-black text-gray-800 group-hover:translate-x-1 transition-transform">
      {value}{" "}
      <span className="text-sm font-medium text-gray-300 ml-1">
        ({percent})
      </span>
    </p>
  </div>
);

export default StudentProfile;
