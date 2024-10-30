import SideBar from '../components/SideBar';
import { Leaf } from 'lucide-react';
import { useState } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser,FaArrowRight } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import {Button} from "../components/ui/button"


const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
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
    <div className="h-screen w-full flex flex-col">
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

      {/* Main Content */}
      <div className="flex flex-grow lg:mt-40 mt-20">
        {/* Sidebar */}
        <SideBar className="z-100" isVisible={showSidebar} />

        {/* Main Center Content */}
        <div className="flex flex-grow flex-col items-center mt-[50px] ml-[60px]">
          <div className="relative w-32 h-32 mb-[40px] z-[-10] lg:ml-0 ml-[-50px]">
            <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
            <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
            <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
            <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse" />
          </div>
          <h1 className="lg:text-6xl text-4xl font-bold mb-6 text-gray-800 tracking-tight">
            GreenFuture <span className="text-green-600">Waste Management</span>
          </h1>
          <p className="lg:text-2xl text-xl text-gray-600 w-full mx-auto leading-start flex justify-center
          items-center   mb-8">
            Join our community in making waste management more efficient and rewarding!
          </p>
          <Button onClick={() => navigate('/collectwaste')} className="  lg:ml-0 ml-[-50px] bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started
            <FaArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
