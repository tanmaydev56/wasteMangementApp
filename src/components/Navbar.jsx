import React from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('userToken'); 
    navigate('/login'); 
  };
  
  return (
    
    <div className="flex items-center justify-between h-20 px-4 bg-white border-b border-gray-200">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button className="text-xl" onClick={toggleSidebar}>
            <MdOutlineMenu />
          </button>
          <div className="flex items-center text-lg font-semibold">
            <FaLeaf className="text-green-500 mr-1" />
            <span>GreenFuture</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="lg:flex hidden items-center w-1/3 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow bg-transparent outline-none text-gray-600"
          />
          <FaSearch className="text-gray-400" />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <FaBell className="text-gray-500" />
          <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
            <FaLeaf className="text-green-500" />
            <span className="text-sm font-semibold text-gray-800">0.00</span>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="text-gray-500 text-2xl">
              <FaUser />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                  <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default NavBar;
