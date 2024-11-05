import SideBar from '../components/SideBar';
import { Leaf, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser, FaArrowRight, FaUsers } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Coins } from 'lucide-react';
import { getRecentReports, getAllRewards, getRewardBalance } from "../../appwrite"; 
import Chart from '../components/charts';

const Dashboard = () => {
  const [impactData, setImpactData] = useState({   
    wasteCollected: 1000,
    wasteRecycled: 500, 
    reportsSubmitted: 16,
    tokensEarned: 1532,
    co2Offset: 254
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const recentReports = await getRecentReports();
        const allRewards = await getAllRewards();
    

        setImpactData({
          wasteCollected: 1000, 
          wasteRecycled: 500, 
          reportsSubmitted: recentReports.length, 
          tokensEarned: allRewards.reduce((total, reward) => total + reward.amount, 0),
          co2Offset: 254 
        });
      } catch (error) {
        console.error("Error fetching impact data:", error);
      }
    };
    const fetchBalance = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const userBalance = await getRewardBalance(userEmail); 
          setBalance(userBalance);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    fetchImpactData();
    fetchBalance();
  }, []);
  

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="flex flex-grow flex-col gap-10 lg:mt-40 mt-20">
        <SideBar className="z-100" isVisible={showSidebar} />
        <div className="flex flex-grow flex-col items-center mt-[50px] ml-[60px]">
          <div className="relative w-32 h-32 mb-[40px] z-[-10] lg:ml-0 ml-[-50px]">
            <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
            <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
            <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
            <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse" />
          </div>
          <h1 className="lg:text-6xl text-4xl font-bold mb-6 text-gray-800 tracking-tight">
            GreenFuture <span className="text-green-600">Waste Management</span>
          </h1>
          <p className="lg:text-2xl text-xl text-gray-600 w-full mx-auto leading-start flex justify-center items-center mb-8">
            Join our community in making waste management more efficient and rewarding!
          </p>
          <Button onClick={() => navigate('/collectwaste')} className="lg:ml-0 ml-[-50px] bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started
            <FaArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Feature and Impact Sections */}
        <section className="grid md:grid-cols-3 gap-10 mb-10">
          <FeatureCard icon={Leaf} title="Eco-Friendly" description="Contribute to a cleaner environment by reporting and collecting waste." />
          <FeatureCard icon={Coins} title="Earn Rewards" description="Get tokens for your contributions to waste management efforts." />
          <FeatureCard icon={FaUsers} title="Community-Driven" description="Be part of a growing community committed to sustainable practices." />
        </section>
        
        <section className="bg-white p-10 rounded-3xl shadow-lg mb-10">
          <h2 className="text-4xl font-bold mb-12 mt-[-50px] text-center text-gray-800">Our Impact</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ImpactCard title="Waste Collected" value={`${impactData.wasteCollected} kg`} icon={Leaf} />
            <ImpactCard title="Waste Recycled" value={`${impactData.wasteRecycled} kg`} icon={Leaf} /> {/* New Impact Card */}
            <ImpactCard title="Reports Submitted" value={impactData.reportsSubmitted.toString()} icon={MapPin} />
            <ImpactCard title="Tokens Earned" value={impactData.tokensEarned.toString()} icon={Coins} />
          </div>
        </section>
      
      </div>
      <div className='flex justify-center lg:translate-x-0 translate-x-[-30px] items-center w-full'>
      <Chart />
      </div>
    </div>
  );
};

function ImpactCard({ title, value, icon: Icon }) {
  return (
    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className="h-10 w-10 text-green-500 mb-4" />
      <p className="text-3xl font-bold mb-2 text-gray-800">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <Icon className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default Dashboard;
