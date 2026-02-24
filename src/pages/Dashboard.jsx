import React, { useEffect, useState } from "react";
import HeroSection from "../components/dashboard/HeroSection";
import ActivitySection from "../components/dashboard/ActivitySection";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsAuthenticated } from "../redux/slice/authSlice";
import {
  fetchUserEvents,
  selectUserEvents,
  selectUserEventsStatus,
} from "../redux/slice/eventsSlice";
import {
  fetchUserGroups,
  selectUserGroupsStatus,
} from "../redux/slice/chatRoomsSlice";
import {
  fetchUserNotes,
  selectUserNotesStatus,
} from "../redux/slice/notesSlice";
import {
  fetchUserQuestions,
  selectUserQuestionsStatus,
} from "../redux/slice/qnaSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const [displayUser, setDisplayUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const events = useSelector(selectUserEvents);

  // User-specific statuses
  const eventsStatus = useSelector(selectUserEventsStatus);
  const groupsStatus = useSelector(selectUserGroupsStatus);
  const notesStatus = useSelector(selectUserNotesStatus);
  const qnaStatus = useSelector(selectUserQuestionsStatus);

  useEffect(() => {
    if (isAuthenticated && currentUser?.S_ID) {
      const userId = currentUser.S_ID;
      if (eventsStatus === "idle")
        dispatch(fetchUserEvents({ userId, page: 1, limit: 20 }));
      console.log(events);
      if (groupsStatus === "idle")
        dispatch(fetchUserGroups({ userId, page: 1, limit: 20 }));
      if (notesStatus === "idle")
        dispatch(fetchUserNotes({ userId, page: 1, limit: 20 }));
      if (qnaStatus === "idle") dispatch(fetchUserQuestions(userId));
    }
  }, [
    isAuthenticated,
    currentUser,
    eventsStatus,
    groupsStatus,
    notesStatus,
    qnaStatus,
    dispatch,
  ]);

  useEffect(() => {
    if (id) {
      // fetch other profile
      const fetchOtherProfile = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `http://localhost:3000/api/students/profile/${id}`,
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
    } else {
      if (!currentUser) {
        navigate("/auth", { replace: true });
      } else {
        setDisplayUser(currentUser);
        setLoading(false);
      }
    }
  }, [id, currentUser, navigate]);

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
        <ActivitySection userId={displayUser?.S_ID} isPublic={!!id} />
      </div>
    </main>
  );
};

export default Dashboard;
