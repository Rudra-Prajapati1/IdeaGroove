import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Mail,
  MessageCircle,
  School,
} from "lucide-react";

const HeroSection = ({ user, isPublic = false }) => {
  const displayName = user?.Name || "Explorer";
  const userInitial = displayName.charAt(0);
  const navigate = useNavigate();

  const currentUser = useSelector(selectUser);

  const handleDirectMessage = async () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    try {
      await api.post("/chats/create-room", {
        receiver_id: user?.S_ID || user?.id,
        room_type: "direct",
      });
      navigate("/chats");
    } catch (err) {
      console.error("DM error:", err);
      navigate("/chats");
    }
  };

  return (
    <section className="relative bg-linear-to-br from-[#1B431C] via-[#235324] to-[#153416] min-h-[500px] flex flex-col justify-center overflow-hidden">
      <div className="absolute top-8 left-8 z-50">
        <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-[#FFFBEB]/80 hover:text-white transition-colors"
>
  <ArrowLeft size={20} /> Back
</button>
      </div>
      {/* Decorative Background Circles */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-green-400/10 rounded-full blur-2xl" />

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center px-8 sm:px-16 z-10 gap-12">
        {/* Text Content */}
        <div className="text-white flex-1 text-center md:text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-green-200 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
            {isPublic ? "Student Profile" : "Personal Dashboard"}
          </span>

          <h1 className="capitalize text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="text-5xl font-light">
              {isPublic ? "Meet," : "Hi,"}
            </span>
            <span className="text-green-300"> {displayName}</span>
          </h1>

          {/* Conditional Rendering based on isPublic */}
          {isPublic ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <Mail className="text-green-400 w-5 h-5" />
                <span className="text-sm lg:text-lg opacity-90">
                  {user?.Email || "abc@gmail.com"}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <School className="text-green-400 w-5 h-5" />
                <span className="text-sm lg:text-lg opacity-90">
                  {user?.College || "St. Xavier's College, Ahmedabad"}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <GraduationCap className="text-green-400 w-5 h-5" />
                <span className="text-sm lg:text-lg opacity-90">
                  {user?.Degree || "BCA"}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
  <Calendar className="text-green-400 w-5 h-5" />
  <span className="text-base lg:text-lg opacity-90">
    Batch of 2026
  </span>
</div>

{/* Hobbies - full width */}
{user?.Hobbies?.length > 0 && (
  <div className="sm:col-span-2 flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
    <GraduationCap className="text-green-400 w-5 h-5 mt-0.5 shrink-0" />
    <div className="flex flex-wrap gap-2">
      {user.Hobbies.map((hobby, i) => (
        <span
          key={i}
          className="px-3 py-1 bg-white/10 text-green-200 text-xs font-semibold rounded-full border border-white/10"
        >
          {typeof hobby === "string" ? hobby : hobby.Hobby_Name}
        </span>
      ))}
    </div>
  </div>
)}
              {isPublic &&
                String(user?.S_ID || user?.id) !== String(currentUser?.id) && (
                  <button
                    onClick={handleDirectMessage}
                    className="flex items-center w-[30%] gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all active:scale-95 shadow-lg"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm font-medium">Message</span>
                  </button>
                )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xl lg:text-2xl font-light opacity-90 leading-relaxed">
                Welcome to your collective space.
              </p>
              <p className="text-lg lg:text-xl font-light opacity-80 italic">
                This is your hub to share and grow.
              </p>
            </div>
          )}
        </div>

        {/* Profile Image */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-green-400 to-emerald-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-[#1B431C] rounded-full p-2 border border-white/20 shadow-2xl">
            {user?.Profile_Pic ? (
              <img
                src={user?.Profile_Pic}
                alt="User Profile"
                className="w-48 h-48 lg:w-60 lg:h-60 rounded-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="w-48 h-48 lg:w-60 lg:h-60 rounded-full bg-green-500 flex items-center justify-center text-white text-7xl lg:text-8xl font-bold uppercase shadow-xl transition-all duration-500 hover:scale-105">
                {userInitial}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wave SVG Container */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 z-0">
        <svg
          viewBox="0 0 1440 320"
          className="relative block w-full h-20 sm:h-[120px] lg:h-[150px] -mb-px text-white fill-current"
          preserveAspectRatio="none"
        >
          <path
            fill="#fffbeb"
            d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,144C672,128,768,128,864,154.7C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
