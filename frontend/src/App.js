import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import {useState, useEffect } from "react";
import { loadUser } from "./Actions/User";
import Home from "./Components/Home/Home";

import Register from "./Components/Register/Register";

import NotFound from "./Components/NotFound/NotFound";
import Calendar from "./Components/Calendar/Calendar";
import AdminDashboard from "./Components/Dashboard/Dashboard"; 


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("Token after refresh:", localStorage.getItem('authToken'));
    dispatch(loadUser());
  }, [dispatch]);


  const { user } = useSelector((state) => state.user);
  return (
    <Router>
      {isAuthenticated && <Header />}

      <Routes>
      
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        
        <Route path="/calendar" element={isAuthenticated ? <Calendar /> : <Login />} />
        
        {/* <Route
          path="/account"
          element={isAuthenticated ? <Home /> : <Login />}
        /> */}

        <Route
          path="/register"
          element={isAuthenticated ? <Home /> : <Register />}
        />
         <Route path="/dashboard" element={isAuthenticated && user.role === 'admin' ? <AdminDashboard /> : <Login />} />
   
      </Routes>
    </Router>
  );
}

export default App;
