import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Change from '../ProjectChange/Change';
import Client from '../Client/Client';
import Employee from '../Employee/Employee';
import EmployeeForm from '../Employee/EmployeeForm';
import Meeting from '../Meeting/Meeting';
import Payment from '../Payment/Payment';
import Project from '../Project/Project';
import ProjectEmployees from '../Project/ProjectEmployees.js';
import ProjectDetails from '../ProjectDetails/ProjectDetails.js';

const Layout = () => {
    return (
        <div className='container-fluid '>
            <Navbar/>
            <div className="content">
                <Routes>
                    <Route path="/change-project" element={<Change />} />
                    <Route path="/client" element={<Client />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/employee-form/:empId?" element={<EmployeeForm />} />
                    <Route path="/meeting" element={<Meeting />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/project" element={<Project />} />
                    <Route path="/projectEmployees" element={<ProjectEmployees />} />
                    <Route path="/projectDetails/:projectId?" element={<ProjectDetails />}/>
                </Routes>
            </div>
        </div>
    );
};

export default Layout;
