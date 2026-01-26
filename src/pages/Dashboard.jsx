import React, { useEffect } from "react";
import HeroSection from "../components/dashboard/HeroSection";
import ActivitySection from "../components/dashboard/ActivitySection";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const currentUser = useSelector(selectUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      // Use replace: true so the user can't "Go Back" into the empty dashboard
      navigate("/auth", { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <HeroSection user={currentUser} />
      <div className="max-w-9xl mx-auto pb-12">
        <ActivitySection />
      </div>
    </main>
  );
};

export default Dashboard;
