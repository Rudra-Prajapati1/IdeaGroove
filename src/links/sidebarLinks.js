import {
  Calendar,
  LayoutDashboardIcon,
  MessageCircleQuestion,
  MessageSquare,
  NotebookPen,
  User,
  Users,
} from "lucide-react";

export const sidebarLinks = [
  { id: 1, title: "Dashboard", icon: LayoutDashboardIcon, to: "/admin" },
  { id: 2, title: "User", icon: User, to: "/admin/users" },
  { id: 3, title: "Notes", icon: NotebookPen, to: "/admin/notes" },
  { id: 4, title: "Events", icon: Calendar, to: "/admin/events" },
  { id: 5, title: "Groups", icon: Users, to: "/admin/groups" },
  { id: 6, title: "QnA", icon: MessageSquare, to: "/admin/qna" },
  {
    id: 7,
    title: "Complaints",
    icon: MessageCircleQuestion,
    to: "/admin/complaints",
  },
];
