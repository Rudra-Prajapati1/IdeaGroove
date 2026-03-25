import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  ChevronRight,
  Search,
  X,
  Lightbulb,
  CheckCircle2,
  Lock,
  ExternalLink,
  Mail,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchUserComplaints,
  createComplaint,
  fetchContentOptions,
  fetchAnswersByQuestion,
  deleteComplaintThunk,
} from "../redux/slice/complaintsSlice.js";
import PageHeader from "../components/common/PageHeader";
import { ConfirmationBox } from "../components/common/ConfirmationBox";

/* ================= SEARCHABLE DROPDOWN ================= */
const SearchableDropdown = ({
  label,
  icon,
  value,
  placeholder,
  items,
  onSelect,
  disabled = false,
  emptyMessage = "No results found",
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const displayValue = open ? search : value ? value.split("|")[0] : "";

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = items.filter((item) =>
    item.label?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={disabled ? "opacity-60" : ""}>
      <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-[#3a6b42]">
        {label}
      </label>
      <div ref={ref} className="relative">
        <div
          className={`flex items-center gap-3 bg-[#f4fbf5] border-2 border-[#c8e6c9] rounded-2xl px-5 py-3 transition-all ${disabled ? "cursor-not-allowed pointer-events-none" : "cursor-pointer hover:border-[#1A3C20]"}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-[#4caf50]">{icon}</span>
          <span
            className={`flex-1 text-sm ${value ? "text-[#1A3C20] font-medium" : "text-gray-400"}`}
          >
            {value ? value.split("|")[0] : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-[#4caf50] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
        {open && (
          <div className="absolute z-50 mt-2 w-full bg-white border-2 border-[#c8e6c9] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8f5e9] bg-gray-50/50">
              <Search size={14} className="text-[#4caf50]" />
              <input
                autoFocus
                value={displayValue}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search...`}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-400 text-center">
                  {emptyMessage}
                </li>
              ) : (
                filtered.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="px-5 py-3 cursor-pointer border-b border-gray-50 last:border-0 hover:bg-[#f0f9f1]"
                  >
                    <div className="text-sm font-bold text-gray-800">
                      {item.label.split("|")[0]}
                    </div>
                    {item.label.split("|")[1] && (
                      <div className="text-[10px] text-[#4caf50] font-bold mt-1 uppercase tracking-wider">
                        By: {item.label.split("|")[1]}
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const SubmitComplaint = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { complaints, contentOptions, answersOptions } = useSelector(
    (state) => state.complaints,
  );
  const { type, id, text } = useParams();

  const isLockedComplaint = Boolean(type && id && text);

  const complaintCategories = ["Events", "Notes", "Groups", "QnA", "User", "Other"];

  const typeMapping = {
    event: "Event",
    notes: "Notes",
    groups: "Groups",
    question: "Question",
    answer: "Answer",
    user: "User",
    other: "Other",
  };

  const [formData, setFormData] = useState({
    category: "",
    topic: "",
    answerId: "",
    description: "",
  });

  const [expandedId, setExpandedId] = useState(null);
  const [filterConfig, setFilterConfig] = useState("ALL");
  const [complaintToDelete, setComplaintToDelete] = useState(null);

  useEffect(() => {
    if (user?.id) dispatch(fetchUserComplaints({ userId: user.id }));
  }, [dispatch, user]);

  useEffect(() => {
    if (formData.category && formData.category !== "Other" && !id) {
      dispatch(fetchContentOptions(formData.category));
    }
  }, [formData.category, dispatch, id]);

  useEffect(() => {
    if (formData.category === "QnA" && formData.topic) {
      dispatch(fetchAnswersByQuestion(formData.topic));
    }
  }, [formData.topic, formData.category, dispatch]);

  const processedComplaints = useMemo(() => {
    if (!complaints) return [];
    let result = [...complaints];
    if (filterConfig !== "ALL") {
      result = result.filter(
        (item) =>
          item.Status?.toUpperCase().replace(/[-\s]/g, "") ===
          filterConfig.toUpperCase().replace(/[-\s]/g, ""),
      );
    }
    return result.sort((a, b) => new Date(b.Date) - new Date(a.Date));
  }, [complaints, filterConfig]);

  const handleDeleteComplaint = async () => {
    if (!complaintToDelete) return;
    try {
      await dispatch(deleteComplaintThunk(complaintToDelete)).unwrap();
      toast.success("Complaint deleted");
    } catch (err) {
      toast.error(err);
    } finally {
      setComplaintToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return toast.error("You must be logged in");

    let finalContentId = id || formData.topic;
    let finalType;

    if (type) {
      finalType = type;
    } else {
      switch (formData.category) {
        case "Events":
          finalType = "event";
          break;
        case "Notes":
          finalType = "notes";
          break;
        case "Groups":
          finalType = "groups";
          break;
        case "User":
          finalType = "user";
          break;
        case "QnA":
          finalType = "question"; // default unless answer selected
          break;
        case "Other":
          finalType = "other";
          break;
        default:
          finalType = "";
      }
    }

    if (formData.category === "Other") {
      finalContentId = 0;
      finalType = "other";
    } else if (formData.category === "QnA") {
      if (formData.answerId) {
        finalContentId = formData.answerId;
        finalType = "answer";
      } else {
        finalContentId = formData.topic;
        finalType = "question";
      }
    }

    if (
      !formData.description.trim() ||
      (formData.category !== "Other" && !finalContentId)
    ) {
      return toast.error("Please fill all required fields");
    }

    console.log(finalType);

    try {
      await dispatch(
        createComplaint({
          Student_ID: user.id,
          Type: finalType,
          Content_ID: finalContentId,
          Complaint_Text: formData.description,
        }),
      ).unwrap();
      toast.success("Submitted Successfully");
      dispatch(fetchUserComplaints({ userId: user.id }));
      setFormData({ category: "", topic: "", answerId: "", description: "" });
      setExpandedId(null);
      if (isLockedComplaint) {
        navigate("/submit-complaint", { replace: true });
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      {complaintToDelete && (
        <ConfirmationBox
          type="Complaint"
          onClose={() => setComplaintToDelete(null)}
          onConfirm={handleDeleteComplaint}
        />
      )}

      <PageHeader title="Submit Complaint" />
      <main className="max-w-6xl mx-auto py-12 px-8 grid grid-cols-12 gap-8 relative z-30">
        <div className="col-span-8 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-800">
            Submit a New Issue
          </h3>

          {/* ================= LOCKED MODE ================= */}
          {isLockedComplaint ? (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-start gap-3">
              <Lock className="text-orange-600 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-gray-800 text-sm italic tracking-tight">
                  Reporting {typeMapping[type] || "Content"} : "{decodeURIComponent(text)}"
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  This content is locked for current complaint.
                </p>
              </div>
            </div>
          ) : (
            <>
              <SearchableDropdown
                label="Category"
                icon={<HelpCircle size={16} />}
                value={formData.category}
                placeholder="Select a category"
                items={complaintCategories.map((val) => ({
                  id: val,
                  label: val,
                }))}
                onSelect={(item) =>
                  setFormData({
                    ...formData,
                    category: item.id,
                    topic: "",
                    answerId: "",
                  })
                }
              />

              {formData.category && formData.category !== "Other" && (
                <SearchableDropdown
                  label={
                    formData.category === "QnA"
                      ? "Select Question"
                      : "Specific Issue"
                  }
                  icon={<Info size={16} />}
                  value={
                    contentOptions.find((c) => c.id === formData.topic)
                      ?.label || ""
                  }
                  placeholder={
                    formData.category === "QnA"
                      ? "Which question has an issue?"
                      : "Select specific issue"
                  }
                  items={contentOptions}
                  onSelect={(item) =>
                    setFormData({
                      ...formData,
                      topic: item.id,
                      answerId: "",
                    })
                  }
                />
              )}

              {formData.category === "QnA" && (
                <SearchableDropdown
                  label="Select Answer"
                  icon={<MessageSquare size={16} />}
                  value={
                    answersOptions.find((a) => a.id === formData.answerId)
                      ?.label || ""
                  }
                  placeholder="Select the specific answer (Optional)"
                  items={answersOptions}
                  onSelect={(item) =>
                    setFormData({ ...formData, answerId: item.id })
                  }
                  disabled={!formData.topic}
                  emptyMessage={
                    !formData.topic
                      ? "Please select the question first"
                      : "No answers found"
                  }
                />
              )}
            </>
          )}

          {/* ================= DESCRIPTION ================= */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={5}
              placeholder="Provide as much detail as possible..."
              className="w-full bg-[#f4fbf5] border-2 border-[#c8e6c9] rounded-xl px-4 py-4 text-sm outline-none focus:border-[#1A3C20] transition-all resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#1A3C20] text-white py-4 rounded-xl font-bold hover:opacity-90 shadow-lg"
          >
            Submit Complaint
          </button>
        </div>

        <aside className="col-span-4 space-y-6">
          <div className="bg-[#f0f9f1] border border-[#c8e6c9] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#4caf50] p-2 rounded-lg text-white">
                <Lightbulb size={20} />
              </div>
              <h4 className="font-bold text-[#1A3C20] text-lg">
                Reporting Tips
              </h4>
            </div>
            <ul className="space-y-4">
              {[
                { t: "Be specific", d: "Include names and dates." },
                { t: "Stay Objective", d: "State facts clearly." },
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-[#4caf50] mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-[#1A3C20]">{tip.t}:</span>{" "}
                    {tip.d}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Need urgent help?
            </p>
            <div className="flex items-center gap-2 text-[#1A3C20] font-bold text-sm">
              <Mail size={14} /> theideagroove@gmail.com
            </div>
          </div>
        </aside>
      </main>

      <section className="max-w-6xl mx-auto px-8 mt-16 pb-20">
        <h2 className="text-4xl font-black text-[#1A3C20] tracking-tight mb-8">
          Your Reported Issues
        </h2>
        <div className="flex flex-wrap gap-3 mb-8">
          {["ALL", "PENDING", "IN PROGRESS", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterConfig(status);
                setExpandedId(null);
              }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${filterConfig === status ? "bg-[#1A3C20] text-white shadow-md border-[#1A3C20]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
            >
              {status === "ALL" ? "All Issues" : status}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-black/5">
          <div className="grid grid-cols-14 bg-gray-50/50 border-b border-gray-100 px-8 py-4">
            <div className="col-span-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Category
            </div>
            <div className="col-span-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Subject
            </div>
            <div className="col-span-2 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
              Date
            </div>
            <div className="col-span-2 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
              Action
            </div>
            <div className="col-span-1 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
              Status
            </div>
            <div className="col-span-1"></div>
          </div>
          {processedComplaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle size={32} className="text-gray-300 mb-3" />
              <p className="text-gray-400 font-semibold text-sm">
                No complaints found
              </p>
              <p className="text-gray-300 text-xs mt-1">
                Try selecting a different filter
              </p>
            </div>
          ) : (
            processedComplaints.map((item) => {
              const isExpanded = expandedId === item.Complaint_ID;
              const displayStatus =
                item.Status?.toUpperCase().replace(/-/g, " ") || "PENDING";
              return (
                <div
                  key={item.Complaint_ID}
                  className={`border-b border-gray-50 last:border-0 transition-all ${isExpanded ? "bg-orange-50/20" : ""}`}
                >
                  <div
                    className="grid grid-cols-13 px-8 py-6 items-center cursor-pointer hover:bg-gray-50/50"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.Complaint_ID)
                    }
                  >
                    <div className="col-span-2">
                      <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider">
                        {typeMapping[item.Type] || item.Type}
                      </span>
                    </div>
                    <div className="col-span-5">
                      <h4 className="text-[15px] font-bold text-gray-800 leading-tight">
                        {item.Type?.toLowerCase() === "other"
                          ? "Complaint for IdeaGroove"
                          : item.Content_Title || "No Title"}
                      </h4>
                      {item.Type?.toLowerCase() !== "other" && (
                        <p className="text-[11px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                          {" "}
                          • Owner: @{item.Content_Owner_Name}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 text-center text-sm font-semibold text-gray-600">
                      {new Date(item.Date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {(() => {
                        const complaintDate = new Date(item.Date);
                        const now = new Date();
                        const diffInHours =
                          (now - complaintDate) / (1000 * 60 * 60);
                        const canDelete = diffInHours <= 24;

                        return canDelete ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setComplaintToDelete(item.Complaint_ID);
                            }}
                            className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:opacity-90"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">
                            Deletion is allowed only within 24hrs
                          </span>
                        );
                      })()}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`min-w-[110px] text-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border-2 ${displayStatus === "PENDING" ? "border-blue-200 bg-blue-50 text-blue-700" : displayStatus === "IN PROGRESS" ? "border-orange-200 bg-orange-50 text-orange-700" : "border-green-200 bg-green-50 text-green-700"}`}
                      >
                        {displayStatus}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {isExpanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-8 pb-8 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="ml-[16.6%] max-w-2xl bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <AlertTriangle size={18} className="text-blue-700" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest mb-1 block">
                            Your Complaint
                          </span>
                          <p className="text-sm text-gray-600 leading-relaxed italic">
                            "{item.Complaint_Text}"
                          </p>
                        </div>
                      </div>
                      <div className="ml-[16.6%] max-w-2xl bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                          <Info size={18} className="text-green-700" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-green-800 uppercase tracking-widest mb-1 block">
                            Admin Update
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            "
                            {item.Status?.toUpperCase().replace(/-/g, " ") ===
                            "RESOLVED"
                              ? "Your complaint has been reviewed and resolved. Thank you for helping us improve IdeaGroove."
                              : item.Status?.toUpperCase().replace(
                                    /-/g,
                                    " ",
                                  ) === "IN PROGRESS"
                                ? "Our team is actively looking into your complaint. We'll update you soon."
                                : "Thank you for reporting. Your complaint is currently pending review by our admin team."}
                            "
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default SubmitComplaint;
