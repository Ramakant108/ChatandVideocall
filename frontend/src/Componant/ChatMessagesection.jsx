import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../Store/isAuthStore.js";
import { useChatStore } from "../Store/isChatStore.js";

const ChatMessagesection = () => {
  const messagesEndRef = useRef(null);
  const { messages, selectedUser, getMessages, subcribeMessages, unSubcribeMessages } = useChatStore();
  const { authUser } = useAuthStore();

  // Add new download handler function
  const handleImageDownload = async (imageUrl, senderId) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create object URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Generate filename using sender info and timestamp
      const timestamp = new Date().getTime();
      const senderName = senderId === authUser._id ? 'me' : selectedUser.fullName || 'other';
      link.download = `chat-image-${senderName}-${timestamp}.jpg`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

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
            {message.image && (
              <div className="relative group">
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
                <button 
                  className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleImageDownload(message.image, message.senderId)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            )}
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
