import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Background Section */}
      <section className="relative bg-[#1A3C20] pb-28 pt-32 sm:pb-36 sm:pt-40">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="block h-[72px] w-full sm:h-[100px]"
          >
            <path
              fill="#FFFBEB"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Title Section */}
      <div className="relative z-30 mx-auto -mt-24 flex max-w-7xl flex-col gap-4 px-4 sm:-mt-32 sm:gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#FFFBEB]/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-3xl font-extrabold text-[#FFFBEB] sm:text-4xl lg:text-5xl">
          {title}
        </h1>
      </div>
    </>
  );
};

export default PageHeader;
