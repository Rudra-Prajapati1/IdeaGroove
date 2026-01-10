import React from "react";

const SectionWrapper = ({ title, children }) => (
  <fieldset className="border-3 p-6 rounded-xl w-[85%] border-primary">
    <legend className="text-2xl text-primary font-bold">{title}</legend>
    <div className="flex flex-col gap-6">{children}</div>
  </fieldset>
);

export default SectionWrapper;
