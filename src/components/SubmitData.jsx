import { useState, useEffect } from 'react';
import { addReport, getReportCount } from '../../appwrite'; 
import { Button } from '../components/ui/button'; 
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const SubmitData = () => {
  const [reportAmount, setReportAmount] = useState('');
  const [userid, setUserid] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportCount, setReportCount] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const count = await getReportCount();
        setReportCount(count);
      
        const exampleData = [
          { name: 'Reports', value: count },
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
    const reportAmountInt = parseInt(reportAmount, 10); // Convert reportAmount to an integer

    if (!isNaN(reportAmountInt) && userid && title && description) {
      try {
        // Prepare the report data object
        const reportData = {
          title,
          description,
          reportAmount: reportAmountInt,
          userid,
        };

        // Call the addReport function with the report data object
        await addReport(reportData);
        
        // Clear input fields after submission
        setReportAmount('');
        setUserid('');
        setTitle('');
        setDescription('');

        // Optionally, you can refetch the report count after a successful submission
        const count = await getReportCount();
        setReportCount(count);
        
        // Update the data for the chart
        const exampleData = [
          { name: 'Reports', value: count },
        ];
        setData(exampleData);

      } catch (error) {
        console.error("Error submitting report:", error);
      }
    } else {
      console.error("All fields must be filled out and report amount must be a valid integer.");
    }
  };

  const COLORS = ['#34D399', '#3B82F6', '#F87171'];

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Submit Data (Testing)</h2>
      <p className="text-gray-500 mb-4 text-lg">Total Reports Submitted: <span className="font-bold">{reportCount}</span></p>

      {/* Circular Graph */}
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

      <form onSubmit={handleReportSubmit} className="space-y-4">
        <h3 className="text-xl font-medium mb-2 text-gray-700">Add Report</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="number"
          value={reportAmount}
          onChange={(e) => setReportAmount(e.target.value)}
          placeholder="Amount of waste collected (kg)"
          className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="text"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          placeholder="User ID"
          className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg">
          Submit Report
        </Button>
      </form>
    </div>
  );
};

export default SubmitData;
