import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import Events from "./pages/Events";
import Chats from "./pages/Chats";
import Login from "./pages/Login";
import QnA from "./pages/QnA";
import Notes from "./pages/Notes";
import Groups from "./pages/Groups";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/qna" element={<QnA />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </main>
  );
};

export default App;
