import React, { useState } from "react";
import Chatheader from "./Chatheader.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatMessagesection from "./ChatMessagesection.jsx";
import { useChatStore } from "../Store/isChatStore.js";

const ChatSection = () => {
    const {selectedUser}=useChatStore()

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Chat Header */}
      <div className="sticky top-0 z-20">
        <Chatheader />
      </div>

      {/* Scrollable Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessagesection/>
      </div>

      {/* Fixed Chat Input */}
      <div className="sticky bottom-0 bg-base-100 border-t border-base-300 p-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatSection;
