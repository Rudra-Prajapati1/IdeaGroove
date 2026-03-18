import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import DashboardUsers from "../../components/admin/DashboardUsers";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";
import {
  fetchAdminDegreeSubjectData,
  selectAdminDegreeOptions,
} from "../../redux/adminSlice/adminMetaSlice";
import {
  fetchAdminUsers,
  moderateAdminUser,
  selectAdminUserStats,
  selectAdminUserYearOptions,
  selectAdminUsers,
  selectAdminUsersActionStatus,
} from "../../redux/adminSlice/adminUsersSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers);
  const stats = useSelector(selectAdminUserStats);
  const degreeOptions = useSelector(selectAdminDegreeOptions);
  const yearOptions = useSelector(selectAdminUserYearOptions);
  const actionStatus = useSelector(selectAdminUsersActionStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminDegreeSubjectData());
  }, [dispatch]);

  const handleModerateRequest = (type, userId) => {
    setSelectedAction(type);
    setTargetId(userId);
    setModalOpen(true);
    setReason(
      type === "block"
        ? "Your account access has been restricted due to a violation of our community standards or platform policies."
        : "Your account access has been reviewed and reinstated. You can now log in normally.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        moderateAdminUser({
          action: selectedAction,
          id: targetId,
          reason,
        }),
      ).unwrap();

      toast.success(
        selectedAction === "block"
          ? "Student blocked & email sent!"
          : "Student unblocked & email sent!",
      );
      setModalOpen(false);
      setReason("");
    } catch (err) {
      toast.error(err || "Network error. Please try again.");
    }
  };

  return (
    <section className="flex flex-col gap-8 relative min-h-screen">
      <AdminPageHeader
        title="Users Management"
        subtitle="Comprehensive Student Directory"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={degreeOptions}
        subjectOptions={yearOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setYearFilter}
        secondTitle="All Years"
      />

      <StatsRow stats={stats} />

      <DashboardUsers
        users={users}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterYear={yearFilter}
        onModerate={handleModerateRequest}
      />

      <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleActionSubmit}
        actionType={selectedAction}
        targetType="User"
        reason={reason}
        setReason={setReason}
        loading={actionStatus === "loading"}
      />
    </section>
  );
};

export default AdminDashboard;
