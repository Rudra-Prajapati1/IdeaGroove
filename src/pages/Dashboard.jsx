import React, { useEffect, useState } from "react";
import HeroSection from "../components/dashboard/HeroSection";
import ActivitySection from "../components/dashboard/ActivitySection";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slice/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { id } = useParams(); // Get ID from URL if viewing someone else
  const currentUser = useSelector(selectUser);
  const navigate = useNavigate();

  const [displayUser, setDisplayUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SCENARIO 1: Viewing someone else's profile
    if (id) {
      const fetchOtherProfile = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `http://localhost:8080/api/students/profile/${id}`,
          );
          setDisplayUser(res.data);
        } catch (err) {
          toast.error("User profile not found.");
          navigate("/dashboard", { replace: true });
        } finally {
          setLoading(false);
        }
      };
      fetchOtherProfile();
    }
    // SCENARIO 2: Viewing your own dashboard
    else {
      if (!currentUser) {
        navigate("/auth", { replace: true });
      } else {
        setDisplayUser(currentUser);
        setLoading(false);
      }
    }
  }, [id, currentUser, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <HeroSection user={displayUser} isPublic={!!id} />
      <div className="max-w-9xl mx-auto pb-12">
        <ActivitySection userId={displayUser?.S_ID} isPublic={!!id} />
      </div>
    </main>
  );
};

export default Dashboard;

// import React, { useEffect } from "react";
// import HeroSection from "../components/dashboard/HeroSection";
// import ActivitySection from "../components/dashboard/ActivitySection";
// import { useSelector } from "react-redux";
// import { selectUser } from "../redux/slice/authSlice";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const currentUser = useSelector(selectUser);
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!currentUser) {
//       // Use replace: true so the user can't "Go Back" into the empty dashboard
//       navigate("/auth", { replace: true });
//     }
//   }, [currentUser, navigate]);

//   if (!currentUser) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <HeroSection user={currentUser} />
//       <div className="max-w-9xl mx-auto pb-12">
//         <ActivitySection />
//       </div>
//     </main>
//   );
// };

// export default Dashboard;
