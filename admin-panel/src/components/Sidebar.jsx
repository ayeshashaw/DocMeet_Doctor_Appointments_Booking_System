import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  UserPlus, 
  Users, 
  Settings, 
  HelpCircle,
  UserCircle
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import './Style.css';  

function Sidebar() {
  const location = useLocation();
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  // Determine which user type is logged in
  const isAdmin = !!aToken;
  const isDoctor = !!dToken;

  // Admin sidebar items
  const adminSidebarItems = [
    {
      path: '/admin-dashboard',
      icon: <LayoutDashboard />,
      label: 'Dashboard'
    },
    {
      path: '/all-appointments',
      icon: <Calendar />,
      label: 'Appointments'
    },
    {
      path: '/add-doctors',
      icon: <UserPlus />,
      label: 'Add Doctors'
    },
    {
      path: '/doctors-list',
      icon: <Users />,
      label: 'Doctors List'
    }
  ];

  // Doctor sidebar items - updated to match provided routes
  const doctorSidebarItems = [
    {
      path: '/doctor-dashboard',
      icon: <LayoutDashboard />,
      label: 'Dashboard'
    },
    {
      path: '/doctor-appointments',
      icon: <Calendar />,
      label: 'Appointments'
    },
    {
      path: '/doctor-profile', // Updated to match route casing
      icon: <UserCircle />,
      label: 'Profile'
    }
  ];

  // Select the appropriate menu items based on user type
  const sidebarItems = isAdmin ? adminSidebarItems : 
                      isDoctor ? doctorSidebarItems : 
                      []; // Empty if no one is logged in

  const bottomSidebarItems = [
    {
      path: '/settings',
      icon: <Settings />,
      label: 'Settings'
    },
    {
      path: '/help-support',
      icon: <HelpCircle />,
      label: 'Help & Support'
    }
  ];

  return (
    <div className="sidebar" role="navigation">
      <div className="sidebar-logo">
        {isAdmin ? 'DocMeet Admin' : isDoctor ? 'DocMeet Doctor' : 'DocMeet'}
      </div>
      
      <nav>
        <div className="sidebar-main-menu">
          {sidebarItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="sidebar-bottom-menu">
          {bottomSidebarItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;