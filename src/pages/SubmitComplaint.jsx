import React, { useEffect, useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
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
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { selectIsAuthenticated } from "../redux/slice/authSlice";
import {
  fetchUserComplaints,
  createComplaint,
  fetchContentOptions,
} from "../redux/slice/complaintsSlice.js";
import PageHeader from "../components/common/PageHeader";

const SubmitComplaint = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);
  const { user } = useSelector((state) => state.auth);
  const { complaints, contentOptions, contentStatus } = useSelector(
    (state) => state.complaints
  );

  const { type, id, text } = useParams();
  const navigate = useNavigate();

  /* ================= MAPPINGS ================= */

  const typeMapping = {
    event: "Events",
    note: "Notes",
    group: "Groups",
    qna: "QnA",
    user: "User",
    other: "Other",
  };

  /* ================= STATE ================= */

  const [formData, setFormData] = useState({
    category: "",
    topic: "",
    description: "",
    isAnonymous: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [targetItemName, setTargetItemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [filterConfig, setFilterConfig] = useState("NEWEST");

  /* ================= AUTO PREFILL (RAISE FROM CONTENT) ================= */

  useEffect(() => {
    if (type && id && text) {
      setLoading(true);

      const mappedCategory = typeMapping[type] || "Other";
      const itemName = text;

      setTargetItemName(itemName);

      setFormData((prev) => ({
        ...prev,
        category: mappedCategory,
        topic: id, // store actual ID
      }));

      setLoading(false);
    }
  }, [type, id, text]);

  /* ================= FETCH USER COMPLAINTS ================= */

  useEffect(() => {
    if (user?.S_ID) {
      dispatch(fetchUserComplaints({ userId: user.S_ID }));
    }
  }, [dispatch, user]);

  /* ================= FETCH CONTENT OPTIONS WHEN CATEGORY CHANGES ================= */

  useEffect(() => {
    if (formData.category && !id) {
      dispatch(fetchContentOptions(formData.category));
      setSearchTerm("");
    }
  }, [formData.category, dispatch, id]);

  /* ================= FILTER DROPDOWN OPTIONS ================= */

  const filteredOptions = useMemo(() => {
    return contentOptions.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contentOptions, searchTerm]);

  /* ================= FILTER + SORT USER COMPLAINTS ================= */

  const processedComplaints = useMemo(() => {
    let result = [...complaints];

    if (["PENDING", "IN PROGRESS", "RESOLVED"].includes(filterConfig)) {
      result = result.filter((item) => item.Status === filterConfig);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return filterConfig === "OLDEST" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [complaints, filterConfig]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.S_ID) {
      toast.error("You must be logged in");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please provide complaint description");
      return;
    }

    if (!id && !formData.topic) {
      toast.error("Please select specific issue");
      return;
    }

    const complaintPayload = {
      Student_ID: user.S_ID,
      Type: type || formData.category.toLowerCase(),
      Content_ID: id || formData.topic,
      Complaint_Text: formData.description,
    };

    try {
      await dispatch(createComplaint(complaintPayload)).unwrap();

      toast.success("Complaint Submitted Successfully");

      dispatch(fetchUserComplaints({ userId: user.S_ID }));

      setFormData({
        category: "",
        topic: "",
        description: "",
        isAnonymous: false,
      });

      setSearchTerm("");
    } catch (err) {
      toast.error(err);
    }
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

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Submit Complaint" />

      <main className="max-w-6xl mx-auto py-12 px-8 grid grid-cols-12 gap-8 relative z-30">
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
                className={`w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none ${
                  id
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "cursor-pointer"
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

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search specific issue..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <select
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                  >
                    <option value="">Select specific issue</option>

                    {contentStatus === "loading" && (
                      <option>Loading...</option>
                    )}

                    {filteredOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
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

        <div className="col-span-4"></div>
      </main>

      <section className="max-w-6xl mx-auto px-8 mt-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {processedComplaints.length > 0 ? (
              processedComplaints.map((item) => (
                <div key={item.Complaint_ID}>
                  <div className="grid grid-cols-12 px-8 py-6 items-center">
                    <div className="col-span-5">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {item.Type}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Ref ID: #{item.Complaint_ID}
                      </p>
                    </div>

                    <div className="col-span-3 text-sm text-gray-500">
                      {new Date(item.Date).toLocaleDateString()}
                    </div>

                    <div className="col-span-3">
                      <span
                        className={`px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase ${getStatusStyles(
                          item.Status
                        )}`}
                      >
                        {item.Status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-400 text-sm">
                No complaints yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubmitComplaint;