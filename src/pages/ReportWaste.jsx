import { useState, useEffect, useMemo } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser, FaCheckCircle  } from 'react-icons/fa';
import { RxCross1 } from "react-icons/rx";
import { MdOutlineMenu } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';

import SideBar from '../components/SideBar';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { getReportCount, addReport } from '../../appwrite';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

const ReportWaste = () => {
  const [reportAmount, setReportAmount] = useState('');
  const [userid, setUserid] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportCount, setReportCount] = useState(0);
  const [data, setData] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showFailureModal, setShowFailureModal] = useState(false); // Failure modal state
  const [position, setPosition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const count = await getReportCount();
        setReportCount(count);
        setData([{ name: 'Reports', value: count }]);
      } catch (error) {
        console.error("Error fetching report count:", error);
      }
    };
    fetchReportData();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const reportAmountInt = parseInt(reportAmount, 10);

    if (!isNaN(reportAmountInt) && userid && title && description) {
      if (position) {
        try {
          const reportData = { title, description, reportAmount: reportAmountInt, userid, position };
          await addReport(reportData);

          setReportAmount('');
          setUserid('');
          setTitle('');
          setDescription('');
          setPosition(null);

          const count = await getReportCount();
          setReportCount(count);
          setData([{ name: 'Reports', value: count }]);

          setShowSuccessModal(true);
          setTimeout(() => setShowSuccessModal(false), 3000);
        } catch (error) {
          console.error("Error submitting report:", error);
        }
      } else {
        setShowFailureModal(true); // Show failure modal if no location
        setTimeout(() => setShowFailureModal(false), 3000); // Hide after 5 seconds
      }
    } else {
      console.error("All fields must be filled out and report amount must be a valid integer.");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</Popup>
      </Marker>
    );
  };

  const memoizedLocationMarker = useMemo(() => <LocationMarker />, [position]);
  const COLORS = ['#34D399', '#3B82F6', '#F87171'];
  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div className="h-screen w-full">
      <SideBar isVisible={!showSidebar} />
      <div className={`flex-grow flex flex-col ${showSidebar ? 'ml-0' : 'ml-0'} transition-all duration-300`}>
        <div className="flex items-center justify-between h-20 px-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center space-x-4">
            <button className="text-xl" onClick={toggleSidebar}>
              <MdOutlineMenu />
            </button>
            <div className="flex items-center text-lg font-semibold">
              <FaLeaf className="text-green-500 mr-1" />
              <span>GreenFuture</span>
            </div>
          </div>

          <div className="lg:flex hidden items-center w-1/3 bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search..."
              className="flex-grow bg-transparent outline-none text-gray-600"
            />
            <FaSearch className="text-gray-400" />
          </div>

          <div className="flex items-center space-x-4">
            <FaBell className="text-gray-500" />
            <div className="relative inline-block">
              <button onClick={toggleDropdown} className="text-gray-500 text-2xl">
                <FaUser />
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <ul>
                    <NavLink to={"/profile"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li></NavLink>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Submit Data (Testing)</h2>
          <p className="text-gray-500 mb-4 text-lg">Total Reports Submitted: <span className="font-bold">{reportCount}</span></p>

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

            {/* Heading for Map */}
            <h3 className="text-lg font-medium text-gray-700">Select Location on the Map</h3>
            <div className="w-full h-64 rounded-lg border">
              <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {memoizedLocationMarker}
              </MapContainer>
            </div>

            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600">Submit</button>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute ml-[15%] flex gap-2  top-20 bg-green-500 text-white p-4 rounded-lg shadow-lg"
            >
              <h1>Report added successfully!</h1>
              <FaCheckCircle className="mt-[5.5px] text-white" />
            </motion.div>
          )}

        {/* Failure Modal */}
        {showFailureModal && (
          <motion.div
            className="absolute ml-[15%] flex gap-2 top-20 bg-red-500 text-white p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0,translateY: -20 }}
            animate={{ opacity: 1,translateY: 0 }}
            exit={{ opacity: 0, translateY: -20 }}
            transition={{ duration: 0.5 }}
          >
            
              <h3 className="text-white font-[400] text-xl">Error!,Please select a location before submitting your report.</h3>
              <RxCross1  className="mt-[5.5px] text-white" />
           
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportWaste;
