import React, { useEffect } from "react";
import GroupCard from "@/components/cards/GroupCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPreviewGroups,
  selectPreviewGroups,
  selectPreviewGroupsStatus,
  selectPreviewGroupsError,
} from "../../redux/slice/chatRoomsSlice";
import FilledTitle from "../common/FilledTitle";
import ShowMoreButton from "../common/ShowMoreButton";
import Loading from "../common/Loading";

const GroupSection = () => {
  const dispatch = useDispatch();

  const previewGroups = useSelector(selectPreviewGroups);
  const previewStatus = useSelector(selectPreviewGroupsStatus);
  const previewError = useSelector(selectPreviewGroupsError);

  useEffect(() => {
    if (previewStatus === "idle") {
      dispatch(fetchPreviewGroups());
    }
  }, [previewStatus, dispatch]);

  return (
    <section className="flex flex-col px-6 sm:px-10 py-8 items-center bg-[#FFFBEB]">
      <FilledTitle text="Groups" />

      {previewStatus === "loading" && <Loading text="Loading groups..." />}

      {previewStatus === "failed" && (
        <p className="text-red-500 mt-4">Error: {previewError}</p>
      )}

      {previewStatus === "succeeded" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {previewGroups?.length > 0 ? (
            previewGroups.map((group) => (
              <GroupCard key={group.Room_ID} group={group} />
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">
              No groups available
            </p>
          )}
        </div>
      )}

      <ShowMoreButton text="View More Groups" path="/groups" />
    </section>
  );
};

export default GroupSection;
