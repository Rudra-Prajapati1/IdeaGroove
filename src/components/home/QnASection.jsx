import React, { useEffect } from "react";
import QnACard from "../cards/QnACard";
import FilledTitle from "../common/FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPreviewQnA,
  selectPreviewQnA,
  selectPreviewQnAStatus,
  selectPreviewQnAError,
} from "../../redux/slice/qnaSlice";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import ShowMoreButton from "../common/ShowMoreButton";
import Loading from "../common/Loading";

const QnASection = () => {
  const dispatch = useDispatch();

  const previewQnA = useSelector(selectPreviewQnA);
  const previewStatus = useSelector(selectPreviewQnAStatus);
  const previewError = useSelector(selectPreviewQnAError);
  const isAuth = useSelector(selectIsAuthenticated);

  

  useEffect(() => {
    if (previewStatus === "idle") {
      console.log(previewStatus);
      dispatch(fetchPreviewQnA());
      const s =(state)=>console.log(state);
      console.log(s);
    }
  }, [previewStatus, dispatch]);


  return (
    <section className="flex flex-col px-6 sm:px-10 py-8 items-center bg-[#FFFBEB]">
      <FilledTitle text="QnA" />

      {previewStatus === "loading" && <Loading text="loading questions..." />}
      {previewStatus === "failed" && (
        <p className="text-red-500">Error: {previewError}</p>
      )}

      {previewStatus === "succeeded" && (
        <div className="flex flex-col gap-5 w-full md:w-[60%] mt-10">
          {previewQnA?.length > 0 ? (
            previewQnA.map((QnA) => (
              <QnACard key={QnA.Q_ID} post={QnA} isAuth={isAuth} />
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">
              No QnA available
            </p>
          )}
        </div>
      )}

      <ShowMoreButton text="View More Questions" path="/qna" />
    </section>
  );
};

export default QnASection;
