import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQnA,
  selectAllQnA,
  selectQnAStatus,
  selectQnAError,
  selectQnAPagination,
} from "../redux/slice/qnaSlice";

import DiscussionForum from "../components/dashboard/DiscussionForum";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";

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

const QnA = () => {
  const dispatch = useDispatch();

  const qnaData = useSelector(selectAllQnA);
  const status = useSelector(selectQnAStatus);
  const error = useSelector(selectQnAError);
  const { totalPages } = useSelector(selectQnAPagination);

  const [currentPage, setCurrentPage] = useState(1);

  /* ===== FETCH ON PAGE CHANGE ===== */
  useEffect(() => {
    dispatch(fetchQnA({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  /* ===== GROUP ANSWERS BY QUESTION ===== */
  const groupedDiscussions = useMemo(() => {
    const map = {};

    qnaData.forEach((row) => {
      if (!map[row.Q_ID]) {
        map[row.Q_ID] = {
          id: row.Q_ID,
          author: row.Question_Author,
          askedOn: row.Added_On,
          title: row.Question,
          subject: "",
          avatarColor: "bg-green-100",
          answers: [],
        };
      }

      if (row.A_ID) {
        map[row.Q_ID].answers.push({
          id: row.A_ID,
          author: row.Answer_Author,
          text: row.Answer,
          time: row.Answered_On,
        });
      }
    });

    return Object.values(map);
  }, [qnaData]);

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="QnA" />

      <div className="mx-auto px-6 relative z-30 mt-10">
        {status === "loading" && <Loading text="Loading discussions..." />}

        {status === "failed" && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {status === "succeeded" && (
          <>
            <DiscussionForum discussions={groupedDiscussions} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QnA;
