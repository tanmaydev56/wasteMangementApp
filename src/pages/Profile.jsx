import React, { useEffect, useState } from 'react';
import { getUserInfo, updateUserInfo } from '../../appwrite'; // Adjust the path to appwrite.js
import { PencilIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const documentId = "67265b7ee5380710a5c1"; // Replace with the actual document ID
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
      const userId = "67265b7ee5380710a5c1"; // Replace with the actual user ID
      await updateUserInfo(userId, userData);
      alert("User info updated successfully!");
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Failed to update user info.");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <motion.div
      className="h-screen w-full flex items-center justify-center bg-gray-100"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="max-w-2xl w-full p-8 bg-white shadow-lg rounded-lg transition-all duration-300">
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
            key={isEditing} // Helps Framer Motion to recognize the changing state
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isEditing ? 1 : 0, height: isEditing ? 'auto' : 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }} // Adjust the duration as needed
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
  );
};

export default ProfilePage;
