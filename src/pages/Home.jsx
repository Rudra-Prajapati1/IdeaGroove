import React from "react";
import HeroSection from "../components/home/HeroSection";
import EventSection from "../components/home/EventSection";
import GroupSection from "../components/home/GroupSection";
import QnASection from "../components/home/QnASection";
import NotesSection from "../components/home/NotesSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <EventSection />
      <GroupSection />
      <QnASection />
      <NotesSection />
    </div>
  );
};

export default Home;
