import React, { useState, useCallback } from 'react';
import { FaHome, FaMapMarkerAlt, FaTrashAlt, FaGift, FaMedal, FaCog, FaNewspaper } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SideBar = ({ isVisible }) => {
  const [activeItem, setActiveItem] = useState('/dashboard'); // Default active item
  const navigate = useNavigate();

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleNavigation = useCallback(
    debounce((path) => {
      setActiveItem(path); // Update active item
      navigate(path); // Navigate to the selected path
    }, 300), // Adjust the delay as needed
    []
  );

  return (
    <div
      className={`${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } fixed top-0 left-0 h-screen w-56 p-4 border-r border-gray-200 bg-white transition-transform duration-300 z-40`}
    >
      <div className="space-y-4 mt-20">
        <div
          className={`flex items-center p-2 rounded-md cursor-pointer ${
            activeItem === '/dashboard' ? 'bg-green-100 text-green-700' : ''
          }`}
          onClick={() => handleNavigation('/dashboard')}
        >
          <FaHome className="mr-2" />
          <span>Home</span>
        </div>
        <div
          className={`flex items-center p-2 rounded-md cursor-pointer ${
            activeItem === '/report-waste' ? 'bg-green-100 text-green-700' : ''
          }`}
          onClick={() => handleNavigation('/report-waste')}
        >
          <FaMapMarkerAlt className="mr-2" />
          <span>Report Waste</span>
        </div>
        <div
          className={`flex items-center p-2 rounded-md cursor-pointer ${
            activeItem === '/collectwaste' ? 'bg-green-100 text-green-700' : ''
          }`}
          onClick={() => handleNavigation('/collectwaste')}
        >
          <FaTrashAlt className="mr-2" />
          <span>Collect Waste</span>
        </div>
        <div
          className={`flex items-center p-2 rounded-md cursor-pointer ${
            activeItem === '/rewards' ? 'bg-green-100 text-green-700' : ''
          }`}
          onClick={() => handleNavigation('/rewards')}
        >
          <FaGift className="mr-2" />
          <span>Rewards</span>
        </div>
        <div
          className={`flex items-center p-2 rounded-md cursor-pointer ${
            activeItem === '/News' ? 'bg-green-100 text-green-700' : ''
          }`}
          onClick={() => handleNavigation('/News')}
        >
          <FaNewspaper className="mr-2" />
          <span>News</span>
        </div>
      </div>
      <div
        className={`lg:mt-[350px] mt-[280px] flex items-center p-2 rounded-md cursor-pointer ${
          activeItem === '/settings' ? 'bg-green-100 text-green-700' : ''
        }`}
        onClick={() => handleNavigation('/settings')}
      >
        <FaCog className="mr-2" />
        <span>Settings</span>
      </div>
    </div>
  );
};

export default SideBar;
