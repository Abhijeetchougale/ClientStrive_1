import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";

const Meeting = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isLoading, setIsLoading] = useState(true);
  const [getMeetingsList, setGetMeetingsList] = useState([]);
  const [getmeetingsByProjectId, setgetmeetingsByProjectId] = useState([]);
  const [addUpdateProjectMeeting, setaddUpdateProjectMeeting] = useState({
    projectMeetingId: 0,
    projectId: 0,
    meetingLeadByEmpId: 0,
    meetingDate: "",
    startTime: "",
    endTime: "",
    meetingMedium: "",
    isRecordingAvailable: true,
    recordingUrl: "",
    meetingNotes: "",
    clientPersonNames: "",
    meetingTitle: "",
    meetingStatus: "",
  });


  const [selectedOption, setSelectedOption] = useState('');

  const options = ['Draft', 'Scheduled', 'Completed'];

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setaddUpdateProjectMeeting({
      ...addUpdateProjectMeeting,
      [name]: value
    });
  };

  // State variables for holding error messages
  const [errors, setErrors] = useState({
    projectMeetingId: 0,
    projectId: 0,
    meetingLeadByEmpId: 0,
    meetingDate: "",
    startTime: "",
    endTime: "",
    meetingMedium: "",
    isRecordingAvailable: true,
    recordingUrl: "",
    meetingNotes: "",
    clientPersonNames: "",
    meetingTitle: "",
    meetingStatus: "",
  });

  useEffect(() => {
    getAllMeetings();
    getAllMeetingsByProjectId();
  }, []);

  const onChangeAddUpdateMeeting = (event, key) => {
    setaddUpdateProjectMeeting((prevObj) => ({
      ...prevObj,
      [key]: event.target.value,
    }));
    // Clear error message when user starts typing again
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  const getAllMeetings = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllMeetings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setGetMeetingsList(result.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const getAllMeetingsByProjectId = async () => {
    try {
      const result = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllMeetingsByProjectId",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setgetmeetingsByProjectId(result.data.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validation for each field
    if (!addUpdateProjectMeeting.meetingDate.trim()) {
      newErrors.meetingDate = "Meeting Date is required";
      isValid = false;
    }
    if (!addUpdateProjectMeeting.startTime.trim()) {
      newErrors.startTime = "Start Time is required";
      isValid = false;
    }
    if (!addUpdateProjectMeeting.endTime.trim()) {
      newErrors.endTime = "End Time is required";
      isValid = false;
    }
    if (!addUpdateProjectMeeting.meetingMedium.trim()) {
      newErrors.meetingMedium = "Meeting medium is required";
      isValid = false;
    }
    if (!addUpdateProjectMeeting.recordingUrl.trim()) {
      newErrors.recordingUrl = "RecordingUrl is required";
      isValid = false;
    }
    if (!addUpdateProjectMeeting.meetingNotes.trim()) {
      newErrors.meetingNotes = "Meeting Notes is required";
      isValid = false;
    }
    if (!addUpdateProjectMeeting.clientPersonNames.trim()) {
      newErrors.clientPersonNames = "Client Person Names is required";
      isValid = false;
    }
    if (!addUpdateProjectMeeting.meetingTitle.trim()) {
      newErrors.meetingTitle = " Meeting Title is required";
      isValid = false;
    }
    if (!addUpdateProjectMeeting.meetingStatus.trim()) {
      newErrors.meetingStatus = "Meeting Status is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const SaveMeeting = async () => {
    if (validateForm()) {
      try {
        debugger;
        const result = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/AddUpdateProjectMeeting",
          addUpdateProjectMeeting, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('loginToken')}`
          }
        });
        if (result.data.result) {
          toast.success("Data saved successfully");
          // Reset form data after saving

        } else {
          toast.error(result.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while saving data");
      }
    }
  };
  const editMeeting = (meeting) => {
    setaddUpdateProjectMeeting(meeting);
    handleShow();
  };

  const onReset = () => {
    debugger;
    setaddUpdateProjectMeeting({
      projectMeetingId: 0,
      projectId: 0,
      meetingLeadByEmpId: 0,
      meetingDate: "",
      startTime: "",
      endTime: "",
      meetingMedium: "",
      isRecordingAvailable: true,
      recordingUrl: "",
      meetingNotes: "",
      clientPersonNames: "",
      meetingTitle: "",
      meetingStatus: "",
    });
  };

  const OnDelete = async (projectId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this meeting!",
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
          `https://freeapi.gerasim.in/api/ClientStrive/DeleteMeetingByMeetingId?meetingId=
                    ${projectId}`,
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
          getAllMeetings();
        }
      } catch (error) {
        console.error("Error deleting Meeting:", error);
      }
    }
  };

  const OnUpdate = async () => {
    try {
      const result = await axios.post(
        `https://freeapi.gerasim.in/api/ClientStrive/AddUpdateProjectMeeting`,
        addUpdateProjectMeeting,
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
        getAllMeetings();
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
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
                    <h4 className="text-start">Get All Metting List</h4>
                  </div>
                  <div className="col-md-2 text-end">
                    <React.Fragment>
                      <Button
                        variant="success"
                        className="btn-md m-1 text-right"
                        onClick={handleShow}
                      >
                        <FaPlus /> Add
                      </Button>
                    </React.Fragment>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Meeting Date</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Meeting Medium</th>
                      {/* <th>RecordingUrl</th>
                                            <th>Meeting Notes</th> */}
                      <th>Client Person</th>
                      <th>Meeting Title</th>
                      <th>Meeting Status</th>
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
                        {getMeetingsList.map((meeting, index) => (
                          <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>{meeting.meetingDate.split("T")[0]}</td>
                            <td>{meeting.startTime}</td>
                            <td>{meeting.endTime}</td>
                            <td>{meeting.meetingMedium}</td>
                            {/* <td>{meeting.recordingUrl}</td>
                                                <td>{meeting.meetingNotes}</td> */}
                            <td>{meeting.clientPersonNames}</td>
                            <td>{meeting.meetingTitle}</td>
                            <td>{meeting.meetingStatus}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-col-2 btn-primary mx-2"
                                onClick={() => editMeeting(meeting)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="btn btn-col-2 btn-danger mx-2"
                                onClick={() => {
                                  OnDelete(meeting.projectId);
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
          <form action="">
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton className="bg-light">
                <Modal.Title>Add Update Project Meeting</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-md-6">
                              <label>Project Id</label>
                              <select className='form-select' name="roleId" value={addUpdateProjectMeeting.projectId} onChange={handleChange}>
                                <option>Seletct Project</option>
                                {
                                  getmeetingsByProjectId.map((peoject) => {
                                    return (
                                      <option key={peoject.projectId} value={peoject.projectId}>{peoject.ProjectName}</option>
                                    )
                                  })
                                }
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label>Meeting Lead By EmpId</label>
                              <select
                                name=""
                                id=""
                                className="form-control"
                              ></select>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label>Meeting Date </label>
                              <input
                                type="date"
                                value={addUpdateProjectMeeting.meetingDate}
                                className="form-control"
                                onChange={(event) =>
                                  onChangeAddUpdateMeeting(event, "meetingDate")
                                }
                                name="meetingDate"
                                placeholder="Meeting Date"
                              />
                              <small className="text-danger">
                                {errors.meetingDate}
                              </small>
                            </div>
                            <div className="col-md-6">
                              <label>Satrt Time</label>
                              <input
                                type="text"
                                value={addUpdateProjectMeeting.startTime}
                                className="form-control"
                                onChange={(event) =>
                                  onChangeAddUpdateMeeting(event, "startTime")
                                }
                                name="startTime"
                                placeholder="StarTime"
                              />
                              <small className="text-danger">
                                {errors.startTime}
                              </small>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label>End Time</label>
                              <input
                                type="text"
                                value={addUpdateProjectMeeting.endTime}
                                className="form-control"
                                onChange={(event) =>
                                  onChangeAddUpdateMeeting(event, "endTime")
                                }
                                name="endTime"
                                placeholder="End Time"
                              />
                              <small className="text-danger">
                                {errors.endTime}
                              </small>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="">Meeting Medium</label>
                              <input
                                type="text"
                                value={addUpdateProjectMeeting.meetingMedium}
                                className="form-control"
                                onChange={(event) =>
                                  onChangeAddUpdateMeeting(
                                    event,
                                    "meetingMedium"
                                  )
                                }
                                name="meetingMedium"
                                placeholder="Meeting Medium"
                              />
                              <small className="text-danger">
                                {errors.meetingMedium}
                              </small>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label htmlFor="">Recording Url</label>
                              <input
                                type="text"
                                value={addUpdateProjectMeeting.recordingUrl}
                                className="form-control"
                                onChange={(event) =>
                                  onChangeAddUpdateMeeting(
                                    event,
                                    "recordingUrl"
                                  )
                                }
                                name="recordingUrl"
                                placeholder="Recording Url"
                              />
                              <small className="text-danger">
                                {errors.recordingUrl}
                              </small>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="">Meeting Notes</label>
                              <input
                                type="text"
                                value={addUpdateProjectMeeting.meetingNotes}
                                className="form-control"
                                onChange={(event) =>
                                  onChangeAddUpdateMeeting(
                                    event,
                                    "meetingNotes"
                                  )
                                }
                                name="meetingDate"
                                placeholder="Meeting Notes"
                              />
                              <small className="text-danger">
                                {errors.meetingNotes}
                              </small>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label htmlFor="">Client Person Name</label>
                              <input
                                type="text"
                                value={
                                  addUpdateProjectMeeting.clientPersonNames
                                }
                                className="form-control"
                                onChange={(event) =>
                                  onChangeAddUpdateMeeting(
                                    event,
                                    "clientPersonNames"
                                  )
                                }
                                name="clientPersonNames"
                                placeholder="Client Person Names"
                              />
                              <small className="text-danger">
                                {errors.clientPersonNames}
                              </small>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="">Meeting Title</label>
                              <input
                                type="text"
                                value={addUpdateProjectMeeting.meetingTitle}
                                className="form-control"
                                onChange={(event) =>
                                  onChangeAddUpdateMeeting(
                                    event,
                                    "meetingTitle"
                                  )
                                }
                                name="meetingTitle"
                                placeholder="Meeting Title"
                              />
                              <small className="text-danger">
                                {errors.meetingTitle}
                              </small>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label htmlFor="">Meeting status</label>
                              <select id="dropdown" className="form-control" value={selectedOption} onChange={handleDropdownChange}>
                                {/* Mapping through options to generate dropdown options */}
                                {options.map((option, index) => (
                                  <option key={index} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              {/*<small className="text-danger">
                                {errors.meetingStatus}
                              </small>*/}
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="">IsRecording Available</label>
                              <input
                                type="checkbox"
                                name=""
                                id=""
                                className="form-check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <form action="">
                  {
                    <button
                      type="button"
                      className="btn btn-sm btn-primary m-2"
                      onClick={SaveMeeting}
                    >
                      Add
                    </button>
                  }
                  {
                    <button
                      type="button"
                      className="btn btn-sm btn-warning m-2"
                      onClick={OnUpdate}
                    >
                      Update
                    </button>
                  }
                </form>
                <button className="btn btn-sm btn-secondary" onClick={onReset}>
                  Reset
                </button>
              </Modal.Footer>
            </Modal>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
