import React, { useState, useEffect } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { getRewardBalance } from '../../appwrite';// Import function to fetch balance

const NavBar = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(0); // State for reward balance

  // Fetch balance when component mounts
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const userBalance = await getRewardBalance(userEmail); // Fetch balance from backend
          setBalance(userBalance);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    fetchBalance();
  }, []);

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
          <span className="text-sm font-semibold text-gray-800">{balance.toFixed(2)}</span>
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
