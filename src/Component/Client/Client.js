import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Client = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isLoading, setIsLoading] = useState(true);
  const [getAllClientList, setGetAllClientList] = useState([]);
  const [addUpdateClient, setAddUpdateClient] = useState({
    clientId: 0,
    contactPersonName: "",
    companyName: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    EmployeeStrength: "",
    gstNo: "",
    contactNo: "",
    regNo: "",
  });

  // State variables for holding error messages
  const [errors, setErrors] = useState({
    clientId: "",
    contactPersonName: "",
    companyName: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    EmployeeStrength: "",
    gstNo: "",
    contactNo: "",
    regNo: "",
  });
  useEffect(() => {
    getAllClient();
  }, []);
  const onChangeAddUpdateClient = (event, key) => {
    setAddUpdateClient((prevObj) => ({
      ...prevObj,
      [key]: event.target.value,
    }));
    // Clear error message when user starts typing again
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };
  const getAllClient = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllClients",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setGetAllClientList(result.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validation for each field
    if (!addUpdateClient.contactPersonName.trim()) {
      newErrors.contactPersonName = "Person Name is required";
      isValid = false;
    }
    if (!addUpdateClient.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
      isValid = false;
    }
    if (!addUpdateClient.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!addUpdateClient.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!addUpdateClient.pincode.trim()) {
      newErrors.pincode = "Pin Code is required";
      isValid = false;
    }
    if (!addUpdateClient.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }
    if (!addUpdateClient.EmployeeStrength) {
      newErrors.EmployeeStrength = "Employee Strength is required";
      isValid = false;
    }
    if (!addUpdateClient.gstNo.trim()) {
      newErrors.gstNo = "GST No is required";
      isValid = false;
    }
    if (!addUpdateClient.contactNo.trim()) {
      newErrors.contactNo = "Contact No is required";
      isValid = false;
    }
    if (!addUpdateClient.regNo.trim()) {
      newErrors.regNo = "Reg No is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const SaveClient = async () => {
    debugger;
    if (validateForm()) {
      try {
        const result = await axios.post(
          "https://freeapi.gerasim.in/api/ClientStrive/AddUpdateClient",
          addUpdateClient,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
          }
        );
        if (result.data.data) {
          Swal.fire(" Client add Success!", result.data.data, "success");
          getAllClient();
          handleClose();
        } else {
          alert(result.data.message);
          getAllClient();
        }
      } catch (error) {
        console.error("Error saving client:", error);
      }
      return;
    }
  };
  const editClient = (client) => {
    setAddUpdateClient(client);
    handleShow();
  };
  const onreset = () => {
    debugger;
    setAddUpdateClient({
      clientId: "",
      contactPersonName: "",
      companyName: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
      EmployeeStrength: "",
      gstNo: "",
      contactNo: "",
      regNo: "",
    });
  };
  const onDelete = async (clientId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this client!",
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
          `https://freeapi.gerasim.in/api/ClientStrive/DeleteClientByClientId?clientId=
                    ${clientId}`,
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
          getAllClient();
        }
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const onUpdate = async () => {
    try {
      const result = await axios.post(
        `https://freeapi.gerasim.in/api/ClientStrive/AddUpdateClient`,
        addUpdateClient,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      if (result.data.data) {
        Swal.fire("Success!", result.data.data, "success");
      } else {
        Swal.fire("Success!", result.data.message, "success");
        getAllClient();
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting client:", error);
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
                  <div className="col-md-10 text-center ">
                    <h4 className="text-start">Get All Client List</h4>
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
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Person </th>
                      <th>Company </th>
                      <th>Address</th>
                      <th>City</th>
                      <th>GST No</th>
                      <th>Reg No</th>
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
                        {getAllClientList.map((client, index) => (
                          <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>{client.contactPersonName}</td>
                            <td>{client.companyName}</td>
                            <td>{client.address}</td>
                            <td>{client.city}</td>
                            <td>{client.gstNo}</td>
                            <td>{client.regNo}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-col-2 btn-primary mx-2"
                                onClick={() => editClient(client)}
                              >
                                <FaEdit />
                                {/* Adjust margin as needed */}
                              </button>
                              <button
                                type="button"
                                className="btn btn-col-2 btn-danger mx-2"
                                onClick={() => {
                                  onDelete(client.clientId);
                                }}
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
        <div className="col-md-12">
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-light">
              <Modal.Title>Add Client</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-md-6">
                        <label>Person Name</label>
                        <input
                          type="text"
                          value={addUpdateClient.contactPersonName}
                          className="form-control"
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "contactPersonName")
                          }
                          name="contactPersonName"
                          placeholder="Person Name"
                        />
                        <small className="text-danger">
                          {errors.contactPersonName}
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label>Company Name</label>
                        <input
                          type="text"
                          value={addUpdateClient.companyName}
                          className="form-control"
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "companyName")
                          }
                        />
                        <small className="text-danger">
                          {errors.companyName}
                        </small>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label>City </label>
                        <input
                          type="text"
                          value={addUpdateClient.city}
                          className="form-control"
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "city")
                          }
                        />
                        <small className="text-danger">{errors.city}</small>
                      </div>
                      <div className="col-md-4">
                        <label>Pin Code</label>
                        <input
                          type="text"
                          value={addUpdateClient.pincode}
                          className="form-control"
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "pincode")
                          }
                        />
                        <small className="text-danger">{errors.pincode}</small>
                      </div>
                      <div className="col-md-4">
                        <label>State</label>
                        <input
                          type="text"
                          value={addUpdateClient.state}
                          className="form-control"
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "state")
                          }
                        />
                        <small className="text-danger">{errors.state}</small>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <label htmlFor="">Address</label>
                        <textarea
                          name=""
                          id=""
                          cols="30"
                          rows="3"
                          placeholder="Enter your address"
                          value={addUpdateClient.address}
                          className="form-control"
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "address")
                          }
                        ></textarea>
                        <small className="text-danger">{errors.address}</small>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label htmlFor="">Employee Strength</label>
                        <input
                          type="number"
                          className="form-control"
                          value={addUpdateClient.EmployeeStrength}
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "EmployeeStrength")
                          }
                          placeholder="Employee Strength"
                        />
                        <small className="text-danger">
                          {errors.EmployeeStrength}
                        </small>
                      </div>
                      <div className="col-6">
                        <label htmlFor="">GST NO</label>
                        <input
                          type="text"
                          className="form-control"
                          value={addUpdateClient.gstNo}
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "gstNo")
                          }
                          placeholder="Enter Gst No"
                        />
                        <small className="text-danger">{errors.gstNo}</small>
                      </div>
                      <div className="col-6">
                        <label htmlFor="">Conatct No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={addUpdateClient.contactNo}
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "contactNo")
                          }
                          placeholder="Enter Contact No"
                        />
                        <small className="text-danger">
                          {errors.contactNo}
                        </small>
                      </div>
                      <div className="col-6">
                        <label htmlFor="">Reg No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={addUpdateClient.regNo}
                          onChange={(event) =>
                            onChangeAddUpdateClient(event, "regNo")
                          }
                          placeholder="Reg No"
                        />
                        <small className="text-danger">{errors.regNo}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="col-12 text-center">
                {addUpdateClient.clientId === 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary m-2"
                    onClick={SaveClient}
                  >
                    Add
                  </button>
                )}
                {addUpdateClient.clientId !== 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-warning m-2"
                    onClick={onUpdate}
                  >
                    Update
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={onreset}
                >
                  Reset
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Client;
