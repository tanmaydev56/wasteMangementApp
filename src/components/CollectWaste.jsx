import { useState,useRef,useEffect} from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser, FaCheckCircle,FaInfoCircle  } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { addReward, getSubmitedReports } from '../../appwrite';
import { Button } from "../components/ui/button";
import SideBar from './SideBar';
import { motion } from 'framer-motion'; 
import { NavLink, useNavigate } from 'react-router-dom';

import axios from 'axios';

const CollectWaste = () => {
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardid, setRewardid] = useState(''); 
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    setImageSrc(null); // Reset image source when toggling
  };

  const captureImage = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    setImageSrc(capturedImage);
    setCameraEnabled(false); 
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!file && !imageSrc) return;

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else if (imageSrc) {
      const blob = await fetch(imageSrc).then(res => res.blob());
      formData.append('file', blob, "captured_image.jpg");
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrediction(response.data);
    } catch (error) {
      console.error("Error during prediction", error);
    }
  };
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getSubmitedReports();
        //  Fetch reports from the backend
        
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
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
                  <NavLink to={"/profile"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li></NavLink>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full flex-col items-center mt-[100px]">
      <h1 className="text-3xl text-black">Submitted Reports</h1>

      {loading ? (
        <p className="text-gray-500 mt-4">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 mt-4">No reports submitted yet.</p>
      ) : (
        <div className="w-full max-w-4xl mt-6">
          {reports.map((report, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-4 shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold text-green-600">
                Report {index + 1}
              </h2>
              <p className="text-gray-700">
                <strong>Waste Type:</strong> {report.wasteType}
              </p>
              <p className="text-gray-700">
                <strong>Amount:</strong> {report.amount}
              </p>
              <p className="text-gray-700">
                <strong>Confidence:</strong> {report.confidence}%
              </p>
              {report.position && (
                <p className="text-gray-700">
                  <strong>Location:</strong> {report.position.lat.toFixed(4)},{' '}
                  {report.position.lng.toFixed(4)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
      </div>
    </div>
  );
};

export default CollectWaste;