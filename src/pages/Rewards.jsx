import React, { useState, useEffect } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import SideBar from '../components/SideBar';
import { Coins, ArrowUpRight, ArrowDownRight, Gift, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllRewards } from '../../appwrite'; // Import your getAllRewards function

const sampleTransactions = [
  { id: 1, type: 'earned_report', amount: 10, description: 'Reported waste', date: '2024-10-28' },
  { id: 2, type: 'redeemed', amount: 5, description: 'Redeemed reward', date: '2024-10-29' }
];

const Rewards = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [balance, setBalance] = useState(15); // Initial balance
  const [redeemedRewards, setRedeemedRewards] = useState(new Set());
  const [transactions] = useState(sampleTransactions);
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // Fetch rewards from database
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewardsData = await getAllRewards();
        setRewards(rewardsData);
      } catch (error) {
        toast.error("Error fetching rewards");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, []);

  // Calculate total points from available rewards
  const totalPoints = rewards.reduce((sum, reward) => sum + (reward.amount || 0), 0);

  const handleRedeemReward = (rewardId) => {
    const reward = rewards.find(r => r.rewardid === rewardId); // Find the reward by ID
    if (reward && reward.amount) { // Check if the reward has an amount
      setBalance(prevBalance => prevBalance + reward.amount); // Update the balance
      setRedeemedRewards(prev => new Set(prev).add(reward.rewardid)); // Add the redeemed reward to the Set
      toast.success(`Successfully redeemed: ${reward.title || 'Reward'} - Added ${reward.amount} points`);
    } else {
      toast.error('Reward cannot be redeemed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); 
    navigate('/login'); 
  };

  const handleRedeemAllPoints = () => {
    if (balance > 0) {
      setBalance(0);
      toast.success('All points redeemed successfully');
    } else {
      toast.error('No points available to redeem');
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-screen w-full flex">
      <SideBar isVisible={!showSidebar} />

      <div className="flex-grow flex flex-col">
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
            <input type="text" placeholder="Search..." className="flex-grow bg-transparent outline-none text-gray-600" />
            <FaSearch className="text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <FaBell className="text-gray-500" />
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
              <FaLeaf className="text-green-500" />
              <span className="text-sm font-semibold text-gray-800">{balance.toFixed(2)}</span>
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
        
        <div className='flex justify-center w-full items-center mt-[100px]'>
          <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Rewards</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full border-l-4 border-green-500 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Reward Balance</h2>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center justify-between w-full">
                  <div className='flex'>
                    <Coins className="w-10 h-10 mr-3 text-green-500" />
                    <div>
                      <span className="text-4xl font-bold text-green-500">{totalPoints}</span>
                      <p className="text-sm text-gray-500">Total Available Points</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleRedeemAllPoints} 
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Redeem All Points
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2  gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Transactions</h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {transactions.length > 0 ? (
                    transactions.map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center">
                          {transaction.type === 'earned_report' ? (
                            <ArrowUpRight className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-500 mr-3" />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                        <span className={`font-semibold ${transaction.type.startsWith('earned') ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.type.startsWith('earned') ? '+' : '-'}{transaction.amount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No transactions yet</div>
                  )}
                </div>
              </div>

           
            </div>
            <div className='flex flex-col mt-10'>
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Rewards</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:w-[1000px] w-auto"> {/* Grid layout */}
    {rewards.length > 0 ? (
      rewards.map(reward => (
        <div key={reward.$id} className="bg-white  flex justify-between  p-4 rounded-xl shadow-md relative">
          <div className='flex flex-col'>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {reward.title || "No Title"}
          </h3>
          <p className="text-gray-500 mb-4">
            {reward.description || "No Description"}
          </p>
          <Button 
            onClick={() => handleRedeemReward(reward.rewardid)} 
            className={`mt-4  ${redeemedRewards.has(reward.rewardid) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`} 
            disabled={redeemedRewards.has(reward.rewardid)}
          >
            {redeemedRewards.has(reward.rewardid) ? 'Redeemed' : 'Redeem Reward'}
          </Button>
          </div>
          <span className="text-lg font-bold text-green-500">{reward.amount} points</span>
         
        </div>
      ))
    ) : isLoading ? (
      <div className="p-4 text-center text-gray-500">Loading rewards...</div>
    ) : (
      <div className="p-4 text-center text-gray-500">No rewards available</div>
    )}
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
