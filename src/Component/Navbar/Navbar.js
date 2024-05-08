import React from 'react';
import { Link } from 'react-router-dom';
// import BreadCrumb from '';


const Navbar = () => {
  const onLogout = () => {
    localStorage.removeItem("loginToken");

  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-info mb-2">
        <div className="container">
          <Link className="navbar-brand" to="/">Navbar</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/Employee">Employee</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/Client">Client</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/Project">Project</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/projectEmployees">Project Employees</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/Meeting">Meeting</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/Change-project">Change Project</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/Payment">Payment</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/projectDetails">Project Details</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="d-flex ">
          {/* <div className="d-flex ">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </div> */}
          <div style={{ marginLeft: '20px' }}>
            <button className='btn btn-danger'><Link className="nav-link" to="/login" onClick={onLogout}>Log-Out</Link></button>
          </div>
        </div>
      </nav>

      {/* <BreadCrumb/> */}
    </>

  );
};

export default Navbar;
