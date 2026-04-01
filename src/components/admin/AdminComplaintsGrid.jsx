import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  ExternalLink,
  FileText,
  Info,
  Image as ImageIcon,
  MessageSquareText,
  UserRound,
  X,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchAdminComplaints } from "../../redux/adminSlice/adminComplaintsSlice";
import StudentProfile from "./StudentProfile";

const AdminComplaintsGrid = ({
  complaints,
  searchTerm,
  filterType,
  filterStatus,
  onStatusRequest,
}) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedProfileStudentId, setSelectedProfileStudentId] =
    useState(null);
  const [questionAnswersByQuestionId, setQuestionAnswersByQuestionId] =
    useState({});
  const [loadingQuestionAnswers, setLoadingQuestionAnswers] = useState({});
  const [questionAnswersError, setQuestionAnswersError] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [loadingNoteActionId, setLoadingNoteActionId] = useState(null);
  const [refreshingPreviewIds, setRefreshingPreviewIds] = useState({});
  const [previewRefreshAttemptedIds, setPreviewRefreshAttemptedIds] = useState(
    {},
  );
  const itemsPerPage = 8;
  const normalizeType = (value) =>
    String(value || "")
      .trim()
      .replace(/[^a-z]/gi, "")
      .toLowerCase();

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        item.Complaint_ID.toString().includes(s) ||
        (item.Student_Name?.toLowerCase() ?? "").includes(s) ||
        (item.Complaint_Text?.toLowerCase() ?? "").includes(s) ||
        (item.Reported_Activity?.toLowerCase() ?? "").includes(s) ||
        (item.Content_Title?.toLowerCase() ?? "").includes(s) ||
        (item.Content_Owner_Name?.toLowerCase() ?? "").includes(s);

      const matchesType =
        filterType === "all" ||
        normalizeType(item.Type) === normalizeType(filterType);
      const matchesStatus =
        filterStatus === "all" || item.Status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [complaints, searchTerm, filterType, filterStatus]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const currentData = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const expandedComplaint = useMemo(
    () =>
      complaints.find((item) => item.Complaint_ID === expandedId) || null,
    [complaints, expandedId],
  );
  const expandedQuestionId =
    expandedComplaint && normalizeType(expandedComplaint.Type) === "question"
      ? expandedComplaint.Question_ID || expandedComplaint.Content_ID
      : null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "In-Progress":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Resolved":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getTypeStyle = (type) => {
    const normalizedType = normalizeType(type).toUpperCase();

    switch (normalizedType) {
      case "NOTES":
      case "NOTE":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "QUESTION":
      case "QNA":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ANSWER":
        return "bg-green-100 text-green-800 border-green-200";
      case "EVENTS":
      case "EVENT":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "USER":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "GROUPS":
      case "GROUP":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "OTHER":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatTypeLabel = (type) => {
    switch (normalizeType(type)) {
      case "question":
        return "Question";
      case "answer":
        return "Answer";
      case "notes":
      case "note":
        return "Notes";
      case "groups":
      case "group":
        return "Groups";
      case "event":
      case "events":
        return "Event";
      case "user":
        return "User";
      case "other":
        return "Other";
      default:
        return type || "Unknown";
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredComplaints]);

  useEffect(() => {
    if (!expandedComplaint) return;

    const complaintId = expandedComplaint.Complaint_ID;
    const normalizedType = normalizeType(expandedComplaint.Type);
    const needsPreviewRefresh =
      (normalizedType === "event" && !expandedComplaint.Event_Poster_URL) ||
      ((normalizedType === "notes" || normalizedType === "note") &&
        !expandedComplaint.Note_File_URL) ||
      (normalizedType === "answer" && !expandedComplaint.Question_Text) ||
      (normalizedType === "question" && !expandedComplaint.Question_ID) ||
      (normalizedType === "user" &&
        !expandedComplaint.Reported_User_ID &&
        !!expandedComplaint.Content_ID);

    if (!needsPreviewRefresh || previewRefreshAttemptedIds[complaintId]) {
      return;
    }

    setPreviewRefreshAttemptedIds((prev) => ({
      ...prev,
      [complaintId]: true,
    }));
    setRefreshingPreviewIds((prev) => ({
      ...prev,
      [complaintId]: true,
    }));

    dispatch(fetchAdminComplaints()).finally(() => {
      setRefreshingPreviewIds((prev) => ({
        ...prev,
        [complaintId]: false,
      }));
    });
  }, [dispatch, expandedComplaint, previewRefreshAttemptedIds]);

  useEffect(() => {
    if (!expandedQuestionId || questionAnswersByQuestionId[expandedQuestionId]) {
      return;
    }

    if (loadingQuestionAnswers[expandedQuestionId]) {
      return;
    }

    let isSubscribed = true;

    setLoadingQuestionAnswers((prev) => ({
      ...prev,
      [expandedQuestionId]: true,
    }));
    setQuestionAnswersError((prev) => ({
      ...prev,
      [expandedQuestionId]: "",
    }));

    api
      .get(`/qna/answers/${expandedQuestionId}`)
      .then(({ data }) => {
        if (!isSubscribed) return;

        setQuestionAnswersByQuestionId((prev) => ({
          ...prev,
          [expandedQuestionId]: Array.isArray(data?.answers) ? data.answers : [],
        }));
      })
      .catch(() => {
        if (!isSubscribed) return;

        setQuestionAnswersByQuestionId((prev) => ({
          ...prev,
          [expandedQuestionId]: [],
        }));
        setQuestionAnswersError((prev) => ({
          ...prev,
          [expandedQuestionId]: "Unable to load answers right now.",
        }));
      })
      .finally(() => {
        if (!isSubscribed) return;

        setLoadingQuestionAnswers((prev) => ({
          ...prev,
          [expandedQuestionId]: false,
        }));
      });

    return () => {
      isSubscribed = false;
    };
  }, [
    expandedQuestionId,
    loadingQuestionAnswers,
    questionAnswersByQuestionId,
  ]);

  const getReportedActivityText = (item) =>
    item.Reported_Activity || item.Content_Title || "IdeaGroove platform";

  const getOwnerDisplay = (item) =>
    item.Content_Owner_Name && item.Content_Owner_Name !== "N/A"
      ? `@${item.Content_Owner_Name}`
      : "N/A";

  const getPdfThumbnail = (fileUrl) => {
    if (!fileUrl) return null;

    return fileUrl
      .replace("/raw/upload/", "/image/upload/")
      .replace("/upload/", "/upload/pg_1,w_400,h_250,c_fill,f_jpg,q_auto/");
  };

  const openExternalUrl = (url) => {
    if (!url) {
      toast.error("Preview is not available right now.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNoteDownload = async (item) => {
    if (!item?.Content_ID) {
      toast.error("File is not available right now.");
      return;
    }

    try {
      setLoadingNoteActionId(item.Content_ID);
      const { data } = await api.get(`/notes/admin-download/${item.Content_ID}`);

      if (!data?.url) {
        throw new Error("Download URL missing");
      }

      const link = document.createElement("a");
      link.href = data.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("Unable to download the note right now.");
    } finally {
      setLoadingNoteActionId(null);
    }
  };

  const renderQuestionAnswers = (item) => {
    const questionId = item.Question_ID || item.Content_ID;
    const answers = questionId ? questionAnswersByQuestionId[questionId] || [] : [];
    const isLoading = questionId ? loadingQuestionAnswers[questionId] : false;
    const error = questionId ? questionAnswersError[questionId] : "";

    return (
      <div className="space-y-3">
        <div className="rounded-xl bg-white/80 px-3 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Question
          </p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">
            {item.Question_Text || item.Content_Title || "Question not available"}
          </p>
        </div>

        <div className="rounded-xl bg-white/80 px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Answers
            </p>
            {!isLoading && !error && (
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
              </span>
            )}
          </div>

          {isLoading ? (
            <p className="mt-1 text-sm text-gray-400">Loading answers...</p>
          ) : error ? (
            <p className="mt-1 text-sm text-rose-500">{error}</p>
          ) : answers.length > 0 ? (
            <div className="mt-2 space-y-2">
              {answers.map((answer) => (
                <div
                  key={answer.A_ID}
                  className="rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-3"
                >
                  <p className="text-sm leading-relaxed text-gray-700">
                    {answer.Answer}
                  </p>
                  {answer.Answer_Author && (
                    <p className="mt-2 text-[11px] font-semibold text-gray-400">
                      By @{answer.Answer_Author}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-400">
              No answers have been posted for this question yet.
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderReportedUser = (item) => {
    const reportedUserId = item.Reported_User_ID || item.Content_ID;
    const reportedUserName = item.Reported_User_Name || "Reported student";
    const reportedUserUsername =
      item.Reported_User_Username ||
      String(item.Content_Title || "")
        .replace(/^@/, "")
        .trim();

    if (!reportedUserId) {
      return (
        <div className="rounded-xl bg-white/80 px-3 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Reported User
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-700">
            {item.Content_Title || "User not available"}
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-xl bg-white/80 px-3 py-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Reported User
        </p>
        <button
          onClick={() => setSelectedProfileStudentId(reportedUserId)}
          title="View student profile"
          className="group/target mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-3 text-left transition-colors hover:border-[#1B431C]/20 hover:bg-emerald-50/60"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800 group-hover/target:text-[#1B431C]">
              {reportedUserName}
            </p>
            <p className="mt-1 text-xs font-medium text-gray-400">
              {reportedUserUsername
                ? `@${reportedUserUsername}`
                : item.Content_Title || "User"}
            </p>
          </div>
          <ExternalLink
            size={14}
            className="shrink-0 text-gray-300 transition-colors group-hover/target:text-[#1B431C]"
          />
        </button>
      </div>
    );
  };

  const renderReportedContent = (item) => {
    switch (normalizeType(item.Type)) {
      case "question":
        return renderQuestionAnswers(item);

      case "answer":
        return (
          <div className="space-y-3">
            <div className="rounded-xl bg-white/80 px-3 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Question
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                {item.Question_Text || "Question not available"}
              </p>
            </div>

            <div className="rounded-xl bg-white/80 px-3 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Reported Answer
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                {item.Content_Title || "Answer not available"}
              </p>
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/80 px-3 py-3 sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Note
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                {item.Note_Description || item.Content_Title || "Note not available"}
              </p>
            </div>

            {item.Note_File_Name && (
              <div className="rounded-xl bg-white/80 px-3 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  File
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-700 break-words">
                  {item.Note_File_Name}
                </p>
              </div>
            )}

            {item.Note_Subject_Name && (
              <div className="rounded-xl bg-white/80 px-3 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Subject
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {item.Note_Subject_Name}
                </p>
              </div>
            )}
          </div>
        );

      case "event":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/80 px-3 py-3 sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Event
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                {item.Content_Title || "Event not available"}
              </p>
            </div>

            {item.Event_Date && (
              <div className="rounded-xl bg-white/80 px-3 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Event Date
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {new Date(item.Event_Date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        );

      case "groups":
      case "group":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/80 px-3 py-3 sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Group
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-700">
                {item.Content_Title || "Group not available"}
              </p>
            </div>

            {item.Group_Description && (
              <div className="rounded-xl bg-white/80 px-3 py-3 sm:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Description
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {item.Group_Description}
                </p>
              </div>
            )}

            {item.Group_Based_On && (
              <div className="rounded-xl bg-white/80 px-3 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Based On
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {item.Group_Based_On}
                </p>
              </div>
            )}
          </div>
        );

      case "user":
        return renderReportedUser(item);

      default:
        return (
          <div className="rounded-xl bg-white/80 px-3 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Content
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              {item.Content_Title || getReportedActivityText(item)}
            </p>
          </div>
        );
    }
  };

  const renderContentPreview = (item) => {
    const normalizedType = normalizeType(item.Type);
    const isRefreshingPreview = Boolean(refreshingPreviewIds[item.Complaint_ID]);

    if (normalizedType === "event") {
      return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80">
          {item.Event_Poster_URL ? (
            <button
              onClick={() =>
                setPreviewImage({
                  src: item.Event_Poster_URL,
                  alt: item.Content_Title || "Event poster",
                })
              }
              className="relative block h-56 w-full overflow-hidden bg-slate-100 text-left"
            >
              <img
                src={item.Event_Poster_URL}
                alt={item.Content_Title || "Event poster"}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/5 to-transparent" />
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700">
                <Eye size={12} />
                View Poster
              </span>
              {item.Event_Date && (
                <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
                  {new Date(item.Event_Date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </button>
          ) : (
            <div className="flex h-56 flex-col items-center justify-center gap-3 bg-slate-100 px-6 text-center text-slate-400">
              <ImageIcon size={42} />
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {isRefreshingPreview
                    ? "Refreshing poster preview..."
                    : "Poster preview is not available."}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {isRefreshingPreview
                    ? "Fetching the latest complaint data."
                    : "The event details are still available on the right side."}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 p-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Poster Details
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-gray-700">
                {item.Content_Title || "Event poster not available"}
              </p>
            </div>

            <button
              onClick={() =>
                item.Event_Poster_URL
                  ? setPreviewImage({
                      src: item.Event_Poster_URL,
                      alt: item.Content_Title || "Event poster",
                    })
                  : null
              }
              disabled={!item.Event_Poster_URL}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Eye size={14} />
              {isRefreshingPreview ? "Refreshing..." : "Open Poster"}
            </button>
          </div>
        </div>
      );
    }

    if (normalizedType === "notes" || normalizedType === "note") {
      const thumbnailUrl = getPdfThumbnail(item.Note_File_URL);

      return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80">
          <div className="relative h-44 overflow-hidden bg-slate-100">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={item.Note_File_Name || "Note preview"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-400">
                <FileText size={42} />
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {isRefreshingPreview
                      ? "Refreshing file preview..."
                      : "Preview image is not available."}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.Note_File_URL
                      ? "You can still view or download the file below."
                      : isRefreshingPreview
                        ? "Fetching the latest complaint data."
                        : "The file can still be opened from the actions below if available."}
                  </p>
                </div>
              </div>
            )}
            <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700">
              Notes File
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                File
              </p>
              <p className="mt-1 text-sm font-semibold break-words text-gray-700">
                {item.Note_File_Name || "Note file not available"}
              </p>
              {item.Note_Description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {item.Note_Description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openExternalUrl(item.Note_File_URL)}
                disabled={!item.Note_File_URL}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Eye size={14} />
                {isRefreshingPreview && !item.Note_File_URL
                  ? "Refreshing..."
                  : "View File"}
              </button>
              <button
                onClick={() => handleNoteDownload(item)}
                disabled={!item.Note_File_URL || loadingNoteActionId === item.Content_ID}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1B431C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#153416] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={14} />
                {loadingNoteActionId === item.Content_ID
                  ? "Preparing..."
                  : "Download"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
        {renderReportedContent(item)}
      </div>
    );
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-inter">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-primary">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          Complaint Logs
        </h3>
        <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredComplaints.length} Records Found
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-400">
              <th className="px-8 py-5">Student Name</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Reported Activity</th>
              <th className="px-8 py-5">Date Filed</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.map((item) => (
              <React.Fragment key={item.Complaint_ID}>
                <tr
                  className={`hover:bg-gray-50/50 transition-all group ${
                    expandedId === item.Complaint_ID ? "bg-gray-50/80" : ""
                  }`}
                >
                  <td className="px-8 py-5 text-sm font-medium text-gray-700">
                    <button
                      onClick={() => setSelectedProfileStudentId(item.Student_ID)}
                      title="View student profile"
                      className="group/author flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#1B431C] transition-colors"
                    >
                      <span className="text-xs md:text-base">
                        <span className="font-bold text-gray-800 group-hover/author:text-[#1B431C] underline underline-offset-4 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
                          {item.Student_Name || "Unknown"}
                        </span>
                      </span>
                      <ExternalLink size={14} />
                    </button>
                  </td>
                  {/* TYPE COLUMN */}
                  <td className="px-8 py-5 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-[11px] font-bold uppercase border ${getTypeStyle(item.Type)}`}
                    >
                      {formatTypeLabel(item.Type)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-600">
                    <div
                      className={
                        expandedId === item.Complaint_ID
                          ? "max-w-[28rem]"
                          : "min-w-max"
                      }
                    >
                      <p
                        className={`font-semibold text-gray-700 ${
                          expandedId === item.Complaint_ID
                            ? "max-w-[28rem] whitespace-normal break-words"
                            : "truncate max-w-70"
                        }`}
                      >
                        {getReportedActivityText(item)}
                      </p>
                      {item.Content_Owner_Name &&
                        item.Content_Owner_Name !== "N/A" && (
                          <p className="mt-1 text-[11px] font-medium text-gray-400">
                            Owner: {getOwnerDisplay(item)}
                          </p>
                        )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-400">
                    {new Date(item.Date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span
                      className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase ${getStatusStyle(item.Status)}`}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onStatusRequest(item)}
                        title={
                          item.Status === "Pending"
                            ? "Review complaint status"
                            : "Update complaint status"
                        }
                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[#1B431C] text-white hover:bg-[#153416] transition-colors"
                      >
                        <ClipboardList size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(
                            expandedId === item.Complaint_ID
                              ? null
                              : item.Complaint_ID,
                          );
                        }}
                        className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-[#1B431C] hover:bg-emerald-50 transition-all"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            expandedId === item.Complaint_ID ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedId === item.Complaint_ID && (
                  <tr className="bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <td colSpan="6" className="px-8 py-4">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                              <MessageSquareText size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-800">
                                Student Complaint
                              </h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Complaint text submitted by student
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <p className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4 text-sm leading-relaxed text-gray-700">
                              "{item.Complaint_Text}"
                            </p>

                            <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-4">
                              <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                  <ImageIcon size={18} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-800">
                                    Content Preview
                                  </h4>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Rich preview for the reported item
                                  </p>
                                </div>
                              </div>

                              {renderContentPreview(item)}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                              <Info size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-800">
                                Reported Activity
                              </h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Actual content that received the complaint
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-4">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Activity
                              </p>
                              <p className="mt-1 text-sm font-semibold leading-relaxed text-gray-700 break-words">
                                {getReportedActivityText(item)}
                              </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl bg-white/80 px-3 py-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                  Type
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-700">
                                  {formatTypeLabel(item.Type)}
                                </p>
                              </div>
                              <div className="rounded-xl bg-white/80 px-3 py-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                  Owner
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                  <UserRound size={14} className="text-gray-400" />
                                  <span>{getOwnerDisplay(item)}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Reported Content
                              </p>
                              <div className="mt-2">
                                {renderReportedContent(item)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProfileStudentId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedProfileStudentId(null)
          }
        >
          <div className="relative bg-[#f8faf8] rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <StudentProfile
              id={selectedProfileStudentId}
              onClose={() => setSelectedProfileStudentId(null)}
            />
          </div>
        </div>
      )}
      {previewImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl bg-slate-950/95 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>

            <img
              src={previewImage.src}
              alt={previewImage.alt}
              className="max-h-[85vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {currentData.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Showing{" "}
            <span className="text-gray-600">
              {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredComplaints.length)}
            </span>{" "}
            of{" "}
            <span className="text-gray-600">{filteredComplaints.length}</span>{" "}
            Complaints
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="h-8 w-8 flex items-center justify-center text-gray-300 text-xs"
                >
                  ···
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold
              ${
                currentPage === page
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsGrid;
