import { useState,useRef} from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser, FaCheckCircle,FaInfoCircle  } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { addReward } from '../../appwrite';
import { Button } from "../components/ui/button";
import SideBar from './SideBar';
import { motion } from 'framer-motion'; 
import { NavLink, useNavigate } from 'react-router-dom';
import Webcam from "react-webcam";
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

        <div className='flex justify-center w-full flex-col items-center mt-[100px]'>
          <h1 className='text-3xl text-black'>COLLECT WASTE</h1>
              <div className='flex space-between'>
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
            {/* collect waste model */}
            <div className='flex flex-col justify-center lg:mt-[50px] mt-[50px] lg:mb-[50px] mb-[50px]'>
            <button onClick={() => setDropdownVisible(!dropdownVisible)} className="flex place-self-center bg-green-600 hover:bg-green-700 text-white text-lg py-3 px-8 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
              {dropdownVisible ? "Close Options" : "Open Options"}
            </button>

            {dropdownVisible && (
              <div className='flex lg:mt-[10px] mt-[20px] justify-center gap-[50px]'>
                <button onClick={toggleCamera} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-[30px] group bg-gradient-to-br from-green-400 to-green-800 hover:text-white dark:text-white">
                  <span className="relative px-5 py-2.5 bg-white rounded-[30px] text-green-700 group-hover:bg-opacity-0 group-hover:text-white">
                    {cameraEnabled ? "Disable Camera" : "Enable Camera"}
                  </span>
                </button>

                <label className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-[30px] group bg-gradient-to-br from-green-400 to-green-800 hover:text-white dark:text-white">
                  <span className="relative px-5 py-2.5 bg-white rounded-[30px] text-green-700 group-hover:bg-opacity-0 group-hover:text-white">
                    Upload Image
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                </label>
              </div>
            )}

            {/* Camera view */}
            {cameraEnabled && (
              <div className='flex flex-col gap-[20px] lg:mt-[15px] mt-[15px]'>
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", maxWidth: "400px" }} />
                <button onClick={captureImage} className="relative self-center inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-[30px] group bg-gradient-to-br from-green-400 to-green-800 hover:text-white dark:text-white">
                  <span className="relative px-5 py-2.5 bg-white rounded-[30px] text-green-700 group-hover:bg-opacity-0 group-hover:text-white">
                    Capture Image
                  </span>
                </button>
              </div>
            )}

            {/* Image preview and prediction */}
            {imageSrc && (
              <div className='self-center lg:mt-[20px] mt-[20px]'>
                <h3 className='text-[24px]'>Preview:</h3>
                <div style={{background: 'linear-gradient(to bottom right, #38bdf8, #22c55e)',display:"block"}} className='rounded-[20px]'>
                
                <img src={imageSrc} alt="Preview" style={{background: 'linear-gradient(to bottom right, #38bdf8, #22c55e)', width: "100%", maxWidth: "400px" }} className='border-[2px] border-[#22c55e] rounded-[20px] group border-gradient-to-br from-green-400 to-green-800 '/>
                </div>
                <div className='flex lg:gap-[30px] gap-[20px]'>
                <button onClick={() => setImageSrc(null)} style={{ padding: "10px 20px", marginTop: "10px", background: "red", color: "white" }} className='rounded-[25px]'>
                  Delete Image
                </button>
                <button onClick={handleSubmit} style={{ padding: "10px 20px", marginTop: "10px", background: "green", color: "white" }} className='rounded-[25px]'>
                  Get Prediction
                </button>
                </div>
                {prediction && (
                  <div>
                    <h3>Prediction Result:</h3>
                    <p>Class: {prediction.prediction}</p>
                    <p>Category: {prediction.category}</p>
                    <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
                  </div>
                )}
              </div>
            )}
          </div>
       
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Submit Reward
            </Button>
          </form>
          <div className="relative inline-block">
      <button
        onClick={toggleVisibility}
        className="text-green-700 text-2xl focus:outline-none"
        aria-label="Toggle instruction box"
      >
        <FaInfoCircle />
      </button>

      {isVisible && (
        <div
          className="absolute top-8 left-0 w-60 p-3 bg-green-50 text-gray-800 border border-green-700 rounded-lg shadow-lg z-10"
        >
          <p className="text-sm">
            This is an instruction box with helpful information for the user. Click the info icon to hide or show this box.
            <br/><span className='text-[18px] font-semibold'>Reward Points System:</span><br/>
            Plastic-400<br/>
            Cardboard-200<br/>
            Compost-200<br/>
            Metal-300<br/>
            Paper-100 <br/>
            Trash-50
          </p>
        </div>
      )}
      </div>
    </div>
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