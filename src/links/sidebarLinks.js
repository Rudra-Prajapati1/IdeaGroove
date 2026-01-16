import {
  Calendar,
  MessageCircleQuestion,
  MessageSquare,
  NotebookPen,
  User,
  Users,
} from "lucide-react";

export const sidebarLinks = [
  { id: 1, title: "User", icon: User, to: "/admin" },
  { id: 2, title: "Notes", icon: NotebookPen, to: "/admin/notes" },
  { id: 3, title: "Events", icon: Calendar, to: "/admin/events" },
  { id: 4, title: "Groups", icon: Users, to: "/admin/groups" },
  { id: 5, title: "QnA", icon: MessageSquare, to: "/admin/qna" },
  {
    id: 6,
    title: "Complaints",
    icon: MessageCircleQuestion,
    to: "/admin/complaints",
  },
];
