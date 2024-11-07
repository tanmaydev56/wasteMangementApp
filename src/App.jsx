import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CollectWaste from './components/CollectWaste';
import ReportWaste from './pages/ReportWaste';
import News from './pages/News';
import Rewards from './pages/Rewards';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
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
    path: "*",
    element: <NotFound />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
