import React from 'react';
import { FaHome, FaMapMarkerAlt, FaTrashAlt, FaGift, FaMedal, FaCog } from 'react-icons/fa';

const SideBar = () => {
  return (
    <div className="flex flex-col justify-between h-screen w-56 p-4 border-r border-gray-200">
      <div className="space-y-4">
        <div className="flex items-center p-2 bg-green-100 text-green-700 rounded-md">
          <FaHome className="mr-2" />
          <span>Home</span>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
          <FaMapMarkerAlt className="mr-2" />
          <span>Report Waste</span>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
          <FaTrashAlt className="mr-2" />
          <span>Collect Waste</span>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
          <FaGift className="mr-2" />
          <span>Rewards</span>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
          <FaMedal className="mr-2" />
          <span>Leaderboard</span>
        </div>
      </div>
      <div className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
        <FaCog className="mr-2" />
        <span>Settings</span>
      </div>
    </div>
  );
};

export default SideBar;
