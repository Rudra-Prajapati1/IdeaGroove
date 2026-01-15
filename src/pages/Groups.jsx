import React, { useEffect } from "react";
import FilledTitle from "../components/FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRooms,
  selectAllChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
} from "../redux/slice/chatRoomsSlice";
import GroupCard from "../components/groups/GroupCard";

const Groups = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectAllChatRooms);
  const groupsStatus = useSelector(selectChatRoomStatus);
  const groupsError = useSelector(selectChatRoomError);

  useEffect(() => {
    if (groupsStatus === "idle") {
      dispatch(fetchChatRooms());
    }
  }, [groupsStatus, dispatch]);
  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
    {/* Hero Section */}
    <section className="relative bg-[#1A3C20] pt-40 pb-32">
      <div className="max-w-6xl mx-auto px-4 relative z-30">
        <h1 className="text-5xl font-extrabold text-[#FFFBEB]">Groups</h1>
      </div>
      
      {/* Wave SVG */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[100px]">
          <path fill="#FFFBEB" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
      <div className="w-10/12 m-auto bg-white px-12 py-12 rounded-2xl">
        <div>
          {groupsStatus === "loading" && <p>Loading Groups...</p>}
          {groupsStatus === "failed" && <p>Error: {groupsError}</p>}
          {groupsStatus === "succeeded" && (
            <>
              {groups.length === 0 ? (
                <p className="text-center py-8 text-teal-200">
                  No Groups Found
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groups.map((group) => (
                    <GroupCard key={group.G_ID} group={group} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;
