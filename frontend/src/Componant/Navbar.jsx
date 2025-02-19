import React, { useState } from 'react';
import { useAuthStore } from '../Store/isAuthStore.js';
import { MessageSquare, Settings, User, LogOut, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="flex justify-between items-center p-4 border-b bg-base-100 border-base-300 shadow-md sticky top-0 z-30">
      <div className="flex items-center gap-2 cursor-pointer bg-primary/10 p-2 rounded-md">
        <Link to="/" className="flex items-center gap-1 text-primary">
          <MessageSquare size={24} />
          <span className="text-xl font-bold">Chat App</span>
        </Link>
      </div>

      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 hover:bg-base-200 rounded-lg"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-4">
        <NavLinks authUser={authUser} logout={logout} />
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-base-100 border-b border-base-300 shadow-lg md:hidden p-4 space-y-4">
          <NavLinks authUser={authUser} logout={logout} mobile onClick={toggleMenu} />
        </div>
      )}
    </nav>
  );
};

// Separate component for nav links to avoid repetition
const NavLinks = ({ authUser, logout, mobile, onClick }) => (
  <div className={`${mobile ? 'flex flex-col' : 'flex'} items-center gap-4`}>
    <Link 
      to="/setting" 
      className="flex items-center gap-1 text-secondary hover:text-primary transition p-2 rounded-lg hover:bg-base-200 w-full"
      onClick={onClick}
    >
      <Settings size={24} />
      <span>Settings</span>
    </Link>
    {authUser && (
      <>
        <Link 
          to="/profile" 
          className="flex items-center gap-1 text-secondary hover:text-primary transition p-2 rounded-lg hover:bg-base-200 w-full"
          onClick={onClick}
        >
          <User size={24} />
          <span>Profile</span>
        </Link>
        <button 
          onClick={() => {
            logout();
            onClick?.();
          }} 
          className="flex items-center gap-1 text-red-500 hover:bg-red-50 p-2 rounded-lg w-full transition"
        >
          <LogOut size={24} />
          <span>Logout</span>
        </button>
      </>
    )}
  </div>
);

export default Navbar;
