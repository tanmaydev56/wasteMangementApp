import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CollectWaste from './components/CollectWaste';
import ReportWaste from './pages/ReportWaste';
import News from './pages/News';
import Rewards from './pages/Rewards';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import CollectPage from './pages/Temp';

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/collectwaste",
    element: <CollectWaste />,
  },
  {
    path: "/report-waste",
    element: <ReportWaste />,
  },
  {
    path: "/news",
    element: <News />,
  },
  {
    path: "/rewards",
    element: <Rewards />,
  },
  {
    path: "/profile",
    element: <Profile userId={localStorage.getItem('userToken')} />,
  },
  {
    path:"/modelGemini",
    element:<CollectPage/>
  },
  {
    path: "*",
    element: <NotFound />,
  },
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
