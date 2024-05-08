import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";

const Payment = () => {
  const [ClientProjectList, setClientProjectList] = useState([]);
  const [ClientList, setClientList] = useState([]);
  const [PaymentList, setPaymentList] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [Paymentobj, setPaymentobj] = useState({
    amount: 0,
    paymentDate: "",
    paymentMode: "",
    projectPaymentId: 0,
    naration: "",
    projectName: "",
    companyName: "",
    clientId: 0,
    projectId: 0,
  });


  useEffect(() => {
    getAllPaymentList();
    getAllClientProject();
    getAllClient();
  }, []);

  const getAllPaymentList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllPayments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      if (response.data.result === true) {
        setPaymentList(response.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching payment list:", error);
    }
  };

  const getAllClientProject = async () => {
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllClientProjects",
        {
          headers: {
            Authorization: ` Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      if (response.data.result === true) {
        setClientProjectList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching project list:", error);
    }
  };

  const getAllClient = async () => {
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllClients",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      if (response.data.result === true) {
        setClientList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching client list:", error);
    }
  };


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onEdit = (payment) => {
    setPaymentobj(payment);
    handleShow();
  };

  const onDelete = async (projectPaymentId) => {
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
        const response = await axios.delete(
          "https://freeapi.gerasim.in/api/ClientStrive/DeletePaymentByPaymentId?paymentId=" +
          projectPaymentId,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
          }
        );
        if (response.data.result) {
          Swal.fire("Success!", "PaymentList Deleted Successfully", "success");
          getAllPaymentList();
        } else {
          Swal.fire("Error!", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const handleChange = (event, key) => {
    setPaymentobj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));

  };

  const [errors, setErrors] = useState({
    amount: "",
    paymentDate: "",
    paymentMode: "",
    naration: "",
    projectName: "",
    companyName: "",
    clientId: "",
    projectId: "",
  })

  const validatePayment = () => {
    let isValid = true;
    const newErrors = { ...errors };


    if (!Paymentobj.projectName.trim()) {
      newErrors.projectName = "Person Name is required";
      isValid = false;

    }
    if (!Paymentobj.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
      isValid = false;
    }
    if (!Paymentobj.amount) {
      newErrors.amount = "Amount is required";
      isValid = false;
    }
    if (!Paymentobj.paymentMode) {
      newErrors.paymentMode = "PaymentMode is required";
      isValid = false;
    }
    if (!Paymentobj.naration) {
      newErrors.naration = "Naration is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const AddPayment = async () => {

    if (validatePayment()) {
      try {
        const response = await axios.post(
          "https://freeapi.gerasim.in/api/ClientStrive/AddUpdatePayment",
          Paymentobj,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
          }
        );
        if (response.data.result) {
          toast.success("Payment Added Successfully");
        } else {
          toast.error(response.data.message);
        }
        getAllPaymentList();
        handleClose();
      } catch (error) {
        console.error("Error adding payment:", error);
        toast.error("Error adding payment");
      }
      return;
    }

  };

  const resetPaymentobj = () => {
    setPaymentobj({
      "projectPaymentId": 0,
      "projectId": 0,
      "paymentDate": "",
      "paymentMode": "",
      "amount": 0,
      "naration": ""
    });
  };

  const UpdatePayment = async () => {
    if (validatePayment()) {
      return;
    }
    try {
      const response = await axios.post(
        "https://freeapi.gerasim.in/api/ClientStrive/AddUpdatePayment",
        Paymentobj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      if (response.data.result) {
        toast.success("Payment Updated Successfully");
      } else {
        toast.error(response.data.message);
      }
      getAllPaymentList();
      handleClose();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Error updating payment");
    }
    resetPaymentobj();
    setShow(true);
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
                  <h4 className="text-start">Get All Payment List</h4>
                </div>
                <div className="col-md-2 text-end">
                  <Button
                    variant="success"
                    className="btn-md m-1 text-right"
                    onClick={handleShow}
                  >
                    <FaPlus /> Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Sr.No</th>
                    <th>Project Name</th>
                    <th>Company Name</th>
                    <th>Payment Date</th>
                    <th>Payment Mode</th>
                    <th>Amount</th>
                    <th>Narration</th>
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
                      {PaymentList.map((payment, index) => (
                        <tr key={payment.projectPaymentId}>
                          <td>{index + 1}</td>
                          <td>{payment.projectName}</td>
                          <td>{payment.companyName}</td>
                          <td>{payment.paymentDate.split("T")[0]}</td>
                          <td>{payment.paymentMode}</td>
                          <td>{payment.amount}</td>
                          <td>{payment.naration}</td>
                          <td>
                            <Button
                              variant="primary"
                              className="btn btn-col-2 btn-primary mx-2"
                              onClick={() => onEdit(payment)}
                            >
                              {" "}
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger"
                              className="btn btn-col-2 btn-danger mx-2"
                              onClick={() => onDelete(payment.projectPaymentId)}
                            >
                              <FaTrash />
                            </Button>
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
          <Modal.Header closeButton className="custom-card-header">
            <Modal.Title>
              {Paymentobj.projectPaymentId === 0 ? (
                <h4>Add PaymentList</h4>
              ) : (
                <h4>Update PaymentList</h4>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-md-6">
                        <label>ProjectName</label>
                        <select
                          className="form-select"
                          value={Paymentobj.projectId}
                          onChange={(event) => handleChange(event, "projectId")}
                        >
                          <option>Select Project</option>
                          {ClientProjectList.map((project) => (
                            <option
                              key={project.clientProjectId}
                              value={project.clientProjectId}
                            >
                              {project.projectName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>CompanyName</label>
                        <select
                          className="form-select"
                          value={Paymentobj.clientId}
                          onChange={(event) => handleChange(event, "clientId")}
                        >
                          <option>Select Company</option>
                          {ClientList.map((client) => (
                            <option
                              key={client.clientId}
                              value={client.clientId}
                            >
                              {client.companyName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Payment Date</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={Paymentobj.paymentDate}
                          placeholder="Enter date"
                          onChange={(event) =>
                            handleChange(event, "paymentDate")
                          }
                        />
                        <small className="text-danger">
                          {errors.paymentDate}
                        </small>
                      </div>

                      <div className="col-md-6">
                        <label>Payment Mode</label>
                        <input
                          type="text"
                          className="form-control"
                          value={Paymentobj.paymentMode}
                          placeholder="Enter payment mode"
                          onChange={(event) =>
                            handleChange(event, "paymentMode")
                          }
                        />
                        <small className="text-danger">
                          {errors.paymentMode}
                        </small>
                      </div>
                      
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Amount</label>
                        <input
                          type="text"
                          className="form-control"
                          value={Paymentobj.amount}
                          placeholder="Enter amount"
                          onChange={(event) => handleChange(event, "amount")}
                        />
                        <small className="text-danger">
                          {errors.amount}
                        </small>
                      </div>

                      <div className="col-md-6">
                        <label>Naration</label>
                        <input
                          type="text"
                          className="form-control"
                          value={Paymentobj.naration}
                          placeholder="Enter naration"
                          onChange={(event) => handleChange(event, "naration")}
                        />
                        <small className="text-danger">
                          {errors.naration}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
            <div>
              {Paymentobj.projectPaymentId === 0 && (
                <Button variant="success" onClick={AddPayment}>
                  Add
                </Button>
              )}
              {Paymentobj.projectPaymentId !== 0 && (
                <Button variant="primary" onClick={UpdatePayment}>
                  Update
                </Button>
              )}
              <Button variant="secondary" className="m-2" onClick={handleClose}>
                Reset
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Payment;