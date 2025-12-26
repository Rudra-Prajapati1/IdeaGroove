import React from "react";

const ActivitySection = () => {
  const optionList = [
    {
      key: 1,
      label: "Events",
    },
    {
      key: 2,
      label: "Groups",
    },
    {
      key: 3,
      label: "QnA",
    },
    {
      key: 4,
      label: "Notes",
    },
  ];
  // const [option, setOption] = useState(optionList[0]);

  return (
    <section>
      <div className="text-primary py-4 px-16 mt-4">
        <div className="flex flex-row items-center justify-between w-9/10 lg:h-50 md:h-30 sm:h-10 m-auto">
          {optionList.map((op) => (
            <div
              key={op.key}
              className="cursor-pointer flex items-center justify-center lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl font-thin w-1/5 h-full border-2 border-primary rounded-lg hover:lg:shadow-2xl hover:md:shadow-xl"
            >
              {op.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitySection;
