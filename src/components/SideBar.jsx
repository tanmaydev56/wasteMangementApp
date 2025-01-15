
import { FaHome, FaMapMarkerAlt, FaTrashAlt, FaGift, FaCog, FaNewspaper } from 'react-icons/fa';
import { MdBugReport } from 'react-icons/md';

import { NavLink } from 'react-router-dom';

const SideBar = ({ isVisible }) => {
  return (
    <div
      className={`${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } fixed top-0 left-0 h-screen w-56 p-4 border-r border-gray-200 bg-white transition-transform duration-300 z-40`}
    >
      <div className="space-y-4 mt-20">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer ${
              isActive ? 'bg-green-100 text-green-700' : ''
            }`
          }
        >
          <FaHome className="mr-2" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/report-waste"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer ${
              isActive ? 'bg-green-100 text-green-700' : ''
            }`
          }
        >
          <FaMapMarkerAlt className="mr-2" />
          <span>Report Waste</span>
        </NavLink>
        <NavLink
          to="/collectwaste"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer ${
              isActive ? 'bg-green-100 text-green-700' : ''
            }`
          }
        >
          <MdBugReport className="mr-2" />
          <span>Submitted Reports</span>
        </NavLink>
        <NavLink
          to="/rewards"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer ${
              isActive ? 'bg-green-100 text-green-700' : ''
            }`
          }
        >
          <FaGift className="mr-2" />
          <span>Rewards</span>
        </NavLink>
        <NavLink
          to="/news"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer ${
              isActive ? 'bg-green-100 text-green-700' : ''
            }`
          }
        >
          <FaNewspaper className="mr-2" />
          <span>News</span>
        </NavLink>
       
      </div>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `lg:mt-[350px] mt-[280px] flex items-center p-2 rounded-md cursor-pointer ${
            isActive ? 'bg-green-100 text-green-700' : ''
          }`
        }
      >
        <FaCog className="mr-2" />
        <span>Settings</span>
      </NavLink>
    </div>
  );
};

export default SideBar;
