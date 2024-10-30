// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CollectWaste from './components/CollectWaste';
import ReportWaste from './pages/ReportWaste';
import News from './pages/News';
import Rewards from './pages/Rewards';
import NotFound from './pages/NotFound'; // Create this component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collectwaste" element={<CollectWaste />} />
        <Route path="/report-waste" element={<ReportWaste />} />
        <Route path="/news" element={<News />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
      </Routes>
    </Router>
  );
}

export default App;
