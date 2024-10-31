// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CollectWaste from './components/CollectWaste';
import ReportWaste from './pages/ReportWaste';
// import News from './pages/News';
import Rewards from './pages/Rewards';
import NotFound from './pages/NotFound'; // Create this component
import SubmitData from './components/SubmitData';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collectwaste" element={<CollectWaste />} />
       
     
        <Route path="/report-waste" element={<ReportWaste />} />
        {/* <Route path="/news" element={<News />} /> */}
        <Route path="/rewards" element={<Rewards />} />
        <Route path="*" element={<NotFound />} />
        <Route path='/submitdata' element={<SubmitData />} />
      </Routes>
    </Router>
  );
}

export default App;
