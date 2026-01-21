import { useState } from "react";
import UserCard from "./Cards/AdminUserCard";

const initialUsers = [
  {
    id: 1,
    name: "Rohan Sharma",
    email: "rohan@gmail.com",
    status: "active",
  },
  {
    id: 2,
    name: "Aisha Khan",
    email: "aisha@gmail.com",
    status: "inactive",
  },
  {
    id: 3,
    name: "Kunal Verma",
    email: "kunal@gmail.com",
    status: "active",
  },
  {
    id: 4,
    name: "Neha Patel",
    email: "neha@gmail.com",
    status: "active",
  },
  {
    id: 5,
    name: "Arjun Mehta",
    email: "arjun@gmail.com",
    status: "inactive",
  },
];

const DashboardUsers = () => {
  const [users, setUsers] = useState(initialUsers);

  const toggleBlockUser = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onToggleBlock={toggleBlockUser} />
        ))}
      </div>
    </div>
  );
};

export default DashboardUsers;
