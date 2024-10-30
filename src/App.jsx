import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CollectWaste from './components/CollectWaste';
import ReportWaste from './pages/ReportWaste';
import News from './pages/News';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collectwaste" element={<CollectWaste />} />
        <Route path="/report-waste" element={<ReportWaste />} />
        <Route path="/News" element={<News />} />
      </Routes>
    </Router>
  );
}

export default App;
