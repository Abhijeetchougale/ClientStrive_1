
import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';;


const ProjectEmployees = () => {
    const [projectEmpObj, setProjectEmpObj] = useState({
        "projectEmpId": 0,
        "employeeId": '',
        "projectId": '',
        "addedDate": ""
    });
    const [allEmployee, setAllEmployee] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [allProjjectEmployees, setAllProjjectEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getAllEmp();
        getAllProjects();
        getAllEmpWorkOnProject();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectEmpObj((prevObj) => ({ ...prevObj, [name]: value }));
        setErrors({ ...errors, [name]: '' }); // Clear the error message when the field value changes
    };

    const getAllEmp = async () => {
        try {
            const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllEmployee', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setAllEmployee(response.data.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const getAllEmpWorkOnProject = async () => {
      setIsLoading(true);
        try {
            const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllProjectsEmployees', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setAllProjjectEmployees(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching employees working on projects:', error);
        }
    };

    const getAllProjects = async () => {
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

    const handleSave = async () => {
        if (IsValidate()) {
            try {
                const response = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/AddEmployeeToProject", projectEmpObj, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                    }
                });
                if (response.data.result) {
                    Swal.fire('Success!', 'Data Inserted Successfully', 'success');
                    handleReset();
                    getAllEmpWorkOnProject();
                } else {
                    Swal.fire('Error!', response.message, 'error');
                }
            } catch (error) {
                console.error('Error saving data:', error);
            }
        }
    };

    const handleDeleteData = async (id) => {
        try {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this data!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (confirmation.isConfirmed) {
                const response = await axios.delete(`https://freeapi.gerasim.in/api/ClientStrive/DeleteEmployeeFromProject?projectEmpId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                    }
                });
                if (response.data.data) {
                    Swal.fire('Error!', response.data.data, 'error');
                } else {
                    Swal.fire('Success!', response.data.message, 'success');
                    getAllEmpWorkOnProject();
                }
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleReset = () => {
        setProjectEmpObj({
            "projectEmpId": 0,
            "employeeId": '',
            "projectId": '',
            "addedDate": ""
        });
        setErrors({});
    };

    const IsValidate = () => {
        let isProceed = true;
        let newErrors = {};

        if (!projectEmpObj.employeeId) {
            newErrors = { ...newErrors, employeeId: 'Please select an Employee' };
            isProceed = false;
        }

        if (!projectEmpObj.projectId) {
            newErrors = { ...newErrors, projectId: 'Please select a Project' };
            isProceed = false;
        }

        if (!projectEmpObj.addedDate) {
            newErrors = { ...newErrors, addedDate: 'Please select an Added Date' };
            isProceed = false;
        }

        setErrors(newErrors);
        return isProceed;
    };

    return (
        <>
            <div className='row'>
                <div className="col-5 offset-1">
                    <div className="card bg-light">
                        <div className="crad-header bg-info p-2">
                            <h4 className='text-center'>Project Lead Employees</h4>
                        </div>
                        <div className="card-body">
                            <table className='table table-bordered '>
                                <thead>
                                    <tr>
                                        <th>Employee Name</th>
                                        <th>Project Name</th>
                                        <th>Added Date</th>
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
                      {allProjjectEmployees.map((item) => {
                        return (
                          <tr key={item.projectEmpId}>
                            <td>{item.empName}</td>
                            <td>{item.projectName}</td>
                            <td>{item.addedDate.split("T")[0]}</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleDeleteData(item.projectEmpId)
                                }
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='col-5'>
                    <div className="card bg-light">
                        <div className="card-header bg-info p-2">
                            <h4 className=' text-center'>Project Employee Form</h4>
                        </div>
                        <div className="card-body">
                            <Row>
                                
                                <Col>
                                    <Form.Group controlId="clientId">
                                        <Form.Label>Project Name</Form.Label>
                                        <select className='form-select' name="projectId" value={projectEmpObj.projectId} onChange={handleChange}>
                                            <option value="">Select Project</option>
                                            {allProjects.map((project) => (
                                                <option key={project.clientProjectId} value={project.clientProjectId}>
                                                    {project.projectName}
                                                </option>
                                            ))}
                                        </select>
                                        <Form.Text className="text-danger">{errors.projectId}</Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="projectDetails">
                                        <Form.Label>Select Employees</Form.Label>
                                        <select className='form-select' name="employeeId" value={projectEmpObj.employeeId} onChange={handleChange}>
                                            <option value="">Select Employee</option>
                                            {allEmployee.map((emp) => (
                                                <option key={emp.empId} value={emp.empId}>
                                                    {emp.empName}
                                                </option>
                                            ))}
                                        </select>
                                        <Form.Text className="text-danger">{errors.employeeId}</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="addedDate">
                                        <Form.Label>Added Date</Form.Label>
                                        <Form.Control type="date" name="addedDate" value={projectEmpObj.addedDate} onChange={handleChange} />
                                        <Form.Text className="text-danger">{errors.addedDate}</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col>
                                    <Button variant="primary" type="submit" className='mx-2' onClick={handleSave}>
                                        Submit
                                    </Button>
                                    <Button variant="danger" onClick={handleReset}>
                                        Reset
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectEmployees;