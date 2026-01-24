import React, { useEffect, useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Lightbulb,
  CheckCircle2,
  Info,
  NotebookPen,
  Settings,
  User,
  AlertTriangle,
  ListFilter,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectIsAuthenticated } from "../redux/slice/authSlice";

const SubmitComplaint = () => {
  const isAuth = useSelector(selectIsAuthenticated);

  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // --- Mappings ---
  const typeMapping = {
    event: "Events",
    note: "Notes",
    group: "Groups",
    qna: "QnA",
    user: "User",
    other: "Other",
  };

  const genericTopics = {
    Notes: ["PHP by @khushal", "Bio-chem by @fiona", "Cpp by @sejal"],
    User: ["@rudri", "@sejal", "@khushal"],
    Groups: ["Coder club by @jinesh", "Chess ke master by @gukesh", "Cockroach dance by @cockroach"],
    Events: ["@rudri on 5th feb", "@sejal on 31th jan", "@khushal on 25th jan"],
    QnA: ["What is function ? [by @rudri]", "What is micro-organism ? [by @falguni]", "How to initailize array ? [by @yash]"],
    Other: ["General Feedback", "Bug Report", "Feature Request"],
  };

  // --- MOCK DATA ---
  const mockComplaints = [
    {
      id: 9021,
      category: "Notes",
      icon: <NotebookPen size={14} />,
      subject: "Java Notes by khushal",
      date: "Oct 24, 2023",
      status: "PENDING",
      adminUpdate: {
        date: "OCT 26",
        text: "Your complaints will soon be read by admin",
      },
    },
    {
      id: 8845,
      category: "Any user",
      icon: <User size={14} />,
      subject: "Student is fake",
      date: "Oct 20, 2023",
      status: "IN PROGRESS",
      adminUpdate: {
        date: "OCT 26",
        text: "Your complaints have been read by admin and are currently in progress",
      },
    },
    {
      id: 8512,
      category: "Other",
      icon: <Settings size={14} />,
      subject: "XYZ feature is not visible",
      date: "Oct 15, 2023",
      status: "RESOLVED",
      adminUpdate: {
        date: "OCT 26",
        text: "Your complaints have been resolved",
      },
    },
  ];

  // --- State ---
  const [formData, setFormData] = useState({
    category: "",
    topic: "",
    description: "",
    isAnonymous: false,
  });

  const [targetItemName, setTargetItemName] = useState("");
  const [myComplaints, setMyComplaints] = useState(mockComplaints);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState("");
  const [filterConfig, setFilterConfig] = useState("NEWEST");

  // --- EFFECT: Simulate Fetching Item Details ---
  useEffect(() => {
    if (type && id) {
      setLoading(true);
      setTimeout(() => {
        const mappedCategory = typeMapping[type] || "Other";
        let itemName = `Mock ${typeMapping[type]} (ID: ${id})`;
        if (type === "event") itemName = `Tech Fest Event #${id}`;
        if (type === "note") itemName = `Java Notes #${id}`;

        setTargetItemName(itemName);
        setFormData((prev) => ({
          ...prev,
          category: mappedCategory,
          topic: itemName,
        }));
        setLoading(false);
      }, 500);
    }
  }, [type, id]);

  // --- FILTERING & SORTING LOGIC ---
  const processedComplaints = useMemo(() => {
    let result = [...myComplaints];

    // Filter by Status
    if (["PENDING", "IN PROGRESS", "RESOLVED"].includes(filterConfig)) {
      result = result.filter((item) => item.status === filterConfig);
    }

    // Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return filterConfig === "OLDEST" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [myComplaints, filterConfig]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: Math.floor(Math.random() * 1000),
      category: formData.category,
      icon: <Info size={14} />,
      subject: formData.topic || formData.category,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "PENDING",
    };

    setMyComplaints([newComplaint, ...myComplaints]);
    toast.success("Complaint Submitted Successfully");
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-[#1A3C20] text-white border-transparent";
      case "IN PROGRESS":
        return "bg-orange-50 text-orange-700 border-orange-100";
      default:
        return "bg-white text-[#1A3C20] border-[#1A3C20]/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <section className="relative bg-[#1A3C20] pt-40 pb-20">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="block w-full h-[100px]"
          >
            <path
              fill="#FFFBEB"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto -mt-30 relative z-30 px-4 flex gap-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#FFFBEB]/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-5xl font-extrabold mb-4 text-[#FFFBEB]">
          Submit a Complaint
        </h1>
      </div>

      <main className="max-w-6xl mx-auto py-12 px-8 grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          {id && type && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="text-orange-600 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-gray-800 text-sm italic">
                  Reporting {typeMapping[type]}:{" "}
                  {loading ? "Loading..." : targetItemName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  The category has been locked to this specific item.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                className={`w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1a432e]/10 outline-none ${
                  id ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "cursor-pointer"
                }`}
                value={formData.category}
                disabled={!!id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    topic: "",
                  })
                }
              >
                <option value="">Select a category</option>
                {Object.values(typeMapping).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {formData.category && !id && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Specific Issue
                </label>
                <select
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1a432e]/10 outline-none"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                >
                  <option value="">Select specific issue</option>
                  {(genericTopics[formData.category] || genericTopics["Other"]).map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Please describe the issue in detail..."
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm outline-none resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <button
              disabled={!isAuth}
              type="submit"
              className={`${
                isAuth ? "cursor-pointer" : "cursor-not-allowed"
              } w-full bg-[#1A3C20] text-white py-4 rounded-xl font-bold hover:bg-[#143424] transition-colors shadow-lg shadow-[#1A3C20]/20`}
            >
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="col-span-4">
          <div className="bg-[#f0f4f1] rounded-2xl p-6 border border-[#e0e7e1] sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="text-[#1A3C20]" size={20} />
              <h2 className="font-bold text-[#1A3C20]">Reporting Tips</h2>
            </div>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <CheckCircle2 className="text-[#1A3C20] shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-gray-600">Be Specific: Provide details.</p>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="text-[#1A3C20] shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-gray-600">Stay Objective: Stick to facts.</p>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* --- FILTERED DATA TABLE SECTION --- */}
      <section className="max-w-6xl mx-auto px-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-[#1A3C20] mb-2">
              Your Reported Issues
            </h2>
            <p className="text-gray-500 text-xs font-medium">
              Viewing {processedComplaints.length} records
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* --- CLEAR FILTER BUTTON --- */}
            {filterConfig !== "NEWEST" && (
              <button
                onClick={() => setFilterConfig("NEWEST")}
                className="flex items-center gap-1.5 text-xs font-black text-red-500 hover:text-red-700 transition-all bg-red-50 px-3 py-2 rounded-xl border border-red-100 animate-in fade-in zoom-in duration-200"
              >
                <XCircle size={14} />
                Clear Filter
              </button>
            )}

            {/* --- FILTER DROPDOWN --- */}
            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm ring-1 ring-black/5">
              <ListFilter size={16} className="text-gray-400" />
              <select
                className="text-xs font-bold text-[#1A3C20] outline-none cursor-pointer bg-transparent"
                value={filterConfig}
                onChange={(e) => setFilterConfig(e.target.value)}
              >
                <optgroup label="Sorting">
                  <option value="NEWEST">Newest to Oldest</option>
                  <option value="OLDEST">Oldest to Newest</option>
                </optgroup>
                <optgroup label="Status Filtering">
                  <option value="PENDING">Status: Pending</option>
                  <option value="IN PROGRESS">Status: In Progress</option>
                  <option value="RESOLVED">Status: Resolved</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[200px]">
          <div className="grid grid-cols-12 px-8 py-5 bg-gray-50/50 border-b text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="col-span-2">Category</div>
            <div className="col-span-5">Subject</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-gray-50">
            {processedComplaints.length > 0 ? (
              processedComplaints.map((item) => (
                <div key={item.id} className="group transition-colors hover:bg-gray-50/30">
                  <div
                    className="grid grid-cols-12 px-8 py-6 items-center cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                  >
                    <div className="col-span-2">
                      <span className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-[11px] font-bold w-fit uppercase">
                        {item.icon} {item.category}
                      </span>
                    </div>
                    <div className="col-span-5 pr-4">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {item.subject}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5 tracking-tighter">
                        Ref ID: #{item.id}
                      </p>
                    </div>
                    <div className="col-span-2 text-[13px] text-gray-500 font-medium">
                      {item.date}
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`px-4 py-1.5 rounded-lg border text-[10px] font-black tracking-widest uppercase ${getStatusStyles(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {expandedId === item.id ? (
                        <ChevronUp size={20} className="text-gray-300" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-300" />
                      )}
                    </div>
                  </div>

                  {expandedId === item.id && item.adminUpdate && (
                    <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                      <div className="bg-white border border-[#1A3C20]/5 rounded-2xl p-6 flex gap-5 ml-[16.6%] max-w-2xl shadow-sm">
                        <div className="bg-[#1A3C20]/5 p-2.5 h-fit rounded-xl">
                          <Info size={18} className="text-[#1A3C20]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-[#1A3C20] tracking-widest uppercase">
                              Admin Update
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              ({item.adminUpdate.date})
                            </span>
                          </div>
                          <p className="text-gray-600 italic text-sm leading-relaxed">
                            "{item.adminUpdate.text}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <div className="bg-gray-50 p-4 rounded-full">
                  <AlertTriangle size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 text-sm font-bold italic">
                  No results found for this filter.
                </p>
                <button
                  onClick={() => setFilterConfig("NEWEST")}
                  className="text-[#1A3C20] text-xs font-bold underline underline-offset-4 hover:text-black transition-all"
                >
                  Reset to default view
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubmitComplaint;