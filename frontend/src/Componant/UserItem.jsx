import React from "react";
import { useChatStore } from "../Store/isChatStore.js";

const UserItem = ({ user }) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 cursor-pointer">
      <div className="relative">
        <img
          src={user.profile}
          alt={user.fullName}
          className="w-12 h-12 rounded-full border-2 border-primary"
        />
        <span
          className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
        ></span>
      </div>
      <div>
        <p className="text-lg font-medium">{user.fullName}</p>
        <span className="text-sm text-gray-500">
          {user.isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default UserItem;