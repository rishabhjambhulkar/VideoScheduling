import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import {  logoutUser } from "../../Actions/User";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  HomeOutlined,
  CalendarToday,
  CalendarTodayOutlined,
  Dashboard,
  DashboardOutlined,
} from "@mui/icons-material";
import Logout from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';

const Header = () => {
  const [tab, setTab] = useState(window.location.pathname);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    // Log all cookies on component mount
    console.log("All Cookies:", document.cookie);
    
    // Log all items in localStorage
    console.log("All LocalStorage Items:");
    for (const [key, value] of Object.entries(localStorage)) {
      console.log(`${key}: ${value}`);
    }
  }, []);

  const handleLogout = () => {
    // Remove the 'authToken' from localStorage
    localStorage.removeItem('authToken');
  
      dispatch(logoutUser());
     
    // Remove the 'token' cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    // Optionally navigate to home or login page
    navigate('/');
  };

  return (
    <div className="header">
      <Link to="/" onClick={() => setTab("/Home")}>
        {tab === "/Home" ? <Home style={{ color: "black" }} /> : <HomeOutlined />}
      </Link>

      <Link to="/calendar" onClick={() => setTab("/calendar")}>
        {tab === "/calendar" ? <CalendarToday style={{ color: "black" }} /> : <CalendarTodayOutlined />}
      </Link>

      {/* Add Logout Icon Button */}
      <IconButton onClick={handleLogout} className="logout-button">
        <Logout />
      </IconButton>

      {user && user.role === 'admin' && (
        <Link to="/dashboard" onClick={() => setTab("/dashboard")}>
          {tab === "/dashboard" ? <Dashboard style={{ color: "black" }} /> : <DashboardOutlined />}
        </Link>
      )}
    </div>
  );
};

export default Header;
