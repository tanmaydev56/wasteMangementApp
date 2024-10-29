
import SideBar from '../components/SideBar';
import { Leaf } from 'lucide-react';
import { FaLeaf, FaSearch, FaBell, FaUser, } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";

const Dashboard = () => {
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button className="text-xl">
          <MdOutlineMenu/>
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
            <select name="" id="">
              <option value="">Profile</option>
              <option value="">Settings</option>
              <option value="">Login</option>
            </select>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <SideBar />

        {/* Main Center Content */}
        <div className="flex flex-grow items-center justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
            <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
            <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
            <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
