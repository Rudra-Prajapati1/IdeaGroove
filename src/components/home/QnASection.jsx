import React, { useEffect } from "react";
import QnACard from "../cards/QnACard";
import FilledTitle from "../common/FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  selectQuestionsError,
  selectQuestionsStatus,
} from "../../redux/slice/questionsSlice";
import {
  fetchAnswers,
  selectAnswersStatus,
} from "../../redux/slice/answerSlice";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import ShowMoreButton from "../common/ShowMoreButton";
import Loading from "../common/Loading";

// --- Mock Data (As provided) ---
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

const QnASection = () => {
  const dispatch = useDispatch();

  const status = useSelector(selectQuestionsStatus);
  const answerStatus = useSelector(selectAnswersStatus);
  const error = useSelector(selectQuestionsError);
  const isAuth = useSelector(selectIsAuthenticated);

  const MOCK_CURRENT_USER_NAME = "Jessica S.";

  const displayQuestions = MOCK_DISCUSSIONS;

  useEffect(() => {
    if (status === "idle") dispatch(fetchQuestions());
  }, [status, dispatch]);

  useEffect(() => {
    if (answerStatus === "idle") dispatch(fetchAnswers());
  }, [answerStatus, dispatch]);

  // Handlers
  const handleEditPost = (postId) => console.log("Edit Post ID:", postId);
  const handleDeletePost = (postId) => {
    if (window.confirm("Delete this discussion?")) {
      console.log("Delete Post ID:", postId);
    }
  };

  return (
    <section className="flex flex-col px-6 sm:px-10 py-8 items-center bg-[#FFFBEB]">
      <FilledTitle text="QnA" />

      {/* Show loading only if you want to wait for real data, 
          otherwise, the mock data shows instantly */}
      {status === "loading" && <Loading text="loading questions" />}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}

      <div className="flex flex-col gap-5 w-full md:w-[60%] mt-10">
        {/* Mapping over MOCK_DISCUSSIONS */}
        {displayQuestions.slice(0, 3).map((post) => (
          <QnACard
            key={post.id}
            post={post}
            isAuth={isAuth}
            currentUser={MOCK_CURRENT_USER_NAME}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      <ShowMoreButton text="View More Questions" path="/qna" />
    </section>
  );
};

export default QnASection;
