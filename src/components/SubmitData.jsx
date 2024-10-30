import { useState } from 'react';
import { addReport, addReward } from '../../appwrite'; // Adjust the import path as necessary
import { Button } from '../components/ui/button'; // Ensure correct path for your button component

const SubmitData = () => {
  const [reportAmount, setReportAmount] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [userid, setUserid] = useState(''); // Replace with actual user ID logic if needed

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const reportAmountInt = parseInt(reportAmount, 10); // Convert reportAmount to an integer
    if (!isNaN(reportAmountInt) && userid) {
      await addReport(reportAmountInt, userid);
      setReportAmount(''); // Clear input after submission
    } else {
      console.error("Report amount must be a valid integer.");
    }
  };

  const handleRewardSubmit = async (e) => {
    e.preventDefault();
    const rewardAmountInt = parseInt(rewardAmount, 10); // Convert rewardAmount to an integer
    if (!isNaN(rewardAmountInt) && userid) {
      await addReward(rewardAmountInt, userid);
      setRewardAmount(''); // Clear input after submission
    } else {
      console.error("Reward amount must be a valid integer.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit Data</h2>
      
      <form onSubmit={handleReportSubmit} className="mb-4">
        <h3 className="text-xl mb-2">Add Report</h3>
        <input
          type="number"
          value={reportAmount}
          onChange={(e) => setReportAmount(e.target.value)}
          placeholder="Amount of waste collected (kg)"
          className="border border-gray-300 rounded p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          placeholder="User ID"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          required
        />
        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
          Submit Report
        </Button>
      </form>

      <form onSubmit={handleRewardSubmit}>
        <h3 className="text-xl mb-2">Add Reward</h3>
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
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          placeholder="User ID"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          required
        />
        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
          Submit Reward
        </Button>
      </form>
    </div>
  );
};

export default SubmitData;
