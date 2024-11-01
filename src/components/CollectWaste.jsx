import React, { useState,useRef,useEffect } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser, FaArrowRight } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import SideBar from './SideBar';
import { Leaf } from 'lucide-react';
import Webcam from "react-webcam";
// import '@tensorflow/tfjs'
// import * as tf from '@tensorflow/tfjs';
// import * as mobilenet from '@tensorflow-models/mobilenet';

const CollectWaste = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const webcamRef = useRef(null);
  // const [predictions, setPredictions] = useState([]);

  const [cameraEnabled, setCameraEnabled] = useState(false);
  // const [model, setModel] = useState(null);

//   useEffect(() => {
//     const loadModel = async () => {
//         const loadedModel = await mobilenet.load();
//         console.log("Model loaded successfully");
//         setModel(loadedModel);
//     };
//     loadModel();
// }, []);
  const navigate = useNavigate();
  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    setImageSrc(null);
  };

  const captureImage = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    setImageSrc(capturedImage);
    setCameraEnabled(false); 
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 
  const toggleDropdownImg = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const deleteImage = () => {
    setImageSrc(null);
  };
//   const preprocessImage = (image) => {
//     return tf.browser.fromPixels(image)
//         .resizeNearestNeighbor([224, 224])
//         .expandDims(0)
//         .toFloat()
//         .div(tf.scalar(255));
// };
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

        <div className='flex flex-col place-self-center'>
        <div className='self-center mt-[100px]'>
            <h1 className='text-3xl text-black'>COLLECT WASTE</h1>
            </div>
        <div className='flex flex-col  justify-center lg:mt-[50px] mt-[50px] '>
        <button onClick={toggleDropdownImg} className="flex place-self-center bg-green-600 hover:bg-green-700 text-white text-lg py-3 px-8 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
        {dropdownVisible ? "Close Options" : "Open Options"}
      </button>

      {dropdownVisible && (
        <div className='flex lg:mt-[10px] mt-[20px] justify-center gap-[50px] mt-[10px] '>
          <button onClick={toggleCamera} className="relative inline-flex   items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  rounded-[30px] group bg-gradient-to-br from-green-400 to-green-800 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white  ">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-[30px] text-green-700 group-hover:bg-opacity-0 group-hover:text-white">

            {cameraEnabled ? "Disable Camera" : "Enable Camera"}
           
            </span>
          </button>

          <label className="relative inline-flex   items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  rounded-[30px] group bg-gradient-to-br from-green-400 to-green-800 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white  ">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-[30px] text-green-700 group-hover:bg-opacity-0 group-hover:text-white">

            Upload Image
            </span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ display: "none" }} 
            />
          </label>
        </div>
      )}

      {/* Camera view */}
      {cameraEnabled && (
        <div className='flex flex-col gap-[20px]  lg:mt-[15px] mt-[15px]'>
          <Webcam 
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: "100%", maxWidth: "400px" }}
          />
          <button onClick={captureImage} className="relative self-center inline-flex   items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  rounded-[30px] group bg-gradient-to-br from-green-400 to-green-800 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white  ">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-[30px] text-green-700 group-hover:bg-opacity-0 group-hover:text-white">

            Capture Image
            </span>
          </button>
        </div>
      )}

      {/* Image preview */}
      {imageSrc && (
        <div style={{ marginTop: "20px" }}>
          <h3 className='text-[24px]'>Preview:</h3>
          <img src={imageSrc} alt="Preview" style={{ width: "100%", maxWidth: "400px" }} />
          <button onClick={deleteImage} style={{ padding: "10px 20px", marginTop: "10px", background: "red", color: "white" }}>
            Delete Image
          </button>
          {/* Predictions */}
         
        </div>
        
      )}

        </div>
        </div>
      </div>
    </div>
  );
};

export default CollectWaste;
