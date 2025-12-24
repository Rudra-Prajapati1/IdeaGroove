import React from "react";
import { useSelector } from "react-redux";
import { selectAnswerCountByQuestionId } from "../../redux/slice/answerSlice";

const QnACard = ({ question }) => {
  const answerCount = useSelector(selectAnswerCountByQuestionId(question.Q_ID));

  return (
    <div className="border-3 px-6 py-6 font-inter rounded-xl shadow-md hover:shadow-md/20 text-primary flex flex-col gap-3 hover:scale-103 duration-300">
      <p className="font-semibold tracking-wider text-lg">
        <span className="font-bold italic">Q.</span> {question.Question}
      </p>
      <div className="flex md:px-10 justify-between items-center md:items-end">
        <span className="font-semibold font-poppins text-sm">
          Total Answers: {answerCount}
        </span>
        <button
          type="submit"
          className="border-3 p-2 rounded-2xl font-bold bg-primary text-white text-xs md:text-sm cursor-pointer hover:bg-white hover:text-primary"
        >
          View All Answers
        </button>
      </div>
    </div>
  );
};

export default QnACard;
