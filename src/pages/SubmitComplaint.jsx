// import React, { useEffect, useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   ArrowLeft,
//   Lightbulb,
//   CheckCircle2,
//   Info,
//   CalendarDays,
//   MessageSquare,
//   NotebookPen,
//   AlertTriangle, // Make sure this is here too
//   Loader2,
//   User,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";

// const SubmitComplaint = () => {
//   const { type, id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     category: "",
//     topic: "",
//     description: "",
//     isAnonymous: false,
//   });

//   // State for the "Reported Issues" table
//   const [expandedId, setExpandedId] = useState(8845);

//   const categories = ["Notes", "QnA", "Events", "Group", "Any User", "Other"];
//   const topics = {
//     Notes: ["Wrong Content", "Copyright Issue", "Poor Quality", "Other"],
//     Any_User: ["Harassment", "Spam", "Fake Profile", "Other"],
//     Groups: ["Inappropriate Name", "Spam Content", "Toxic Behavior"],
//     Events: ["Fake Event", "Wrong Date/Time", "Inappropriate Description"],
//     QnA: ["Wrong Answer", "Spam", "Off-topic"],
//     Other: ["General Feedback", "Bug Report", "Feature Request"],
//   };

//   const complaints = [
//     {
//       id: 9021,
//       category: "Notes",
//       icon: <NotebookPen size={14} />,
//       subject: "Java Notes by khushal",
//       date: "Oct 24, 2023",
//       status: "PENDING",
//     },
//     {
//       id: 8845,
//       category: "Any user",
//       icon: <User size={14} />,
//       subject: "Student is fake",
//       date: "Oct 20, 2023",
//       status: "IN PROGRESS",
//       adminUpdate: {
//         date: "OCT 26",
//         text: "The registrar's office is currently synchronizing the local database with the portal. Your grades should appear within 48 hours. Thank you for your patience.",
//       },
//     },
//     {
//       id: 8512,
//       category: "Other",
//       icon: <Settings size={14} />,
//       subject: "XYZ feature is not visible",
//       date: "Oct 15, 2023",
//       status: "RESOLVED",
//     },
//     {
//       id: 8422,
//       category: "Notes",
//       icon: <NotebookPen size={14} />,
//       subject: "Statistics by Sejal",
//       date: "Oct 10, 2023",
//       status: "PENDING",
//     },
//   ];

//   const getStatusStyles = (status) => {
//     switch (status) {
//       case "RESOLVED":
//         return "bg-[#1A3C20] text-white border-transparent";
//       case "IN PROGRESS":
//         return "bg-orange-50 text-orange-700 border-orange-100";
//       default:
//         return "bg-white text-[#1A3C20] border-[#1A3C20]/20";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
//       <section className="relative bg-[#1A3C20] pt-40 pb-30">
//         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
//           <svg
//             viewBox="0 0 1440 120"
//             preserveAspectRatio="none"
//             className="block w-full h-[100px]"
//           >
//             <path
//               fill="#FFFBEB"
//               d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
//             ></path>
//           </svg>
//         </div>
//       </section>

//       {/* Hero Banner */}
//       <div className="max-w-6xl mx-auto -mt-30 relative z-30 px-4">
//         <h1 className="text-5xl font-extrabold mb-4 text-[#FFFBEB]">
//           Submit a Complaint
//         </h1>
//         <div className="bg-[#1A3C20]/60 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 inline-block">
//           <p className="text-sm text-[#FFFBEB]">
//             Help us improve your student experience. We take every report
//             seriously.
//           </p>
//         </div>
//       </div>

//       {/* Submission Form Section */}
//       <main className="max-w-6xl mx-auto py-12 px-8 grid grid-cols-12 gap-8">
//         <div className="col-span-8 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
//           <div className="space-y-8">
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">
//                 What is this regarding?
//               </label>
//               <p className="text-xs text-gray-400 mb-4">
//                 Select the department most relevant to your issue.
//               </p>
//               <div className="relative">
//                 <select
//                   className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1a432e]/10 outline-none cursor-pointer"
//                   value={formData.category}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       category: e.target.value,
//                       topic: "",
//                     })
//                   }
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                   size={18}
//                 />
//               </div>
//             </div>

//             {formData.category && (
//               <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Specific Topic
//                 </label>
//                 <div className="relative">
//                   <select
//                     className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1a432e]/10 outline-none cursor-pointer"
//                     value={formData.topic}
//                     onChange={(e) =>
//                       setFormData({ ...formData, topic: e.target.value })
//                     }
//                   >
//                     <option value="">Select specific issue</option>
//                     {topics[formData.category].map((t) => (
//                       <option key={t} value={t}>
//                         {t}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                     size={18}
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">
//                 Describe the issue
//               </label>
//               <p className="text-xs text-gray-400 mb-4">
//                 Provide as much detail as possible, including dates and
//                 locations.
//               </p>
//               <textarea
//                 rows={6}
//                 placeholder="I am writing to report an issue with..."
//                 className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-[#1a432e]/10 outline-none resize-none"
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//               />
//             </div>

//             <div className="flex items-start gap-3">
//               <input
//                 type="checkbox"
//                 id="anon"
//                 className="mt-1 rounded border-gray-300 text-[#1a432e] focus:ring-[#1a432e]"
//                 checked={formData.isAnonymous}
//                 onChange={(e) =>
//                   setFormData({ ...formData, isAnonymous: e.target.checked })
//                 }
//               />
//               <label
//                 htmlFor="anon"
//                 className="text-xs text-gray-500 leading-relaxed"
//               >
//                 Submit this report anonymously.{" "}
//                 <span className="font-bold">Note:</span> We may not be able to
//                 follow up directly with you if this is checked.
//               </label>
//             </div>

//             <button className="w-full bg-[#1A3C20] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#143424] transition-colors">
//               Submit Complaint
//             </button>
//           </div>
//         </div>

//         <div className="col-span-4">
//           <div className="bg-[#f0f4f1] rounded-2xl p-6 border border-[#e0e7e1]">
//             <div className="flex items-center gap-2 mb-6">
//               <Lightbulb className="text-[#1A3C20]" size={20} />
//               <h2 className="font-bold text-[#1A3C20]">Reporting Tips</h2>
//             </div>
//             <ul className="space-y-5">
//               {[
//                 {
//                   title: "Be specific",
//                   desc: "Include names, dates, and times where possible.",
//                 },
//                 {
//                   title: "Stay Objective",
//                   desc: "Describe the facts of the situation clearly.",
//                 },
//                 {
//                   title: "Visuals Help",
//                   desc: "Screenshots are the best way to prove digital errors.",
//                 },
//                 {
//                   title: "Respect",
//                   desc: "Our team is here to help; please maintain a professional tone.",
//                 },
//               ].map((tip, idx) => (
//                 <li key={idx} className="flex gap-3">
//                   <CheckCircle2
//                     className="text-[#1A3C20] shrink-0 mt-0.5"
//                     size={16}
//                   />
//                   <div>
//                     <p className="text-sm font-bold text-[#1A3C20] mb-1">
//                       {tip.title}:
//                     </p>
//                     <p className="text-xs text-gray-600 leading-relaxed">
//                       {tip.desc}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </main>

//       {/* --- ADDED SECTION: Reported Issues Table --- */}
//       <section className="max-w-6xl mx-auto px-8 mt-12">
//         <div className="mb-8">
//           <h2 className="text-4xl font-extrabold text-[#1A3C20] mb-2">
//             Your Reported Issues
//           </h2>
//           <p className="text-gray-500 text-sm">
//             Track the progress of your submissions and view admin feedback.
//           </p>
//         </div>

//         <div className="flex gap-3 mb-8">
//           {["All Issues", "Pending", "In Progress", "Resolved"].map((tab) => (
//             <button
//               key={tab}
//               className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
//                 tab === "All Issues"
//                   ? "bg-[#1A3C20] text-white shadow-md"
//                   : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200 shadow-sm"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           {/* Table Header */}
//           <div className="grid grid-cols-12 px-8 py-5 bg-gray-50/50 border-b border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
//             <div className="col-span-2">Category</div>
//             <div className="col-span-5">Subject</div>
//             <div className="col-span-2">Date Reported</div>
//             <div className="col-span-2">Status</div>
//             <div className="col-span-1"></div>
//           </div>

//           {/* Table Rows */}
//           <div className="divide-y divide-gray-50">
//             {complaints.map((item) => (
//               <div
//                 key={item.id}
//                 className="group transition-colors hover:bg-gray-50/30"
//               >
//                 <div
//                   className="grid grid-cols-12 px-8 py-6 items-center cursor-pointer"
//                   onClick={() =>
//                     setExpandedId(expandedId === item.id ? null : item.id)
//                   }
//                 >
//                   <div className="col-span-2">
//                     <span className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-[11px] font-bold w-fit">
//                       {item.icon}
//                       {item.category}
//                     </span>
//                   </div>
//                   <div className="col-span-5 pr-4">
//                     <h3 className="font-bold text-gray-800 text-sm">
//                       {item.subject}
//                     </h3>
//                     <p className="text-[11px] text-gray-400 mt-0.5">
//                       Ref ID: #CMP-{item.id}
//                     </p>
//                   </div>
//                   <div className="col-span-2 text-[13px] text-gray-500 font-medium">
//                     {item.date}
//                   </div>
//                   <div className="col-span-2">
//                     <span
//                       className={`px-4 py-1.5 rounded-lg border text-[10px] font-black tracking-widest uppercase ${getStatusStyles(
//                         item.status
//                       )}`}
//                     >
//                       {item.status}
//                     </span>
//                   </div>
//                   <div className="col-span-1 flex justify-end">
//                     {expandedId === item.id ? (
//                       <ChevronUp
//                         className="text-gray-300 group-hover:text-[#1A3C20]"
//                         size={20}
//                       />
//                     ) : (
//                       <ChevronDown
//                         className="text-gray-300 group-hover:text-[#1A3C20]"
//                         size={20}
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {/* Expanded Feedback Section */}
//                 {expandedId === item.id && item.adminUpdate && (
//                   <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
//                     <div className="bg-white border border-[#1A3C20]/5 rounded-2xl p-6 flex gap-5 ml-[16.6%] max-w-2xl shadow-sm ring-1 ring-black/5">
//                       <div className="bg-[#1A3C20]/5 p-2.5 h-fit rounded-xl">
//                         <Info size={18} className="text-[#1A3C20]" />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <span className="text-[10px] font-black text-[#1A3C20] tracking-widest uppercase">
//                             Admin Update
//                           </span>
//                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
//                             ({item.adminUpdate.date})
//                           </span>
//                         </div>
//                         <p className="text-gray-600 italic text-sm leading-relaxed">
//                           "{item.adminUpdate.text}"
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="px-8 py-5 flex justify-between items-center border-t border-gray-50 text-[12px] text-gray-500 font-medium">
//             <p>Showing 1 to 4 of 12 complaints</p>
//             <div className="flex gap-2">
//               <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
//                 <ChevronLeft size={16} />
//               </button>
//               <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default SubmitComplaint;
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Lightbulb,
  CheckCircle2,
  Info,
  NotebookPen,
  Settings,
  Users,
  User,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const SubmitComplaint = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // --- Mappings ---
  const typeMapping = {
    event: "Events",
    note: "Notes",
    group: "Group",
    qna: "QnA",
    user: "Any User",
  };

  const genericTopics = {
    Notes: ["Wrong Content", "Copyright Issue", "Poor Quality"],
    Any_User: ["Harassment", "Spam", "Fake Profile"],
    Groups: ["Inappropriate Name", "Spam Content", "Toxic Behavior"],
    Events: ["Fake Event", "Wrong Date/Time", "Inappropriate Description"],
    QnA: ["Wrong Answer", "Spam", "Off-topic"],
    Other: ["General Feedback", "Bug Report", "Feature Request"],
  };

  // --- MOCK DATA FOR TABLE ---
  const mockComplaints = [
    {
      id: 9021,
      category: "Notes",
      icon: <NotebookPen size={14} />,
      subject: "Java Notes by khushal",
      date: "Oct 24, 2023",
      status: "PENDING",
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
        text: "The registrar's office is currently synchronizing the local database.",
      },
    },
    {
      id: 8512,
      category: "Other",
      icon: <Settings size={14} />,
      subject: "XYZ feature is not visible",
      date: "Oct 15, 2023",
      status: "RESOLVED",
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
  const [myComplaints, setMyComplaints] = useState(mockComplaints); // ✅ Loaded Mock Data directly
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(8845);

  // --- EFFECT 1: Simulate Fetching Item Details (Auto-fill) ---
  useEffect(() => {
    if (type && id) {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const mappedCategory = typeMapping[type] || "Other";

        // SIMULATED NAME FETCHING
        let itemName = `Mock ${typeMapping[type]} (ID: ${id})`;
        if (type === "event") itemName = `Tech Fest Event #${id}`; // Example simulation
        if (type === "note") itemName = `Java Notes #${id}`;

        setTargetItemName(itemName);

        setFormData((prev) => ({
          ...prev,
          category: mappedCategory,
          topic: itemName, // Pre-fill input
        }));
        setLoading(false);
      }, 500);
    }
  }, [type, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      target_id: id || null,
      target_type: type || null,
      user_id: user?.id,
    };

    console.log("Simulating Backend Submission:", payload);

    // Simulate adding to the table temporarily
    const newComplaint = {
      id: Math.floor(Math.random() * 1000),
      category: formData.category,
      icon: <Info size={14} />,
      subject: formData.topic || formData.category, // Simplified subject
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "PENDING",
    };

    setMyComplaints([newComplaint, ...myComplaints]);
    toast.success("Complaint Submitted Successfully (Mock)");

    // navigate("/dashboard"); // Optional redirect
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
      {/* Header Graphics */}
      <section className="relative bg-[#1A3C20] pt-40 pb-30">
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

      {/* Hero Banner */}
      <div className="max-w-6xl mx-auto -mt-30 relative z-30 px-4">
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
          {/* CONTEXT BANNER */}
          {id && type && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">
                  Reporting {typeMapping[type]}:{" "}
                  <span className="text-orange-700">
                    {loading ? "Loading..." : targetItemName}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  The category has been locked to this specific item.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  className={`w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1a432e]/10 outline-none ${
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
                  <option value="Other">Other</option>
                </select>
                {!id && (
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                )}
              </div>
            </div>

            {/* Topic / Specific Issue */}
            {formData.category && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Specific Issue
                </label>
                <div className="relative">
                  {id ? (
                    <input
                      type="text"
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 focus:outline-none cursor-not-allowed font-medium"
                      value={formData.topic}
                      readOnly
                    />
                  ) : (
                    <>
                      <select
                        className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1a432e]/10 outline-none cursor-pointer"
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({ ...formData, topic: e.target.value })
                        }
                      >
                        <option value="">Select specific issue</option>
                        {(
                          genericTopics[formData.category] ||
                          genericTopics["Other"]
                        ).map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Please describe the issue in detail..."
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-[#1a432e]/10 outline-none resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Anonymous */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="anon"
                className="mt-1 rounded border-gray-300 text-[#1a432e] focus:ring-[#1a432e]"
                checked={formData.isAnonymous}
                onChange={(e) =>
                  setFormData({ ...formData, isAnonymous: e.target.checked })
                }
              />
              <label
                htmlFor="anon"
                className="text-xs text-gray-500 leading-relaxed"
              >
                Submit this report anonymously.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A3C20] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#143424] transition-colors shadow-lg shadow-[#1A3C20]/20"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="col-span-4">
          <div className="bg-[#f0f4f1] rounded-2xl p-6 border border-[#e0e7e1] sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="text-[#1A3C20]" size={20} />
              <h2 className="font-bold text-[#1A3C20]">Reporting Tips</h2>
            </div>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <CheckCircle2
                  className="text-[#1A3C20] shrink-0 mt-0.5"
                  size={16}
                />
                <p className="text-xs text-gray-600">
                  Be Specific: Provide details.
                </p>
              </li>
              <li className="flex gap-3">
                <CheckCircle2
                  className="text-[#1A3C20] shrink-0 mt-0.5"
                  size={16}
                />
                <p className="text-xs text-gray-600">
                  Stay Objective: Stick to facts.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* --- MOCK DATA TABLE --- */}
      <section className="max-w-6xl mx-auto px-8 mt-12">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-[#1A3C20] mb-2">
            Your Reported Issues
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[200px]">
          <div className="grid grid-cols-12 px-8 py-5 bg-gray-50/50 border-b border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="col-span-2">Category</div>
            <div className="col-span-5">Subject</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-gray-50">
            {myComplaints.map((item) => (
              <div
                key={item.id}
                className="group transition-colors hover:bg-gray-50/30"
              >
                {/* Row Clickable Area */}
                <div
                  className="grid grid-cols-12 px-8 py-6 items-center cursor-pointer"
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                >
                  <div className="col-span-2">
                    <span className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-[11px] font-bold w-fit">
                      {item.icon} {item.category}
                    </span>
                  </div>
                  <div className="col-span-5 pr-4">
                    <h3 className="font-bold text-gray-800 text-sm">
                      {item.subject}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
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

                {/* Expanded Section (For Mock Data with Updates) */}
                {expandedId === item.id && item.adminUpdate && (
                  <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-white border border-[#1A3C20]/5 rounded-2xl p-6 flex gap-5 ml-[16.6%] max-w-2xl shadow-sm ring-1 ring-black/5">
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubmitComplaint;
