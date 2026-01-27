import React from "react";
import DiscussionForum from "../components/dashboard/DiscussionForum";
import FilledTitle from "../components/FilledTitle";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../components/PageHeader";

// --- Configuration Data ---
const DEGREE_SUBJECTS = {
  "Computer Science": [
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Operating Systems",
  ],
  Mathematics: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math"],
  Engineering: ["Thermodynamics", "Circuit Theory", "Mechanics", "Robotics"],
  Business: ["Marketing", "Finance", "Economics", "Management"],
};

// --- Mock Data ---
const MOCK_DISCUSSIONS = [
  {
    id: 1,
    author: "Prof. H. Smith",
    time: "2h ago",
    title: "Clarification on Project Submission Guidelines",
    excerpt: "Please ensure that all repositories are public...",
    degree: "Computer Science",
    subject: "Web Development",
    pinned: true,
    avatarColor: "bg-green-100",
    answers: [
      {
        id: 101,
        author: "Sarah J.",
        time: "1h ago",
        text: "Does this apply to group projects?",
        votes: 5,
      },
    ],
  },
  {
    id: 2,
    author: "Jessica S.",
    time: "45m ago",
    title: "Help needed with Linear Algebra Eigenvalues",
    excerpt: "I'm struggling to understand the geometric interpretation...",
    degree: "Mathematics",
    subject: "Linear Algebra",
    pinned: false,
    avatarColor: "bg-blue-100",
    answers: [],
  },
  {
    id: 3,
    author: "Michael P.",
    time: "3h ago",
    title: "Thermodynamics: Second Law confusion",
    excerpt: "Can someone explain entropy in a closed system...",
    degree: "Engineering",
    subject: "Thermodynamics",
    pinned: false,
    avatarColor: "bg-orange-100",
    answers: [],
  },
];

const QnA = () => {
  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="QnA" />

      <div className="mx-auto px-6 relative z-30 mt-10">
        <DiscussionForum
          MOCK_DISCUSSIONS={MOCK_DISCUSSIONS}
          DEGREE_SUBJECTS={DEGREE_SUBJECTS}
        />
      </div>
    </div>
  );
};

export default QnA;
