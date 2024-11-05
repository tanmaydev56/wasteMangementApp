import  { useEffect, useState } from 'react';
import { fetchUserDocumentByEmail, getUserInfo, updateUserInfo } from '../../appwrite';
import { PencilIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaArrowAltCircleLeft, FaCheckCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 

const ProfilePage = () => {
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = "tanmaysharma763@gmail.com"; 
        const documentId = await fetchUserDocumentByEmail(email);
        const data = await getUserInfo(documentId);
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const userId = "67265b7ee5380710a5c1"; 
      await updateUserInfo(userId, userData);
      setShowSuccessMessage(true); 
      setIsEditing(false); 

 
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Failed to update user info.");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className='h-screen w-full flex items-center justify-center bg-gray-100'>
         {showSuccessMessage && ( 
          <motion.div
            initial={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute flex gap-2 top-6 bg-green-500  text-white p-4 rounded-lg shadow-lg"
          >
            <h1>Changes have been saved successfully!</h1>
            <FaCheckCircle className="mt-[5.5px] text-white" />
          </motion.div>
        )}
    <motion.div
      className=""
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
       <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-10 left-10 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
        >
          <div className='flex '>
          Back to Dashboard
          <FaArrowAltCircleLeft className="ml-3 mt-[5px] h-[18px] w-[18px]" />
          </div>
        </button>
      <div className="max-w-2xl w-full p-8 bg-white shadow-lg rounded-lg transition-all duration-300 relative">
       
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-600">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-green-600 hover:text-green-800 transition-colors duration-300 focus:outline-none"
          >
            <PencilIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="text-gray-700 space-y-2">
            {/* Display user information */}
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phoneNumber}</p>
            <p><strong>Bio:</strong> {userData.bio}</p>
          </div>

          <motion.div
            key={isEditing}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isEditing ? 1 : 0, height: isEditing ? 'auto' : 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }} 
          >
            {isEditing && (
              <>
                <label className="block">
                  <span className="text-gray-700">Name:</span>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="mt-1 block p-4 w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all duration-300"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Email:</span>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-4 border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all duration-300"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Phone:</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 p-4 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all duration-300"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Bio:</span>
                  <textarea
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block p-4 w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all duration-300"
                  />
                </label>
                <motion.button
                  onClick={handleUpdate}
                  className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </motion.button>
              </>
            )}
          </motion.div>
        </div>

     
      </div>
    </motion.div>
    </div>
  );
};

export default ProfilePage;
