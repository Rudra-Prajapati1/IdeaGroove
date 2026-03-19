import React from "react";

const SectionWrapper = ({ title, children }) => (
  <fieldset className="w-full rounded-xl border-3 border-primary p-4 sm:w-[92%] sm:p-6">
    <legend className="px-2 text-xl font-bold text-primary sm:text-2xl">
      {title}
    </legend>
    <div className="flex flex-col gap-6">{children}</div>
  </fieldset>
);

export default SectionWrapper;
