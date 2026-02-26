import React, { useState, useEffect } from "react";
import {
  Search,
  Edit3,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Calendar,
  Trash2
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComplaints,
  updateComplaintStatus,
  deleteComplaint
} from "../redux/slice/complaintsSlice";

const ComplaintDashboard = () => {
  const dispatch = useDispatch();
  const { complaints, total, loading } = useSelector(
    (state) => state.complaints
  );

  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    dispatch(fetchComplaints(currentPage));
  }, [dispatch, currentPage]);

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleUpdate = (id) => {
    dispatch(updateComplaintStatus({ id, status: tempStatus }));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteComplaint(id));
    setExpandedId(null);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "HIGH PRIORITY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#1A3C20] p-6 text-white font-bold text-xl">
          Complaint Management
        </div>

        {loading && (
          <div className="p-6 text-center font-semibold">Loading...</div>
        )}

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-400">
            <tr>
              <th></th>
              <th>ID</th>
              <th>Student</th>
              <th>Category</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((item) => (
              <React.Fragment key={item.id}>
                <tr
                  className="cursor-pointer border-b hover:bg-gray-50"
                  onClick={() => toggleRow(item.id)}
                >
                  <td>
                    <ChevronRight size={16} />
                  </td>
                  <td className="font-bold">{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>

                  <td onClick={(e) => e.stopPropagation()}>
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <select
                          value={tempStatus}
                          onChange={(e) =>
                            setTempStatus(e.target.value)
                          }
                          className="border rounded px-2 py-1 text-xs"
                        >
                          <option>PENDING</option>
                          <option>IN PROGRESS</option>
                          <option>RESOLVED</option>
                          <option>HIGH PRIORITY</option>
                        </select>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="text-green-600 text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    )}
                  </td>

                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-3"
                  >
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setTempStatus(item.status);
                      }}
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>

                {expandedId === item.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="p-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                          <MessageCircle size={14} /> Description
                        </div>
                        <p className="text-sm text-gray-700">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mt-3">
                          <Calendar size={14} /> Filed On
                        </div>
                        <p className="text-sm font-semibold">
                          {item.date}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 bg-gray-50 text-xs font-bold uppercase">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDashboard;