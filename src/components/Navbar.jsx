import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoIcon from '../assets/images/icon.png';
import { useChat } from "../contexts/ChatContext";
import toast from "react-hot-toast";
import SubscriptionButton from "./SubscriptionButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, token } = useAuth();

  const {chatClient, setChatClient} = useChat();

  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path)=> {
    return path === currentPath;
  }

  const userLogout = async()=> {
    try {
      if(chatClient) await chatClient.disconnectUser();
      setChatClient(null);
      logout();
    } catch (error) {
      toast.error('Chat cannot be disconnected')
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 md:pt-0 pt-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="flex space-x-1 text-teal-600">
            <div className="self-start">

            <img src={logoIcon} alt="HealthBridge Logo" className="md:h-12 h-10 md:w-12 w-10 object-contain" />
            </div>
            <span className="md:text-3xl text-xl tracking-tight select-none font-bold mt-1">HealthBridge</span>
          </Link>


          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center text-lg">
            {user ? (
              <>
                {/* <Link
                  to='/pay'
                  className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition text-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                >
                  Pay
                </Link> */}
                <button
                  onClick={userLogout}
                  className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition text-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                >
                  Logout
                </button>
                <SubscriptionButton token={token} user={user} />
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-300 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/signup" className="text-white ml-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition font-semibold">
                  Sign Up
                </Link>
              </>
            )}
                <Link to='/contact' className="text-sm hover:underline">Contact Us</Link>

          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className={`focus:outline-none p-2 rounded-md hover:bg-gray-200 transition z-300 text-black ${isOpen && 'fixed top-[54px] right-[22px]'}`}
            >
              {isOpen ? (
                <svg
                className="w-6 h-6"
                fill="transparent"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}

  <>
    {/* Overlay */}
    <div
    className={`fixed inset-0 bg-black/40 z-200 transition-opacity duration-300 md:hidden
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}
    onClick={() => setIsOpen(false)}
    aria-label="Close Menu Overlay"
  />

    {/* Drawer */}
    <div
  className={`pt-[108px] fixed top-0 right-0 h-full w-2/4 max-w-xs bg-blue-50 space-y-2 shadow-xl z-200
    transform transition-transform duration-300 ease-in-out pt-16 md:hidden
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `}
>
      <Link
        to="/"
        className={`block font-medium transition pl-6 w-[100%] py-4 hover:text-blue-500 ${isActive('/')&&'bg-blue-500 text-white hover:text-white'}`}
        onClick={() => setIsOpen(false)}
      >
        Home
      </Link>
      {user ? (
        <>
          <span className="block text font-semibold fixed z-200 top-[60px] left-[20px] ">Hi, {user.name}</span>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="text-left pl-6 w-full py-4 font-semibold text-red-600 hover:underline"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className={`block text font-medium transition pl-6 w-[100%] py-4 hover:text-blue-500 ${isActive('/login')&&'bg-blue-500 text-white hover:text-white'}`}
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`block text font-medium transition pl-6 w-[100%] py-4 hover:text-blue-500 ${isActive('/signup')&&'bg-blue-500 text-white hover:text-white'}`}
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}
       <Link
        to="/contact"
        className={`block font-medium transition pl-6 w-[100%] py-4 hover:text-blue-500 ${isActive('/contact')&&'bg-blue-500 text-white hover:text-white'}`}
        onClick={() => setIsOpen(false)}
      >
        Contact us
      </Link>
    </div>
  </>

    </nav>

  );
}
