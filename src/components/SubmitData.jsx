import { useState, useEffect } from 'react';
import { addReport, getReportCount } from '../../appwrite'; 
import { Button } from '../components/ui/button'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SubmitData = () => {
  const [reportAmount, setReportAmount] = useState('');
  const [userid, setUserid] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportCount, setReportCount] = useState(0);
  const [data, setData] = useState([]);
/*************  ✨ Codeium Command ⭐  *************/
  /**
   .
   * @returns {Promise<void>}
   */
/******  3e83773a-b87b-44d7-9ac8-a2108b913358  *******/
  
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const count = await getReportCount();
        setReportCount(count);
      
        const exampleData = [
          { name: 'Reports', count: count },
        ];
        setData(exampleData);
      } catch (error) {
        console.error("Error fetching report count:", error);
      }
    };
    fetchReportData();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const reportAmountInt = parseInt(reportAmount, 10);
    if (!isNaN(reportAmountInt) && userid) {
      await addReport(reportAmountInt, userid, title, description);
      setReportAmount('');
      setTitle('');
      setDescription('');

     
      setReportCount((prevCount) => {
        const newCount = prevCount + 1;
        setData([{ name: 'Reports', count: newCount }]);
        return newCount;
      });
    } else {
      console.error("Report amount must be a valid integer.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit Data{"(Testing)"}</h2>
      <p className="mb-4">Total Reports Submitted: {reportCount}</p>

      {/* Graph */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <form onSubmit={handleReportSubmit} className="mb-4">
        <h3 className="text-xl mb-2">Add Report</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border border-gray-300 rounded p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border border-gray-300 rounded p-2 mb-2 w-full"
          required
        />
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
    </div>
  );
};

export default SubmitData;
