import React from "react";
import { useSelector } from "react-redux";
import { selectAnswerCountByQuestionId } from "../../redux/slice/answerSlice";

const QnACard = ({ question }) => {
  const answerCount = useSelector(selectAnswerCountByQuestionId(question.Q_ID));

  return (
    <div className="border-3 px-6 py-6 font-inter rounded-xl text-primary flex flex-col gap-3">
      <p className="font-bold tracking-wider text-lg">Q. {question.Question}</p>
      <div className="flex px-10 justify-between items-end">
        <span className="font-semibold font-poppins text-sm">
          Total Answers: {answerCount}
        </span>
        <button
          type="submit"
          className="border-3 p-2 rounded-2xl font-bold bg-primary text-white text-sm cursor-pointer hover:bg-white hover:text-primary"
        >
          View All Answers
        </button>
      </div>
    </div>
  );
};

export default QnACard;
