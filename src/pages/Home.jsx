import React from "react";
import HeroSection from "../components/home/HeroSection";
import EventSection from "../components/home/EventSection";
import GroupSection from "../components/home/GroupSection";
import QnASection from "../components/home/QnASection";
import NotesSection from "../components/home/NotesSection";
import { Search } from "lucide-react";
import SearchSection from "../components/home/SearchSection";

const Home = () => {
  return (
    <main className="bg-[#FFFBEB] min-h-screen">
      <HeroSection />
      <SearchSection />
      <EventSection />
      <GroupSection />
      <QnASection />
      <NotesSection />
    </main>
  );
};

export default Home;
