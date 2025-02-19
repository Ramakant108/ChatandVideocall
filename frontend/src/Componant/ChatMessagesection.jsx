import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../Store/isAuthStore.js";
import { useChatStore } from "../Store/isChatStore.js";

const ChatMessagesection = () => {
  const messagesEndRef = useRef(null);
  const { messages, selectedUser, getMessages,subcribeMessages,unSubcribeMessages} = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subcribeMessages()
    }
    return ()=>unSubcribeMessages()
  }, [selectedUser, getMessages,subcribeMessages,unSubcribeMessages]);

  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Auto-scroll to the bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-base-200 h-[calc(100vh-140px)]">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
        >
          {/* Profile Image */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser.profile || "/avatar.png"
                    : selectedUser.profile || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>

          {/* Message Bubble */}
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>
          <div className="chat-bubble flex flex-col">
            {/* Image Attachment */}
            {message.image && (
              <img
                src={message.image}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
              />
            )}
            {/* Message Text */}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
      ))}
      {/* Empty div to maintain scroll at the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessagesection;
