
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from "react-bootstrap/Spinner";
import { FaPlus, FaEdit, FaTrash,FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const Project = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [allClients, setAllClients] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const navigate =useNavigate();
    const [formData, setFormData] = useState({
        clientProjectId: 0,
        projectName: "",
        startDate: "",
        expectedEndDate: "",
        leadByEmpId: 0,
        completedDate: "",
        contactPerson: "",
        contactPersonContactNo: "",
        totalEmpWorking: "",
        projectCost: "",
        projectDetails: "",
        contactPersonEmailId: "",
        clientId: ""
    });
    console.log(formData)
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        getAllClients();
        getAllProjects();
        getAllEmployees();
    }, []);

    const getAllClients = async () => {
        try {
            const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllClients', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setAllClients(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const getAllProjects = async () => {
      setIsLoading(true);
        try {
            const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllClientProjects', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setAllProjects(response.data.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const getAllEmployees = async () => {
        try {
            const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllEmployee', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setAllEmployees(response.data.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSave = async () => {
        if (validateForm()) {

            try {
                const response = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/AddUpdateClientProject", formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                    }
                });
                if (response.data.result) {
                    toast.success("Project added successfully");
                    handleReset();
                    handleCloseModal();

                } else {
                    toast.error(response.data.message);
                }
                getAllProjects();
            } catch (error) {
                console.error('Error adding project:', error);
                toast.error('Error adding project');
            }
        }
    };

    const handleUpdate = async () => {
        if (validateForm()) {
            try {

                const response = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/AddUpdateClientProject", formData);
                if (response.data.result) {
                    toast.success("Project added successfully");
                    handleReset();
                    handleCloseModal();
                    getAllProjects();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error('Error adding project:', error);
                toast.error('Error adding project');
            }
        }
    };

    const handleDelete = async (projectId) => {
        try {

            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this project!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });


            if (confirmation.isConfirmed) {
                const response = await axios.delete(`https://freeapi.gerasim.in/api/ClientStrive/DeleteProjectByProjectId?projectId=${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                    }
                });
                if (response.data.result) {
                    Swal.fire(
                        'Error!',
                        response.data.data,
                        'error'
                    );
                    getAllProjects();
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Error deleting project');
        }
    };


    const handleEdit = async (projectId) => {
        debugger;
        try {
            const response = await axios.get(`https://freeapi.gerasim.in/api/ClientStrive/GetProjectByProjectId?clientProjectId=${projectId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setFormData(response.data.data);
            handleShowModal();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Error deleting project');
        }
    };

    const handleView = (projectId) => {

      navigate(`/projectDetails/${projectId}`);
    }
    const handleReset = () => {
        setFormData({
            projectName: "",
            startDate: "",
            expectedEndDate: "",
            leadByEmpId: "",
            completedDate: "",
            contactPerson: "",
            contactPersonContactNo: "",
            totalEmpWorking: "",
            projectCost: "",
            projectDetails: "",
            contactPersonEmailId: "",
            clientId: ""
        });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormErrors({
            projectName: "",
            startDate: "",
            expectedEndDate: "",
            leadByEmpId: "",
            completedDate: "",
            contactPerson: "",
            contactPersonContactNo: "",
            contactPersonEmailId: "",
            totalEmpWorking: "",
            projectCost: "",
            projectDetails: "",
            clientId: ""
        });
    };


    const [formErrors, setFormErrors] = useState({
        projectName: "",
        startDate: "",
        expectedEndDate: "",
        leadByEmpId: "",
        completedDate: "",
        contactPerson: "",
        contactPersonContactNo: "",
        contactPersonEmailId: "",
        totalEmpWorking: "",
        projectCost: "",
        projectDetails: "",
        clientId: ""
    });
    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (formData.projectName.trim() === "") {
            errors.projectName = "Project Name is required";
            isValid = false;
        }

        if (formData.startDate.trim() === "") {
            errors.startDate = "Start Date is required";
            isValid = false;
        }

        if (formData.expectedEndDate.trim() === "") {
            errors.expectedEndDate = "Expected End Date is required";
            isValid = false;
        }

        if (!formData.leadByEmpId) {
            errors.leadByEmpId = "Lead By Employee ID is required";
            isValid = false;
        }

        if (formData.completedDate.trim() === "") {
            errors.completedDate = "Completed Date is required";
            isValid = false;
        }

        if (formData.contactPerson.trim() === "") {
            errors.contactPerson = "Contact Person is required";
            isValid = false;
        }

        if (formData.contactPersonContactNo.trim() === "") {
            errors.contactPersonContactNo = "Contact Person Contact No is required";
            isValid = false;
        }

        if (formData.contactPersonEmailId.trim() === "") {
            errors.contactPersonEmailId = "Contact Person Email is required";
            isValid = false;
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formData.contactPersonEmailId)) {
                errors.contactPersonEmailId = "Invalid Email Format";
                isValid = false;
            }
        }
        if (formData.totalEmpWorking.toString().trim() === "") {
            errors.totalEmpWorking = "Total EmpWorking is required";
            isValid = false;
        }

        if (formData.projectCost.toString().trim() === "") {
            errors.projectCost = "Project Cost is required";
            isValid = false;
        }

        if (formData.projectDetails.trim() === "") {
            errors.projectDetails = "Project Details is required";
            isValid = false;
        }

        if (!formData.clientId) {
            errors.clientId = "Client Name is required";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    return (
        <>

            <div className='row'>
                <div className="col-12">
                    <div className="card bg-light">
                        <div className="card-header bg-info">
                            <div className="row mt-2">
                                <div className="col-md-10 text-center">
                                    <h1>Project Details</h1>
                                </div>
                                <div className="col-md-2">
                                    <Button variant="success" onClick={handleShowModal}>
                                        <FaPlus /> Add Project
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className='table table-bordered table-striped'>
                                    <thead>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Project Name</th>
                                            <th>Client Name</th>
                                            <th>Employee Name</th>
                                            <th>Employee EmailId</th>
                                            <th>Employee Designation</th>
                                            <th>Start Date</th>
                                            <th>Expected End Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                  {isLoading ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: 200 }}
                    >
                      <Button variant="primary" disabled>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>
                    </div>
                  ) : (
                    <>
                      {allProjects.map((project, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{project.projectName}</td>
                          <td>{project.clientName}</td>
                          <td>{project.empName}</td>
                          <td>{project.empEmailId}</td>
                          {/* <td>{project.empDesignation}</td> */}
                          <td>{project.startDate.split("T")[0]}</td>
                          <td>{project.expectedEndDate.split("T")[0]}</td>
                          <td>
                            <button
                              className="btn btn-col-1 btn-primary mx-2"
                              onClick={() =>
                                handleView(project.clientProjectId)
                              }
                            >
                              <FaEye />
                            </button>
                            <button
                              className="btn btn-col-1 btn-primary mx-2"
                              onClick={() =>
                                handleEdit(project.clientProjectId)
                              }
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-col-1 btn-danger mx-2"
                              onClick={() =>
                                handleDelete(project.clientProjectId)
                              }
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className='bg-light'>
                    <Modal.Title>Add Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='card-body'>
                        <div className="row">
                            <div className="col-12">
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <label>Client Name</label>
                                        <select className='form-select' name="clientId" value={formData.clientId} onChange={handleInputChange}>
                                            <option value="">Select Client</option>
                                            {allClients.map((client) => (
                                                <option key={client.clientId} value={client.clientId}>{client.companyName}</option>
                                            ))}
                                        </select>
                                        <small className="text-danger">{formErrors.clientId}</small>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Project Name</label>
                                        <input type="text" value={formData.projectName} className='form-control' onChange={handleInputChange} name='projectName' placeholder='Project Name' />
                                        <small className="text-danger">{formErrors.projectName}</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md-6'>
                                        <label>Project Details</label>
                                        <input type="text" value={formData.projectDetails} className='form-control' onChange={handleInputChange} name='projectDetails' />
                                        <small className="text-danger">{formErrors.projectDetails}</small>
                                    </div>
                                    <div className='col-md-6'>
                                        <label>Project Cost</label>
                                        <input type="number" value={formData.projectCost} className='form-control' onChange={handleInputChange} name='projectCost' />
                                        <small className="text-danger">{formErrors.projectCost}</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md-6'>
                                        <label>Contact Person</label>
                                        <input type="text" value={formData.contactPerson} className='form-control' onChange={handleInputChange} name='contactPerson' />
                                        <small className="text-danger">{formErrors.contactPerson}</small>
                                    </div>
                                    <div className='col-md-6'>
                                        <label>Contact Person Contact No</label>
                                        <input type="text" value={formData.contactPersonContactNo} className='form-control' onChange={handleInputChange} name='contactPersonContactNo' />
                                        <small className="text-danger">{formErrors.contactPersonContactNo}</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md-6'>
                                        <label>Contact Person Email</label>
                                        <input type="email" value={formData.contactPersonEmailId} className='form-control' onChange={handleInputChange} name='contactPersonEmailId' />
                                        <small className="text-danger">{formErrors.contactPersonEmailId}</small>
                                    </div>
                                    <div className='col-md-6'>
                                        <label>Lead By Employee ID</label>
                                        <select className='form-select' name="leadByEmpId" value={formData.leadByEmpId} onChange={handleInputChange}>
                                            <option value="">Select Employee</option>
                                            {allEmployees.map((emp) => (
                                                <option key={emp.empId} value={emp.empId}>{emp.empName}</option>
                                            ))}
                                        </select>
                                        <small className="text-danger">{formErrors.leadByEmpId}</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md-6'>
                                        <label>Total EmpWorking</label>
                                        <input type="number" value={formData.totalEmpWorking} className='form-control' onChange={handleInputChange} name='totalEmpWorking' />
                                        <small className="text-danger">{formErrors.totalEmpWorking}</small>
                                    </div>
                                    <div className='col-md-6'>
                                        <label>Start Date</label>
                                        <input type="datetime-local" value={formData.startDate} className='form-control' onChange={handleInputChange} name='startDate' />
                                        <small className="text-danger">{formErrors.startDate}</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md-6'>
                                        <label>Expected End Date</label>
                                        <input type="datetime-local" value={formData.expectedEndDate} className='form-control' onChange={handleInputChange} name='expectedEndDate' />
                                        <small className="text-danger">{formErrors.expectedEndDate}</small>
                                    </div>
                                    <div className='col-md-6'>
                                        <label>Completed Date</label>
                                        <input type="datetime-local" value={formData.completedDate} className='form-control' onChange={handleInputChange} name='completedDate' />
                                        <small className="text-danger">{formErrors.completedDate}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <div className="col-12 text-center">
                        {formData.clientProjectId === 0 && (
                            <button type='button' className='btn btn-sm btn-primary m-2' onClick={handleSave}>
                                {isLoading ? 'Saving...' : 'Submit'}
                            </button>
                        )}
                        {formData.clientProjectId !== 0 && (
                            <button type='button' className='btn btn-sm btn-warning m-2' onClick={handleUpdate}>
                                {isLoading ? 'Saving...' : 'Update'}
                            </button>
                        )}
                        <button type='button' className='btn btn-sm btn-secondary' onClick={handleReset} >Reset</button>
                    </div>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default Project;