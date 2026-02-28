import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminNotesGrid from "../../components/admin/AdminNotesGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";

// // Moved initial data here to allow global state management
// const initialNotes = [
//   {
//     id: 1,
//     title: "Operating Systems Notes",
//     subject: "OS",
//     degree: "B.Tech",
//     description: "Complete notes covering process, memory, and scheduling.",
//     uploadedBy: "Rohan Sharma",
//     status: "active",
//   },
//   {
//     id: 2,
//     title: "DBMS Normalization",
//     subject: "DBMS",
//     degree: "B.Tech",
//     description: "Detailed explanation of 1NF, 2NF, 3NF with examples.",
//     uploadedBy: "Aisha Khan",
//     status: "blocked",
//   },
//   {
//     id: 3,
//     title: "Computer Networks Cheatsheet",
//     subject: "CN",
//     degree: "BCA",
//     description: "Quick revision notes for TCP/IP and OSI layers.",
//     uploadedBy: "Kunal Verma",
//     status: "active",
//   },
//   {
//     id: 4,
//     title: "React Hooks Summary",
//     subject: "Web Dev",
//     degree: "BCA",
//     description: "Short notes on useState, useEffect, useContext.",
//     uploadedBy: "Neha Patel",
//     status: "active",
//   },
//   {
//     id: 5,
//     title: "Machine Learning Basics",
//     subject: "AI",
//     degree: "BCA",
//     description: "Introductory ML concepts and algorithms.",
//     uploadedBy: "Arjun Mehta",
//     status: "blocked",
//   },
// ];

const AdminNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [degreeSubjectMap, setDegreeSubjectMap] = useState({});
  const [subjectOptions, setSubjectOptions] = useState([]);

  const [notesStats, setNotesStats] = useState([
    {
      title: "Total Notes Uploaded",
      value: 0,
      infoText: "+12% this month",
      color: "green",
      type: "total",
    },
    {
      title: "Active Notes",
      value: 0,
      infoText: "Currently Active",
      color: "yellow",
      type: "pending",
    },
    {
      title: "InActive Notes",
      value: 0,
      infoText: "Blocked & Deleted Notes",
      color: "red",
      type: "blocked",
    },
  ]);

  // ✅ Move fetchNotes outside useEffect so handleActionSubmit can call it
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/notes?page=1&limit=50`,
      );
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();

      const formattedNotes = data.notes.map((n) => ({
        id: n.N_ID,
        title: n.Description,
        degree: n.Degree_Name,
        subject: n.Subject_Name,
        uploadedBy: n.Author,
        userId: n.Author_ID,
        file: n.File_Name || n.Note_File,
        status: n.Is_Active === 1 ? "active" : "blocked",
      }));

      setNotesStats([
        {
          title: "Total Notes Uploaded",
          value: data.total,
          infoText: "+12% this month",
          color: "green",
          type: "total",
        },
        {
          title: "Active Notes",
          value: formattedNotes.filter((n) => n.status === "active").length,
          infoText: "Currently Active",
          color: "yellow",
          type: "pending",
        },
        {
          title: "InActive Notes",
          value: formattedNotes.filter((n) => n.status === "blocked").length,
          infoText: "Blocked & Deleted Notes",
          color: "red",
          type: "blocked",
        },
      ]);

      setNotes(formattedNotes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect just calls it
  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const fetchDegree = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/degreeSubject/allDegreeSubject`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch degrees");
        }

        const data = await response.json();

        const map = {};

        data.degreeSubject.forEach((item) => {
          const degree = item.degree_name;
          const subject = item.subject_name;

          if (!map[degree]) {
            map[degree] = [];
          }

          map[degree].push(subject);
        });

        // Remove duplicates
        Object.keys(map).forEach((degree) => {
          map[degree] = [...new Set(map[degree])];
        });

        setDegreeSubjectMap(map);
        setDegreeOptions(Object.keys(map));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDegree();
  }, []);

  useEffect(() => {
    if (degreeFilter === "all") {
      // Show all subjects
      const allSubjects = [...new Set(Object.values(degreeSubjectMap).flat())];

      setSubjectOptions(allSubjects);
    } else {
      setSubjectOptions(degreeSubjectMap[degreeFilter] || []);
    }

    setSubjectFilter("all"); // Reset subject when degree changes
  }, [degreeFilter, degreeSubjectMap]);

  const handleModerateRequest = (type, noteId) => {
    setSelectedAction(type);
    setTargetId(noteId);
    setModalOpen(true);
    setReason(
      type === "block"
        ? "This content has been blocked due to a violation of academic integrity or copyright policies."
        : "This content has been reviewed and reinstated for community access.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/toggle-block`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "note",
            id: targetId,
            reason: reason,
          }),
        },
      );

      const data = await res.json();

      if (data.status) {
        // Update local state — no need to refetch
        setNotes((prev) =>
          prev.map((n) =>
            n.id === targetId
              ? {
                  ...n,
                  status: selectedAction === "block" ? "blocked" : "active",
                }
              : n,
          ),
        );

        // Update stats counts
        notesStats[1].value = notes.filter((n) =>
          n.id === targetId
            ? selectedAction !== "block"
            : n.status === "active",
        ).length;
        notesStats[2].value = notes.filter((n) =>
          n.id === targetId
            ? selectedAction === "block"
            : n.status === "blocked",
        ).length;

        toast.success(
          `Note ${selectedAction}ed successfully! Email sent to student.`,
        );
        setModalOpen(false);
        setReason("");
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error("Moderation error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-8 relative min-h-screen">
      <AdminPageHeader
        title="Notes Moderation"
        subtitle="Review and manage user uploads"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={degreeOptions}
        subjectOptions={subjectOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setSubjectFilter}
      />

      <StatsRow stats={notesStats} />

      <AdminNotesGrid
        notes={notes}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterSubject={subjectFilter}
        onModerate={handleModerateRequest}
      />

      <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleActionSubmit}
        actionType={selectedAction}
        targetType="Notes"
        reason={reason}
        setReason={setReason}
        loading={loading}
      />
    </section>
  );
};

export default AdminNotes;
