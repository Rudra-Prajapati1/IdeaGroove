import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminGroupsGrid from "../../components/admin/AdminGroupsGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";
import {
  fetchAdminHobbies,
  selectAdminHobbyOptions,
} from "../../redux/adminSlice/adminMetaSlice";
import {
  fetchAdminGroups,
  moderateAdminGroup,
  selectAdminGroups,
  selectAdminGroupsActionStatus,
  selectAdminGroupsStats,
} from "../../redux/adminSlice/adminGroupsSlice";

const AdminGroups = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectAdminGroups);
  const hobbyOptions = useSelector(selectAdminHobbyOptions);
  const groupsStats = useSelector(selectAdminGroupsStats);
  const actionStatus = useSelector(selectAdminGroupsActionStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [hobbyFilter, setHobbyFilter] = useState("all");

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(fetchAdminGroups());
    dispatch(fetchAdminHobbies());
  }, [dispatch]);

  const handleModerateRequest = (type, groupId) => {
    setSelectedAction(type);
    setTargetId(groupId);
    setModalOpen(true);
    setReason(
      type === "block"
        ? "This group has been restricted due to inactivity or violation of community standards."
        : "This group has been reviewed and reinstated for community engagement.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        moderateAdminGroup({
          action: selectedAction,
          id: targetId,
          reason,
        }),
      ).unwrap();

      toast.success(`Group ${selectedAction}ed successfully! Email sent.`);
      setModalOpen(false);
      setReason("");
    } catch (err) {
      toast.error(err || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Groups Management"
        subtitle="Manage student groups and monitor engagement"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        hobbyOptions={hobbyOptions}
        onHobbyFilter={setHobbyFilter}
        thirdTitle="All Hobbies"
      />

      <StatsRow stats={groupsStats} />
      <AdminGroupsGrid
        groups={groups}
        searchTerm={searchTerm}
        filterHobby={hobbyFilter}
        onModerate={handleModerateRequest}
      />

      <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleActionSubmit}
        actionType={selectedAction}
        targetType="Group"
        reason={reason}
        setReason={setReason}
        loading={actionStatus === "loading"}
      />
    </section>
  );
};

export default AdminGroups;
