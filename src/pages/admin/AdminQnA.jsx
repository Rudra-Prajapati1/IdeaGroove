import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminQnAGrid from "../../components/admin/AdminQnAGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";
import {
  fetchAdminDegreeSubjectData,
  selectAdminDegreeOptions,
  selectAdminDegreeSubjectMap,
} from "../../redux/adminSlice/adminMetaSlice";
import {
  fetchAdminQna,
  moderateAdminQnaItem,
  selectAdminQna,
  selectAdminQnaActionStatus,
  selectAdminQnaStats,
} from "../../redux/adminSlice/adminQnaSlice";

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
  const dispatch = useDispatch();
  const qnas = useSelector(selectAdminQna);
  const qnaStats = useSelector(selectAdminQnaStats);
  const degreeOptions = useSelector(selectAdminDegreeOptions);
  const degreeSubjectMap = useSelector(selectAdminDegreeSubjectMap);
  const actionStatus = useSelector(selectAdminQnaActionStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [targetAnswerId, setTargetAnswerId] = useState(null); // New state to track if moderating an answer
  const [reason, setReason] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    dispatch(fetchAdminQna());
    dispatch(fetchAdminDegreeSubjectData());
  }, [dispatch]);

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

    try {
      await dispatch(
        moderateAdminQnaItem({
          action: selectedAction,
          targetType: targetAnswerId ? "answer" : "question",
          id: targetAnswerId || targetId,
          questionId: targetId,
          reason,
        }),
      ).unwrap();

      toast.success(
        `${targetAnswerId ? "Answer" : "Question"} successfully ${selectedAction}ed! Email sent.`,
      );
      setModalOpen(false);
      setReason("");
    } catch (err) {
      toast.error(err || "Something went wrong. Please try again.");
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
        loading={actionStatus === "loading"}
      />
    </section>
  );
};

export default AdminQnA;
