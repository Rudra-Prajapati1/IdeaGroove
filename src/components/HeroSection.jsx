import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CloudLightning,
  Lightbulb,
  LucideFlashlight,
  Pencil,
  Sparkle,
  Sparkles,
} from "lucide-react";

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative bg-[#1D4E1A] max-h-max">
      <div className="flex flex-col gap-5 items-center py-50">
        <img
          alt="IdeaGroove Logo with a title text and arrows with a light bub and a stack of books"
          src="./Logo.png"
          className={`border-4 border-[#fff2cc] rounded-2xl h-60 w-70 transition-all duration-500 ${
            scrolled
              ? "translate-y-[-200px] opacity-0 scale-50"
              : "translate-y-0 opacity-100 scale-100"
          }`}
        />
        <h1 className="font-poppins text-3xl text-white font-semibold">
          CONNECT ● COLLABORATIVE ● CONTRIBUTE
        </h1>
        <span className="absolute block w-full h-[200px] animate-bounce">
          <Lightbulb className="h-12 w-12 absolute top-[50px] left-20 rotate-[-25deg] text-[#fff2cc] animate-wiggle" />
          <BookOpen className="h-14 w-14 absolute top-5 right-50 rotate-45 text-[#fff2cc] animate-wiggle" />

          <Pencil className="h-10 w-10 absolute top-80 left-50 rotate-15deg text-[#fff2cc] animate-wiggle" />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block w-full h-[120px]"
        >
          <path
            fill="white"
            d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,74.7C672,75,768,53,864,42.7C960,32,1056,32,1152,42.7C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
