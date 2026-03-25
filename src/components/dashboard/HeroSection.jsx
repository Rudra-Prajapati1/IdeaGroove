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
  Sparkles,
} from "lucide-react";
import { formatAcademicYear } from "../../utils/academicYear";
import GradientAvatar from "../common/GradientAvatar";

const HeroSection = ({ user, isPublic = false }) => {
  const displayName = user?.Name || "Explorer";
  const navigate = useNavigate();

  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.S_ID || currentUser?.id || null;
  const viewedUserId = user?.S_ID || user?.id || null;
  const collegeName = user?.College || user?.College_Name || "N/A";
  const degreeName = user?.Degree || user?.Degree_Name || "N/A";
  const hobbies = user?.Hobbies || user?.hobbies || [];
  const username = user?.Username ? `@${user.Username}` : null;
  const batchLabel = formatAcademicYear(user?.Year) || "N/A";
  const showMessageButton =
    isPublic && String(viewedUserId) !== String(currentUserId);
  const infoCardClass =
    "group flex h-full items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.08] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.12]";
  const hobbyChipClass =
    "rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-green-100 break-words [overflow-wrap:anywhere]";

  const handleDirectMessage = async () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    try {
      const res = await api.post("/chats/create-room", {
        receiver_id: user?.S_ID || user?.id,
        room_type: "direct",
      });
      const roomId = res.data?.roomId;
      navigate("/chats", {
        state: roomId ? { roomId } : null,
      });
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
            <>
              {username && (
                <p className="mb-5 text-lg font-medium tracking-wide text-green-100/90">
                  {username}
                </p>
              )}

              {showMessageButton && (
                <div className="mb-6 flex justify-center md:justify-start">
                  <button
                    onClick={handleDirectMessage}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.1] px-5 py-3 text-white shadow-[0_20px_45px_-28px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.16] active:scale-95"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm font-semibold">Message</span>
                  </button>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className={infoCardClass}>
                  <Mail className="text-green-300 w-5 h-5" />
                  <span className="text-sm lg:text-lg opacity-90 break-words">
                    {user?.Email || "abc@gmail.com"}
                  </span>
                </div>
                <div className={infoCardClass}>
                  <School className="text-green-300 w-5 h-5" />
                  <span className="text-sm lg:text-lg opacity-90">
                    {collegeName}
                  </span>
                </div>
                <div className={infoCardClass}>
                  <GraduationCap className="text-green-300 w-5 h-5" />
                  <span className="text-sm lg:text-lg opacity-90">
                    {degreeName}
                  </span>
                </div>
                <div className={infoCardClass}>
                  <Calendar className="text-green-300 w-5 h-5" />
                  <span className="text-base lg:text-lg opacity-90">
                    Batch of {batchLabel}
                  </span>
                </div>
                {hobbies.length > 0 && (
                  <div
                    className={`${infoCardClass} items-start sm:col-span-2 lg:col-span-3`}
                  >
                    <Sparkles className="text-green-300 w-5 h-5 mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-2 min-w-0">
                      {hobbies.map((hobby, i) => (
                        <span key={i} className={hobbyChipClass}>
                          {typeof hobby === "string" ? hobby : hobby.Hobby_Name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
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
            <div className="w-48 h-48 lg:w-60 lg:h-60 rounded-full overflow-hidden shadow-xl transition-all duration-500 hover:scale-105">
              <GradientAvatar
                name={displayName}
                imageSrc={user?.Profile_Pic}
                alt="User Profile"
                className="rounded-full grayscale-20 hover:grayscale-0 transition-all duration-500"
                textClassName="text-7xl lg:text-8xl uppercase"
              />
            </div>
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
