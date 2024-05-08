import React, { useEffect, useState } from "react";
import sweetAlertService from "../../Service/sweetAlertServices";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";

const Change = () => {
  const [empList, setEmpList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientProjectList, setClientProjectList] = useState([]);
  const [projectChangeList, setProjectChangeList] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    projectChangeId: 0,
    projectId: 0,
    changeDetails: "",
    changeDate: "",
    approvedByEmpId: 0,
  });
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    handleReset();
  };

  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReset = () => {
    setIsFormSubmitted(false);
    setFormData({
      projectChangeId: 0,
      projectId: 0,
      changeDetails: "",
      changeDate: "",
      approvedByEmpId: 0,
    });
  };

  const getAllEmployee = async () => {
    const response = await axios.get(
      "https://freeapi.gerasim.in/api/ClientStrive/GetAllEmployee",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      }
    );
    setEmpList(response.data.data);
  };

  const getAllProjects = async () => {
    const response = await axios.get(
      "https://freeapi.gerasim.in/api/ClientStrive/GetAllClientProjects",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      }
    );
    setClientProjectList(response.data.data);
  };

  const getAllProjectChange = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllProjectChange",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setProjectChangeList(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching project change:", error);
    }
  };

  useEffect(() => {
    getAllEmployee();
    getAllProjects();
    getAllProjectChange();
  }, []);

  const handleSave = async () => {
    setIsFormSubmitted(true);

    if (
      formData.changeDetails !== "" &&
      formData.changeDate !== "" &&
      formData.approvedByEmpId !== "" &&
      formData.projectId !== ""
    ) {
      try {
        const response = await axios.post(
          "https://freeapi.gerasim.in/api/ClientStrive/AddUpdateProjectChange",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
          }
        );
        if (response.data.result) {
          toast.success("Data inserted Successfully");
          handleClose();
          getAllProjectChange();
        }
      } catch (error) {
        toast.error("Error:", error);
      }
    }
  };

  const handleUpdate = async () => {
    setIsFormSubmitted(true);

    if (
      formData.changeDetails !== "" &&
      formData.changeDate !== "" &&
      formData.approvedByEmpId !== "" &&
      formData.projectId !== ""
    ) {
      try {
        const response = await axios.post(
          "https://freeapi.gerasim.in/api/ClientStrive/AddUpdateProjectChange",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
          }
        );
        if (response.data.result) {
          toast.success("Data inserted Successfully");
          handleClose();
          getAllProjectChange();
        }
      } catch (error) {
        toast.error("Error:", error);
      }
    }
  };

  const onEdit = (changeObj) => {
    debugger;
    setFormData(changeObj);
    handleShow();
  };

  const onDelete = async (projectChangeId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this project change !",
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
          `https://freeapi.gerasim.in/api/ClientStrive/DeleteChangeByChangeId?changeId=
                ${projectChangeId}`,
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
          getAllProjectChange();
        }
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-1"></div>
          <div className="col-md-12">
            <div className="card bg-light">
              <div className="card-header bg-info">
                <div className="row mt-2">
                  <div className="col-md-10 text-start">
                    <h4 className="text-start">Get All Project Change List</h4>
                  </div>
                  <div className="col-md-2 text-end">
                    <Button
                      variant="success"
                      className="btn-md m-1 text-right"
                      onClick={handleShow}
                    >
                      <FaPlus />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>Change Details</th>
                      <th>Project Name</th>
                      <th>Company Name</th>
                      <th>Approved By Employee</th>
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
                        {projectChangeList.map((change, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{change.changeDetails}</td>
                              <td>{change.projectName}</td>
                              <td>{change.companyName}</td>
                              <td>{change.changeApprovedBy}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-col-2 btn-primary mx-2"
                                  onClick={() => onEdit(change)}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-col-2 btn-danger mx-2"
                                  onClick={() => {
                                    onDelete(change.projectChangeId);
                                  }}
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
        </div>

        <div className="col-md-12">
          <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Project Change</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="projectId" className="mb-1">
                      <Form.Label>Select Project:</Form.Label>
                      <select
                        className="form-select"
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleChange}
                      >
                        <option>Select Project</option>
                        {clientProjectList.map((rol) => {
                          return (
                            <option
                              key={rol.clientProjectId}
                              value={rol.clientProjectId}
                            >
                              {rol.projectName}
                            </option>
                          );
                        })}
                      </select>
                      {isFormSubmitted && formData.projectId === 0 && (
                        <div className="text-danger">
                          This field is required.
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="changeDate" className="mb-1">
                      <Form.Label>Change Date:</Form.Label>
                      <Form.Control
                        type="date"
                        name="changeDate"
                        value={formData.changeDate.split("T")[0]}
                        onChange={handleChange}
                      />
                      {isFormSubmitted && formData.changeDate === "" && (
                        <div className="text-danger">
                          This field is required.
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="approvedByEmpId" className="mb-1">
                  <Form.Label>Approved By Employee:</Form.Label>
                  <select
                    className="form-select"
                    name="approvedByEmpId"
                    value={formData.approvedByEmpId}
                    onChange={handleChange}
                  >
                    <option>Select Employee</option>
                    {empList.map((emp) => {
                      return (
                        <option key={emp.empId} value={emp.empId}>
                          {emp.empName}
                        </option>
                      );
                    })}
                  </select>
                  {isFormSubmitted && formData.approvedByEmpId === 0 && (
                    <div className="text-danger">This field is required.</div>
                  )}
                </Form.Group>
                <Form.Group controlId="changeDetails" className="mb-1">
                  <Form.Label>Change Details:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="changeDetails"
                    value={formData.changeDetails}
                    onChange={handleChange}
                  />
                  {isFormSubmitted && formData.changeDetails === "" && (
                    <div className="text-danger">This field is required.</div>
                  )}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {formData.projectChangeId === 0 ? (
                <Button variant="primary" className="mt-2" onClick={handleSave}>
                  Add
                </Button>
              ) : (
                <Button
                  variant="warning"
                  className="mt-2"
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              )}
              <Button variant="secondary" onClick={handleReset}>
                Reset
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Change;
