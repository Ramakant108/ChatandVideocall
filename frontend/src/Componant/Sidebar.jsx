import React, { useEffect } from "react";
import UserItem from "./UserItem";
import { useChatStore } from "../Store/isChatStore.js";

const Sidebar = () => {
  const { users, getUsers, selectUser } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <aside className="bg-base-100 border-r border-base-300 p-4 overflow-y-auto h-full">
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user._id} onClick={() => selectUser(user)}>
            <UserItem user={user} />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;