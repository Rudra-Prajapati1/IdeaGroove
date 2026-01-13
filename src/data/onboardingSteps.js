import thinking from "../assets/lottie/Thinking.json";
import welcome from "../assets/lottie/Welcome.json";
import events from "../assets/lottie/Education Apps.json";
import notes from "../assets/lottie/Animation - 1710963435621.json";
import qa from "../assets/lottie/Question and Answer.json";
import groups from "../assets/lottie/Group of people communicating.json";

export const onboardingSteps = [
  {
    id: 1,
    lottie: thinking,
    title: "One Place for Everything",
    text: "Ever wished there was one place for education, activities, and student life?",
    type: "problem",
  },
  {
    id: 2,
    lottie: welcome,
    title: "Meet IdeaGroove",
    text: "IdeaGroove brings everything together in one simple platform.",
    showLogo: true,
  },
  {
    id: 3,
    lottie: groups,
    title: "Groups & Chats",
    text: "Create groups, chat instantly, and collaborate with classmates.",
  },
  {
    id: 4,
    lottie: notes,
    title: "Notes & Doubts",
    text: "Share notes, ask doubts, and learn together as a community.",
  },
  {
    id: 5,
    lottie: events,
    title: "Events & Activities",
    text: "Stay updated with events, activities, and announcements.",
  },
  {
    id: 6,
    lottie: qa,
    title: "Questions & Answers",
    text: "Ask questions and get real answers from students who've been there.",
  },
  {
    id: 7,
    lottie: welcome,
    title: "All in One Place",
    text: "Everything you need — education, community, and growth.",
    showLogo: true,
  },
];
