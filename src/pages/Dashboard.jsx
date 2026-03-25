import React, { useEffect, useState } from "react";
import HeroSection from "../components/dashboard/HeroSection";
import ActivitySection from "../components/dashboard/ActivitySection";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuthSessionChecked,
  selectUser,
} from "../redux/slice/authSlice";
import { fetchUserEvents } from "../redux/slice/eventsSlice";
import { fetchUserGroups } from "../redux/slice/chatRoomsSlice";
import { fetchUserNotes } from "../redux/slice/notesSlice";
import { fetchUserQuestions } from "../redux/slice/qnaSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api/axios";

const USER_ACTIVITY_LIMIT = 1000;

const Dashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const sessionChecked = useSelector(selectAuthSessionChecked);
  const navigate = useNavigate();

  const [displayUser, setDisplayUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const targetUserId = id
    ? displayUser?.S_ID || displayUser?.id || null
    : currentUser?.S_ID || currentUser?.id || null;

  useEffect(() => {
    if (!targetUserId) {
      return;
    }

    dispatch(
      fetchUserEvents({
        userId: targetUserId,
        page: 1,
        limit: USER_ACTIVITY_LIMIT,
      }),
    );
    dispatch(
      fetchUserGroups({
        userId: targetUserId,
        page: 1,
        limit: USER_ACTIVITY_LIMIT,
      }),
    );
    dispatch(
      fetchUserNotes({
        userId: targetUserId,
        page: 1,
        limit: USER_ACTIVITY_LIMIT,
      }),
    );
    dispatch(fetchUserQuestions(targetUserId));
  }, [dispatch, targetUserId]);

  useEffect(() => {
    if (id) {
      // fetch other profile
      const fetchOtherProfile = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/students/profile/${id}`);
          setDisplayUser(res.data);
        } catch (err) {
          toast.error("User profile not found.");
          navigate("/dashboard", { replace: true });
        } finally {
          setLoading(false);
        }
      };
      fetchOtherProfile();
    } else {
      if (!sessionChecked) {
        setLoading(true);
      } else if (!currentUser) {
        navigate("/auth", { replace: true });
      } else {
        setDisplayUser(currentUser);
        setLoading(false);
      }
    }
  }, [id, currentUser, navigate, sessionChecked]);

  if (loading || !displayUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffbeb]">
      <HeroSection user={displayUser} isPublic={!!id} />
      <div className="max-w-9xl mx-auto pb-12">
        <ActivitySection
          userId={displayUser?.S_ID || displayUser?.id}
          isPublic={!!id}
        />
      </div>
    </main>
  );
};

export default Dashboard;
