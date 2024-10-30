import React, { useState } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser, FaArrowRight } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button} from "../components/ui/button"
import SideBar from '../components/SideBar';
import { Leaf } from 'lucide-react';

const News = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const toggleSidebar = () => {
      setShowSidebar(!showSidebar);
    };
  
    const handleLogout = () => {
      localStorage.removeItem('userToken');
      navigate('/login');
    };
  return (
    <div className="h-screen w-full flex">
    {/* Sidebar */}
    <SideBar isVisible={!showSidebar} />

    {/* Main Content */}
    <div className={`flex-grow flex flex-col ${showSidebar ? 'ml-0' : 'ml-0'} transition-all duration-300`}>
      
      {/* Navbar */}
      <div className="flex items-center justify-between h-20 px-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
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

      <div className='flex justify-center w-full items-center mt-[100px]'>
            <h1 className='text-3xl text-black'>NEWS</h1>
        </div>
     
    </div>
  </div>
  )
}

export default News
