import React from "react";
import { useChatStore } from "../Store/isChatStore.js";
import Sidebar from "../Componant/Sidebar.jsx";
import ChatSection from "../Componant/ChatSection.jsx";
import { ArrowLeft, Users } from "lucide-react";

const Home = () => {
  const { selectedUser, selectUser } = useChatStore();

  return (
    <div className="h-[calc(100vh-64px)] flex bg-base-200">
      {/* Sidebar */}
      <div
        className={`
          ${
            selectedUser
              ? "hidden md:block w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
              : "w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
          }
          transition-all duration-300 ease-in-out border-r border-base-300
          flex flex-col h-full
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-base-300 bg-base-100">
          <h2 className="text-xl font-semibold">Contacts</h2>
        </div>
        
        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Chat Section */}
      <div
        className={`
          ${
            selectedUser
              ? "w-full md:w-2/3 lg:w-3/4 xl:w-4/5"
              : "hidden md:flex md:w-2/3 lg:w-3/4 xl:w-4/5 md:justify-center md:items-center"
          }
          transition-all duration-300 ease-in-out relative flex flex-col h-full
        `}
      >
        {selectedUser ? (
          <>
            {/* Mobile back button */}
            <button
              onClick={() => selectUser(null)}
              className="md:hidden fixed top-20 left-4 z-50 p-2.5 rounded-full bg-base-300 hover:bg-base-100 active:bg-base-300 transition-colors shadow-md"
              aria-label="Back to contacts"
            >
              <ArrowLeft size={24} />
            </button>
            
            {/* Chat Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <ChatSection />
            </div>
          </>
        ) : (
          <div className="text-center space-y-4 p-4 max-w-md mx-auto">
            <button 
              className="p-6 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 active:bg-primary/80 transition-colors transform hover:scale-105 active:scale-100 duration-200"
              aria-label="Select a contact"
            >
              <Users size={32} />
            </button>
            <p className="text-base-content/70 text-lg font-medium">
              Select a contact to start chatting
            </p>
            <p className="text-base-content/50 text-sm">
              Choose from your contacts list on the left to begin a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;