import { useState } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser, FaCheckCircle } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { addReward } from '../../appwrite';
import { Button } from "../components/ui/button";
import SideBar from './SideBar';
import { motion } from 'framer-motion'; 
import { NavLink, useNavigate } from 'react-router-dom';

const CollectWaste = () => {
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardid, setRewardid] = useState(''); 
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleRewardSubmit = async (e) => {
    e.preventDefault();
    const rewardAmountInt = parseInt(rewardAmount, 10);
    if (!isNaN(rewardAmountInt) && rewardid && title && description) {
      await addReward({ amount: rewardAmountInt, rewardid, title, description });
      setRewardAmount('');
      setRewardid(''); 
      setTitle('');
      setDescription('');
      setShowSuccessMessage(true);

     
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } else {
      console.error("All fields must be filled correctly.");
    }
  };

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
      <div className={`flex-grow flex flex-col transition-all duration-300`}>
        
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
            <div className="relative inline-block">
              <button onClick={toggleDropdown} className="text-gray-500 text-2xl">
                <FaUser />
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <ul>
                    <NavLink to={"/profile"} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</NavLink>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-center w-full flex-col items-center mt-[100px]'>
          <h1 className='text-3xl text-black'>COLLECT WASTE</h1>

          {/* Reward Submission Form */}
          <form onSubmit={handleRewardSubmit} className="mb-6">
            <h3 className="text-xl mb-2">Add Reward<span className='absolute mt-[1px] ml-[5px] text-green-600 font-bold lg:text-[15px] text-[12px] '>(All the rewards are added in the reward page)</span></h3>
            <input
              type="number"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              placeholder="Amount of tokens earned"
              className="border border-gray-300 rounded p-2 mb-2 w-full"
              required
            />
            <input
              type="text"
              value={rewardid} 
              onChange={(e) => setRewardid(e.target.value)} 
              placeholder="Reward ID"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Submit Reward
            </Button>
          </form>

          {/* Success Message Popup */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute flex gap-2 top-20 bg-green-500 text-white p-4 rounded-lg shadow-lg"
            >
              <h1>Reward added successfully!</h1>
              <FaCheckCircle className="mt-[5.5px] text-white" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectWaste;
