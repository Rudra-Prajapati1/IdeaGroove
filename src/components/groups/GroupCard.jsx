import React from "react";
import group_temp_image from "/images/group_temp_image.jpg";

const GroupCard = ({ group }) => {
  return (
    <div
      className="border-3 border-primary text-primary font-inter py-6 px-8 rounded-2xl
    w-full max-w-100 mx-auto"
    >
      <div className="flex items-center gap-4">
        <img
          src={group_temp_image}
          alt={group.Room_Name}
          className="rounded-full h-30 w-30 object-cover border-2"
        />
        <div>
          <h3 className="font-semibold font-poppins text-xl">
            {group.Room_Name}
          </h3>
          <p>
            Hobby: <span>{group.Based_On}</span>
          </p>
        </div>
      </div>
      <div className="w-max mt-5">
        <p className="font-semibold">Created By: {group.Created_By}</p>
        <p className="font-semibold">
          Created On: {new Date(group.Created_On).toLocaleDateString()}
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <button className="border-3 p-3 rounded-2xl font-bold bg-primary text-white text-sm cursor-pointer hover:bg-white hover:text-primary">
          Join Group
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
