import { useState } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser, FaCheckCircle } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button} from "../components/ui/button"
import SideBar from '../components/SideBar';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getReportCount,addReport } from '../../appwrite'; 

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ReportWaste = () => {
  const [reportAmount, setReportAmount] = useState('');
 
  const [userid, setUserid] = useState(''); 
    const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportCount, setReportCount] = useState(0);
  const [data, setData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const count = await getReportCount();
        setReportCount(count);
      
        const exampleData = [
          { name: 'Reports', value: count },
        ];
        setData(exampleData);
      } catch (error) {
        console.error("Error fetching report count:", error);
      }
    };
    fetchReportData();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const reportAmountInt = parseInt(reportAmount, 10); // Convert reportAmount to an integer
  
    if (!isNaN(reportAmountInt) && userid && title && description) {
      try {
        // Prepare the report data object
        const reportData = {
          title,
          description,
          reportAmount: reportAmountInt,
          userid,
        };
  
        // Call the addReport function with the report data object
        await addReport(reportData);
        
        // Clear input fields after submission
        setReportAmount('');
        setUserid('');
        setTitle('');
        setDescription('');
  
        // Optionally, you can refetch the report count after a successful submission
        const count = await getReportCount();
        setReportCount(count);
        
        // Update the data for the chart
        const exampleData = [
          { name: 'Reports', value: count },
        ];
        setData(exampleData);
  
        // Show success message
        setShowSuccessMessage(true);
  
        // Hide the success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
  
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    } else {
      console.error("All fields must be filled out and report amount must be a valid integer.");
    }
  };
  
  const COLORS = ['#34D399', '#3B82F6', '#F87171'];

  
  
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
    <div className="h-screen w-full flex ">
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
        <div className="p-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Submit Data (Testing)</h2>
      <p className="text-gray-500 mb-4 text-lg">Total Reports Submitted: <span className="font-bold">{reportCount}</span></p>

      {/* Circular Graph */}
      <div className="flex justify-center mb-6">
        <ResponsiveContainer width="80%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              fill="#34D399"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" layout="horizontal" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <form onSubmit={handleReportSubmit} className="space-y-4">
        <h3 className="text-xl font-medium mb-2 text-gray-700">Add Report</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="number"
          value={reportAmount}
          onChange={(e) => setReportAmount(e.target.value)}
          placeholder="Amount of waste collected (kg)"
          className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="text"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          placeholder="User ID"
          className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg">
          Submit Report
        </Button>
      </form>
      {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute ml-[15%] flex gap-2 top-20 bg-green-500 text-white p-4 rounded-lg shadow-lg"
            >
             <h1>Reward added successfully!</h1>
             <FaCheckCircle  className="mt-[5.5px] text-white" />
            </motion.div>
          )}
    </div>

        
       
      </div>
    </div>
  )
}

export default ReportWaste
