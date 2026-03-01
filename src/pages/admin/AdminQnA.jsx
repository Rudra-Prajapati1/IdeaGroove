import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminQnAGrid from "../../components/admin/AdminQnAGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";

// const initialData = [
//   {
//     id: 1,
//     question: "Clarification on Project Submission Guidelines for CS202",
//     authorName: "Prof. H. Smith",
//     addedOn: "2025-01-20T10:30:00",
//     subjectName: "Web Development",
//     degreeName: "B.Tech",
//     answersCount: 2,
//     status: "active",
//     answers: [
//       {
//         id: 101,
//         author: "Sarah J.",
//         time: "2 days ago",
//         text: "Does this apply to group projects or only individual submissions?",
//         status: "active",
//       },
//       {
//         id: 102,
//         author: "Prof. H. Smith",
//         time: "1 day ago",
//         text: "It applies to both. Please check the updated PDF on the portal.",
//         status: "active",
//       },
//     ],
//   },
//   {
//     id: 2,
//     question: "Help needed with Linear Algebra Eigenvalues",
//     authorName: "Jessica S.",
//     addedOn: "2025-01-24T09:15:00",
//     subjectName: "Linear Algebra",
//     degreeName: "BCA",
//     answersCount: 0,
//     status: "active",
//     answers: [],
//   },
//   {
//     id: 3,
//     question: "Thermodynamics: Second Law confusion",
//     authorName: "Michael P.",
//     addedOn: "2025-01-23T18:40:00",
//     subjectName: "Thermodynamics",
//     degreeName: "B.Tech",
//     answersCount: 1,
//     status: "active",
//     answers: [
//       {
//         id: 301,
//         author: "Dr. Kelvin",
//         time: "5 hours ago",
//         text: "Remember that entropy in an isolated system never decreases over time.",
//         status: "active",
//       },
//     ],
//   },
//   {
//     id: 4,
//     question: "Is recursion better than iteration?",
//     authorName: "Anonymous",
//     addedOn: "2025-01-22T11:00:00",
//     subjectName: "Data Structures",
//     degreeName: "BCA",
//     answersCount: 3,
//     status: "blocked",
//     answers: [
//       {
//         id: 401,
//         author: "CodeWizard",
//         time: "3 days ago",
//         text: "It depends on stack depth.",
//         status: "active",
//       },
//       {
//         id: 402,
//         author: "DevOps_Guy",
//         time: "2 days ago",
//         text: "Iteration is efficient.",
//         status: "active",
//       },
//       {
//         id: 403,
//         author: "Student_01",
//         time: "1 day ago",
//         text: "Recursion is elegant.",
//         status: "active",
//       },
//     ],
//   },
// ];

export const qnaStats = [
  {
    title: "Total Questions",
    value: "",
    infoText: "+22 today",
    color: "green",
    type: "total",
  },
  {
    title: "Active Question",
    value: "",
    infoText: "Currently Active",
    color: "yellow",
    type: "pending",
  },
  {
    title: "InActive Questions",
    value: "",
    infoText: "Blocked & Deleted",
    color: "red",
    type: "blocked",
  },
];

const AdminQnA = () => {
  const [qnas, setQnas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [targetAnswerId, setTargetAnswerId] = useState(null); // New state to track if moderating an answer
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [qnaStats, setQnaStats] = useState([
    {
      title: "Total Questions",
      value: 0,
      infoText: "All questions asked",
      color: "green",
      type: "total",
    },
    {
      title: "Active Questions",
      value: 0,
      infoText: "Currently Active",
      color: "yellow",
      type: "pending",
    },
    {
      title: "InActive Questions",
      value: 0,
      infoText: "Blocked & Deleted",
      color: "red",
      type: "blocked",
    },
  ]);

  const [degreeOptions, setDegreeOptions] = useState([]);
  const [degreeSubjectMap, setDegreeSubjectMap] = useState({});
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    const fetchQnA = async () => {
      try {
        const reponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/qna/?page=1&limit=1000`,
        );
        const data = await reponse.json();
        console.log(data.QnA);
        const filteredQnAs = data.QnA.map((qna) => ({
          id: qna.Q_ID,
          question: qna.Question,
          authorName: qna.Question_Author,
          authorId: qna.Author_Id,
          addedOn: qna.Added_On,
          answersCount: qna.Total_Answers,
          degreeName: qna.Degree_Name,
          subjectName: qna.Subject_Name,
          status: qna.Is_Active === 1 ? "active" : "blocked",
          answers: (qna.Answers || []).map((ans) => ({
            id: ans.A_ID,
            text: ans.Answer,
            author: ans.Answer_Author,
            time: ans.Answered_On,
            status: ans.Is_Active === 1 ? "active" : "blocked",
          })),
        }));

        setQnaStats([
          { ...qnaStats[0], value: data.total || filteredQnAs.length },
          {
            ...qnaStats[1],
            value: filteredQnAs.filter((q) => q.status === "active").length,
          },
          {
            ...qnaStats[2],
            value: filteredQnAs.filter((q) => q.status === "blocked").length,
          },
        ]);
        setQnas(filteredQnAs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQnA();
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

  // Trigger modal for Question
  const handleModerateRequest = (type, questionId) => {
    setSelectedAction(type);
    setTargetId(questionId);
    setTargetAnswerId(null); // Ensure answer ID is cleared
    setModalOpen(true);
    setReason(
      type === "block"
        ? "Your question violated community guidelines."
        : "Your question was reinstated.",
    );
  };

  // Trigger modal for Answer
  const handleAnswerModerateRequest = (type, questionId, answerId) => {
    setSelectedAction(type);
    setTargetId(questionId);
    setTargetAnswerId(answerId); // Track the specific answer
    setModalOpen(true);
    setReason(
      type === "block"
        ? "Your reply has been hidden for violating community standards."
        : "Your reply has been reinstated.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine if we are sending an "answer" or "question" moderation request
      const endpointType = targetAnswerId ? "answer" : "question";
      const endpointId = targetAnswerId || targetId;

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/toggle-block`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: endpointType,
            id: endpointId,
            reason: reason,
          }),
        },
      );

      const data = await res.json();

      if (data.status) {
        // Update local state
        setQnas((prev) =>
          prev.map((q) => {
            if (q.id === targetId) {
              // Case 1: Moderating a specific answer
              if (targetAnswerId) {
                return {
                  ...q,
                  answers: q.answers.map((ans) =>
                    ans.id === targetAnswerId
                      ? {
                          ...ans,
                          status:
                            selectedAction === "block" ? "blocked" : "active",
                        }
                      : ans,
                  ),
                };
              }
              // Case 2: Moderating the whole question
              return {
                ...q,
                status: selectedAction === "block" ? "blocked" : "active",
              };
            }
            return q;
          }),
        );

        // Update stats ONLY if we moderated a question (we don't track answer stats in StatsRow)
        if (!targetAnswerId) {
          setQnaStats((prevStats) => {
            const newStats = [...prevStats];
            newStats[1].value = qnas.filter((q) =>
              q.id === targetId
                ? selectedAction !== "block"
                : q.status === "active",
            ).length;
            newStats[2].value = qnas.filter((q) =>
              q.id === targetId
                ? selectedAction === "block"
                : q.status === "blocked",
            ).length;
            return newStats;
          });
        }

        toast.success(
          `${targetAnswerId ? "Answer" : "Question"} successfully ${selectedAction}ed! Email sent.`,
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
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Q&A Moderation"
        subtitle="Review and manage user uploads"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={degreeOptions}
        subjectOptions={subjectOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setSubjectFilter}
      />
      <StatsRow stats={qnaStats} />
      <AdminQnAGrid
        qnas={qnas}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterSubject={subjectFilter}
        onModerate={handleModerateRequest}
        onModerateAnswer={handleAnswerModerateRequest}
      />

      <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleActionSubmit}
        actionType={selectedAction}
        targetType={targetAnswerId ? "Answer" : "Question"}
        reason={reason}
        setReason={setReason}
        loading={loading}
      />
    </section>
  );
};

export default AdminQnA;
