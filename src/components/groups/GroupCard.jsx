import React from "react";
import group_temp_image from "/images/group_temp_image.jpg";

const GroupCard = () => {
  return (
    <div
      className="border-3 border-primary text-primary font-inter py-6 px-4 rounded-2xl
    w-full max-w-[20rem] mx-auto"
    >
      <img
        src={group_temp_image}
        alt=""
        className="rounded-full h-40 w-40 object-cover"
      />
    </div>
  );
};

export default GroupCard;
