import AdminPageHeader from "../../components/admin/AdminPageHeader";
import DashboardUsers from "../../components/admin/DashboardUsers";
import StatsRow from "../../components/admin/StatsRow";

export const dashboardUserStats = [
  {
    title: "Total Users",
    value: "1,240",
    infoText: "+5% this month",
    color: "green",
    type: "total",
  },
  {
    title: "Active Users",
    value: "980",
    infoText: "Currently active",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Inactive Users",
    value: "260",
    infoText: "Needs attention",
    color: "red",
    type: "blocked",
  },
];

const AdminDashboard = () => {
  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Overview of platform activity"
      />

      <StatsRow stats={dashboardUserStats} />

      <DashboardUsers />
    </section>
  );
};

export default AdminDashboard;
