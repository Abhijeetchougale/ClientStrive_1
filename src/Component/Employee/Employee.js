import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Employee = () => {
  const navigate = useNavigate();
  const [empList, setEmpList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllEmp();
  }, []);

  const getAllEmp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllEmployee",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setEmpList(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEditForm = (empId) => {
    // Navigate to the EmployeeForm component with empId as URL parameter
    navigate(`/employee-form/${empId}`);
  };

  const handleAddEmployee = () => {
    navigate("/employee-form");
  };

  const handleDelete = async (empId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this Employee !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (confirmDelete.isConfirmed) {
      try {
        const result = await axios.delete(
          "https://freeapi.gerasim.in/api/ClientStrive/DeleteEmployeeByEmpId?empId=" +
            empId,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
          }
        );
        if (result.data.data) {
          Swal.fire("Error!", result.data.data, "error");
        } else {
          Swal.fire("Success!", result.data.message, "success");
          getAllEmp();
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-1"></div>
        <div className="col-md-12">
          <div className="card bg-light">
            <div className="card-header bg-info">
              <div className="row mt-2">
                <div className="col-md-10 text-center">
                  <h4 className="text-start">Get All Employee List</h4>
                </div>
                <div className="col-md-2 text-end">
                  <Button
                    variant="success"
                    className="btn-md m-1 text-right"
                    onClick={handleAddEmployee}
                  >
                    {" "}
                    <FaPlus />
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>SrNo</th>
                    <th>Name</th>
                    <th>Emp-Code</th>
                    <th>Emp-Email</th>
                    <th>Emp-Designation</th>
                    <th>Emp-Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                 { isLoading ? 
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
                  : <>
                  {empList.map((emp, index) => (
                    <tr key={emp.empId}>
                      <td>{index + 1}</td>
                      <td>{emp.empName}</td>
                      <td>{emp.empCode}</td>
                      <td>{emp.empEmailId}</td>
                      <td>{emp.empDesignation}</td>
                      <td>{emp.role}</td>
                      <td>
                        <button
                          className="btn btn-col-2 btn-primary mx-2"
                          onClick={() => handleEditForm(emp.empId)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-col-2 btn-danger mx-2"
                          onClick={() => handleDelete(emp.empId)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  </>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">{/* Your content in col-4 */}</div>
    </div>
  );
};

export default Employee;
