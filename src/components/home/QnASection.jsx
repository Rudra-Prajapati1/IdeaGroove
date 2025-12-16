import React, { useEffect } from "react";
import QnACard from "../qna/QnACard";
import FilledTitle from "../FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  selectAllQuestions,
  selectQuestionsError,
  selectQuestionsStatus,
} from "../../redux/slice/questionsSlice";
import {
  fetchAnswers,
  selectAnswersStatus,
} from "../../redux/slice/answerSlice";

const QnASection = () => {
  const dispatch = useDispatch();

  const questions = useSelector(selectAllQuestions);

  const status = useSelector(selectQuestionsStatus);
  const answerStatus = useSelector(selectAnswersStatus);
  const error = useSelector(selectQuestionsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuestions());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (answerStatus === "idle") {
      dispatch(fetchAnswers());
    }
  }, [answerStatus, dispatch]);

  return (
    <section className="flex flex-col px-10 py-8 items-center">
      <FilledTitle text="QnA" />

      {status === "loading" && <p>Loading questions...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="flex flex-col gap-5 w-[90%] md:w-[60%] mt-10">
        {status === "succeeded" &&
          questions
            .slice(0, 3)
            .map((question) => (
              <QnACard key={question.Q_ID} question={question} />
            ))}
      </div>
    </section>
  );
};

export default QnASection;
