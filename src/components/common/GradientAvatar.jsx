import React from "react";

const GradientAvatar = ({
  name = "?",
  imageSrc = "",
  alt = "Avatar",
  className = "",
  textClassName = "",
}) => {
  const initial = String(name || "?").trim().charAt(0).toUpperCase() || "?";

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={`h-full w-full object-cover ${className}`.trim()}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-white ${className}`.trim()}
      aria-label={alt}
    >
      <span
        className={`bg-gradient-to-br from-[#1A3C20] to-[#4caf50] bg-clip-text font-black text-transparent ${textClassName}`.trim()}
      >
        {initial}
      </span>
    </div>
  );
};

export default GradientAvatar;
