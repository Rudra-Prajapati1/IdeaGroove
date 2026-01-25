import React from "react";
import DiscussionForum from "../components/dashboard/DiscussionForum";
import FilledTitle from "../components/FilledTitle";
import { ArrowLeft } from "lucide-react";

const QnA = () => {
  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <section className="relative bg-[#1A3C20] pt-40 pb-50">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="block w-full h-[100px]"
          >
            <path
              fill="#FFFBEB"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto -mt-50 relative z-30 px-0.01 flex gap-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#FFFBEB]/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-5xl font-extrabold mb-4 text-[#FFFBEB]">
         QnA
        </h1>
      </div>

    <div className="mx-auto px-6 relative z-30 mt-10">
        <DiscussionForum />
    </div>
    </div>
  );
};

export default QnA;
