import React from "react";
import { ArrowLeft, Database, Eye, ShieldCheck, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicies = () => {
  const navigate = useNavigate();

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

      {/* Kept your exact CSS classes for title and back button */}
      <div className="max-w-7xl mx-auto -mt-50 relative z-30 px-0.01 flex gap-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#FFFBEB]/80 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-5xl font-extrabold mb-4 text-[#FFFBEB]">
          Privacy Policies
        </h1>
      </div>

      {/* Main Content Card - Professional Content Edition */}
      <div className="max-w-4xl mx-auto px-6 relative z-30 mt-10">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-black/5">
          <div className="space-y-12 text-gray-700 leading-relaxed">
            
            {/* 1. Information Collection */}
            <section className="flex flex-col md:flex-row gap-6">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl h-fit w-fit">
                <Database className="text-[#1A3C20]" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1A3C20] mb-3">1. Data Collection & Usage</h2>
                <p>
                  We collect personal information that you provide directly to us through our web forms. 
                  This may include your name, email address, and any feedback provided. We also 
                  automatically collect certain technical data, such as IP addresses and browser types, 
                  to ensure the stability and security of our platform.
                </p>
              </div>
            </section>

            {/* 2. Cookies and Tracking */}
            <section className="flex flex-col md:flex-row gap-6">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl h-fit w-fit">
                <Eye className="text-[#1A3C20]" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1A3C20] mb-3">2. Cookies and Analytics</h2>
                <p>
                  Our website utilizes essential cookies to enhance user experience and analyze site 
                  traffic. These cookies help us understand user behavior, allowing us to improve 
                  navigation and content delivery. You can manage your cookie preferences through 
                  your browser settings at any time.
                </p>
              </div>
            </section>

            {/* 3. Data Protection */}
            <section className="flex flex-col md:flex-row gap-6">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl h-fit w-fit">
                <Lock className="text-[#1A3C20]" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1A3C20] mb-3">3. Information Security</h2>
                <p>
                  We implement industry-standard administrative and technical security measures 
                  designed to protect your personal information from unauthorized access, loss, 
                  or disclosure. While we strive to protect your data, no method of transmission 
                  over the internet is 100% secure.
                </p>
              </div>
            </section>

            {/* 4. User Rights */}
            <section className="flex flex-col md:flex-row gap-6">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl h-fit w-fit">
                <ShieldCheck className="text-[#1A3C20]" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1A3C20] mb-3">4. Your Privacy Rights</h2>
                <p>
                  Under applicable data protection laws, you have the right to access, correct, 
                  or delete your personal information stored in our systems. If you wish to 
                  exercise these rights or have concerns regarding your data, please contact 
                  our project administration team.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicies;