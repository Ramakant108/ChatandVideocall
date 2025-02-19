import React from "react";
import { useChatStore } from "../Store/isChatStore.js";
import { useAuthStore } from "../Store/isAuthStore.js";
import { X, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, selectUser } = useChatStore();
  const { socket, authUser } = useAuthStore();
  const navigate = useNavigate();

  const initiateVideoCall = () => {
    if (!selectedUser) {
      toast.error('Please select a user to call');
      return;
    }

    const roomId = `${authUser._id}-${Date.now()}`;

    // Emit initiateCall event before navigation
    socket.emit('initiateCall', {
      callerId: authUser._id,
      receiverId: selectedUser._id,
      callerName: authUser.fullName,
      roomId
    });

    // Navigate to video call page
    navigate(`/video/${roomId}?caller=true`);

    // Setup listeners for call responses
    socket.on('callDeclined', ({ receiverName }) => {
      toast.error(`Call declined by ${receiverName}`);
      navigate('/'); // Return to chat
    });

    socket.on('callError', ({ message }) => {
      toast.error(message);
      navigate('/');
    });
  };

  return (
    <div className="bg-base-100 p-4 flex items-center gap-3 border-b border-base-300 sticky top-0 z-10 justify-between">
      <div className="flex items-center gap-3">
        <img
          src={selectedUser?.profile || "/avatar.png"}
          alt={selectedUser?.fullName}
          className="w-10 h-10 rounded-full border border-gray-400"
        />
        <div>
          <p className="text-lg font-medium">{selectedUser?.fullName}</p>
          <span className="text-sm text-gray-500">
            {selectedUser?.isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={initiateVideoCall}
          className="btn btn-circle btn-ghost hover:bg-primary/20"
          title="Start video call"
        >
          <Video size={20} />
        </button>
        <button
          onClick={() => selectUser(null)}
          className="btn btn-circle btn-ghost"
          title="Close chat"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;