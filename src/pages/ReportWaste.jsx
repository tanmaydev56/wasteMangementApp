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
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from '../components/ui/button';
const geminiApiKey = import.meta.env.VITE_PUBLIC_GEMINI_API_KEY
const ReportWaste = () => {
  const [reportAmount, setReportAmount] = useState('');
  const [userid, setUserid] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [WasteType, setWasteType] = useState('');
  // const [amount, setamount] = useState('');
  const [reportCount, setReportCount] = useState(0);
  const [data, setData] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newReport,setnewReport] = useState(
    {
      wasteType:"",
      amount:"",
      confidence:"",
      status:""
    }
  )
const [verificationStatus, setVerificationStatus] = useState('');
const [verificationResult, setVerificationResult] = useState({});
const [file, setFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);


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

  
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  
  const handleVerify = async () => {
    if (!file) {
      alert("Please upload an image of the waste.");
      return;
    }
  
    setVerificationStatus('verifying');
    
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey); // Replace with your API key
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const base64Data = await readFileAsBase64(file);
  
      const imageParts = [
        {
          inlineData: {
            data: base64Data.split(',')[1],
            mimeType: file.type,
          },
        },
      ];
  
      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
        1. The type of waste (e.g., plastic, paper, glass, metal, organic)
        2. An estimate of the quantity or amount (in kg or liters)
        3. Your confidence level in this assessment (as a percentage)
        
        Respond in JSON format like this:
        {
          "wasteType": "type of waste",
          "quantity": "estimated quantity with unit",
          "confidence": confidence level as a number between 0 and 1
        }`;
  
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
  
      try {
        const parsedResult = JSON.parse(text.replace(/```json|```/g, '')); // Handle markdown formatting
        
        if (parsedResult.wasteType && parsedResult.quantity && parsedResult.confidence) {
          setVerificationResult(parsedResult);
          setnewReport({
            wasteType: parsedResult.wasteType,
            amount: parsedResult.quantity,
            confidence: Math.round(parsedResult.confidence * 100).toFixed(1), // Convert to percentage
          });
          setVerificationStatus('success');
        }
        
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        setVerificationStatus('failure');
      }
    } catch (error) {
      console.error('Error verifying waste:', error);
      setVerificationStatus('failure');
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const handleReportSubmit = async (e) => {
    e.preventDefault();
  
    if (position) {
      try {
        const reportData = {
          ...newReport,
          position,
          userid,
        };
        await addReport(reportData);
  
        setnewReport({ wasteType: "", amount: "", confidence: "" ,status:"submitted"});
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
      setShowFailureModal(true);
      setTimeout(() => setShowFailureModal(false), 3000);
    }
  };
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

        <div className="p-8 bg-white rounded-2xl shadow-lg lg:w-[800px] w-auto mx-auto mt-24">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add Report </h2>
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
          <div className='mt-32 mr-10'>
   <form onSubmit={handleReportSubmit} className="space-y-4">
  {/* Other form fields */}
  <div>
    <label className="block text-gray-700 text-[14px] font-medium">Upload Waste Image:</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  </div>

  {imagePreview && (
    <div className="mt-4">
      <p className="text-gray-600">Uploaded Image:</p>
      <img
        src={imagePreview}
        alt="Uploaded Waste"
        className="w-full max-w-sm rounded-lg shadow-md"
      />
    </div>
  )}

  <Button
    type="button"
    onClick={handleVerify}
   className="w-full bg-green-600  hover:bg-green-700 text-white text-lg py-6 px-10  font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
    

   
  >
    Verify Waste
  </Button>
</form>



{verificationStatus === 'verifying' && <p>Verifying waste...</p>}
{verificationStatus === 'success' && (
  <div className="p-4 bg-green-100 text-green-800 rounded-lg mt-2">
    <h4>Verification Successful!</h4>
    <p>Waste Type: {verificationResult.wasteType}</p>
    <p>Estimated Quantity: {verificationResult.quantity}</p>
    <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
  </div>
)}
{verificationStatus === 'failure' && (
  <div className="p-4 bg-red-100 text-red-800 rounded-lg">
    <p>Verification failed. Please try again.</p>
  </div>
)}
</div>

<form onSubmit={handleReportSubmit} className="space-y-4 mt-6">
  {/* <h3 className="text-xl font-medium mb-2 text-gray-700">Add Report</h3> */}

  {/* Waste Type */}
  <label className='
  block
  text-sm
  font-medium
  text-gray-700
  mb-[-2]
  
  
  '>
    Waste Type:
  </label>
  <input
    type="text"
    value={newReport?.wasteType || ""}
    placeholder="Waste Type"
    className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
    required
    disabled
  />

  {/* Waste Amount */}
  <label className='
  block
  text-sm
  font-medium
  text-gray-700
  mb-2
  
  
  '>
    Waste Amount:
  </label>
  <input
    type="text"
    value={newReport?.amount || ""}
    placeholder="Amount of Waste"
    className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
    required
    disabled
  />

  {/* Confidence Level */}
  <label className='
  block
  text-sm
  font-medium
  text-gray-700
  mb-2

  
  '>
    Confidence Level:
  </label>
  <input
    type="number"
    value={newReport?.confidence ? (newReport.confidence*1).toFixed(1) : ""}
    placeholder="Confidence Level (%)"
    className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
    required
    disabled
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

  <button
    type="submit"
    className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600"
  >
    Submit
  </button>
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
