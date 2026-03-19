import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
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
            ></path>
          </svg>
        </div>
      </section>

      <div className="relative z-30 mx-auto -mt-24 flex max-w-7xl flex-col gap-4 px-4 sm:-mt-32 sm:gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#FFFBEB]/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="mb-4 text-3xl font-extrabold text-[#FFFBEB] sm:text-4xl lg:text-5xl">
          Terms and Condition
        </h1>
      </div>

      <div className="relative z-30 mx-auto mt-8 max-w-4xl px-4 sm:mt-10 sm:px-6">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-black/5">
          <div className="space-y-10 text-gray-700 leading-relaxed">
            {/* Section 1 */}
            <section>
              <div className="mb-4 flex items-center gap-4">
                <span className="bg-[#1A3C20] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  01
                </span>
                <h2 className="text-2xl font-bold text-[#1A3C20]">
                  Academic Disclaimer
                </h2>
              </div>
              <p className="pl-0 sm:pl-12">
                This website is developed strictly for{" "}
                <strong>academic purposes</strong> as part of a college project.
                All features, services, and products shown are simulations and
                not intended for actual commercial transactions.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="mb-4 flex items-center gap-4">
                <span className="bg-[#1A3C20] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  02
                </span>
                <h2 className="text-2xl font-bold text-[#1A3C20]">
                  User Conduct
                </h2>
              </div>
              <p className="pl-0 sm:pl-12">
                Users are encouraged to explore the site for testing purposes.
                However, any attempt to misuse the platform, upload harmful
                content, or bypass security features is strictly prohibited
                within the project scope.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <div className="mb-4 flex items-center gap-4">
                <span className="bg-[#1A3C20] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  03
                </span>
                <h2 className="text-2xl font-bold text-[#1A3C20]">
                  Data & Privacy
                </h2>
              </div>
              <p className="pl-0 sm:pl-12">
                We value your privacy. Any data entered into our forms is stored
                in a <strong>temporary database</strong>
                and will be purged once the project evaluation is complete. We
                do not share data with third parties.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <div className="mb-4 flex items-center gap-4">
                <span className="bg-[#1A3C20] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  04
                </span>
                <h2 className="text-2xl font-bold text-[#1A3C20]">
                  Intellectual Property
                </h2>
              </div>
              <p className="pl-0 sm:pl-12">
                The UI design, code, and original graphics are created by the
                project team. External assets (images/icons) are used under{" "}
                <strong>Fair Use</strong> for educational purposes or provided
                by open-source libraries.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TermsAndConditions;
