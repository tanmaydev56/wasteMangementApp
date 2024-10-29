import React from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser } from 'react-icons/fa';

const NavBar = () => {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button className="text-xl">
          <span className="material-icons">menu</span>
        </button>
        <div className="flex items-center text-lg font-semibold">
          <FaLeaf className="text-green-500 mr-1" />
          <span>Zero2Hero</span>
        </div>
        <span className="text-sm text-gray-500">ETHOnline24</span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center w-1/3 bg-gray-100 rounded-full px-4 py-2">
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
        <FaUser className="text-gray-500" />
        <button className="text-xl">
          <span className="material-icons">expand_more</span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
