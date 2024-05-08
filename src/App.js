import React, { useState } from 'react';
import { BrowserRouter  as Router, Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Component/Auth/Login';
import Layout from './Component/Layout/Layout';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loginToken") == null ? false : true
  );

  return (
    <div className="App">
      <ToastContainer
        theme='colored'
        position="top-center" 
        autoClose={1000} 
        closeButton={false} 
      />
    <Router>
      <Routes>
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route
          path="/*"
          element={
            loggedIn ? <Layout /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  </div>
  );
};

export default App;