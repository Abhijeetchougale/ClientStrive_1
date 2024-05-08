import React, { useEffect } from "react";
import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { Button, Form, Row, Col } from "react-bootstrap";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [projectDetailObj, setProjectDetailObj] = useState({});
  const [employeesList, setEmployeesList] = useState([]);
  const [meetingsList, setMeetingsList] = useState([]);
  const [projectChangeList, setProjectChangeList] = useState([]);
  const [activeKey, setActiveKey] = useState("detail");
  const [isLoading, setIsLoading] = useState(true);
  const [allEmployees, setAllEmployees] = useState([]);
  const [allClients, setAllClients] = useState([]);

  useEffect(() => {
    getAllEmployees();
    getAllClients();
  
    if(projectId !== undefined){
      getProjectDetailsByProjectId(projectId)
      getEmployeesByProjectId(projectId)
      getAllMeetingsByProjectId(projectId)
      getAllProjectChangeByProjectId(projectId)
    }

  }, []);

  const getProjectDetailsByProjectId = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://freeapi.gerasim.in/api/ClientStrive/GetProjectByProjectId?clientProjectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setProjectDetailObj(response.data.data);
      setIsLoading(false);
    } catch (error) {}
  };

  const getEmployeesByProjectId = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://freeapi.gerasim.in/api/ClientStrive/GetEmployeesByProjectId?projectid=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setEmployeesList(response.data.data);
      setIsLoading(false);
    } catch (error) {}
  };

  const getAllMeetingsByProjectId = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://freeapi.gerasim.in/api/ClientStrive/GetAllMeetingsByProjectId?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setMeetingsList(response.data.data);
      setIsLoading(false);
    } catch (error) {}
  };

  const getAllProjectChangeByProjectId = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://freeapi.gerasim.in/api/ClientStrive/GetAllProjectChangeByProjectId?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setProjectChangeList(response.data.data);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleTabSelect = (selectedKey) => {
    // You can add your logic here that you want to execute when a tab is selected
    console.log(`Tab "${selectedKey}" was selected`);
    setActiveKey(selectedKey);
  };

  const getAllEmployees = async () => {
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllEmployee",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setAllEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const getAllClients = async () => {
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllClients",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setAllClients(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };


  return (
    <div>
      <Tabs
        id="controlled-tab-example"
        activeKey={activeKey}
        onSelect={handleTabSelect}
        className="mb-3"
      >
        <Tab eventKey="detail" title="Detail">
        <Form>
            <Row>
              <Col>
                <Form.Group controlId="projectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    value={projectDetailObj.projectName}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startDate"
                    value={projectDetailObj.startDate}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="expectedEndDate">
                  <Form.Label>Expected End Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="expectedEndDate"
                    value={projectDetailObj.expectedEndDate}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="leadByEmpId">
                  <Form.Label>Lead By Employee ID</Form.Label>
                  <select
                    className="form-select"
                    name="leadByEmpId"
                    value={projectDetailObj.leadByEmpId}
                    readonly={true}
                  >
                    <option value="">Select Employee</option>

                    {allEmployees.map((emp) => {
                      return (
                        <option key={emp.empId} value={emp.empId}>
                          {emp.empName}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="completedDate">
                  <Form.Label>Completed Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="completedDate"
                    value={projectDetailObj.completedDate}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contactPerson">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPerson"
                    value={projectDetailObj.contactPerson}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="contactPersonContactNo">
                  <Form.Label>Contact Person Contact No</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPersonContactNo"
                    value={projectDetailObj.contactPersonContactNo}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contactPersonEmailId">
                  <Form.Label>Contact Person Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactPersonEmailId"
                    value={projectDetailObj.contactPersonEmailId}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="totalEmpWorking">
                  <Form.Label>Total EmpWorking</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalEmpWorking"
                    value={projectDetailObj.totalEmpWorking}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="projectCost">
                  <Form.Label>Project Cost</Form.Label>
                  <Form.Control
                    type="number"
                    name="projectCost"
                    value={projectDetailObj.projectCost}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="projectDetails">
                  <Form.Label>Project Details</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectDetails"
                    value={projectDetailObj.projectDetails}
                    readonly={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="clientId">
                  <Form.Label>Client Name</Form.Label>
                  <select
                    className="form-select"
                    name="clientId"
                    value={projectDetailObj.clientId}
                    readonly={true}
                  >
                    <option value="">Select Client</option>
                    {allClients.map((client) => {
                      return (
                        <option key={client.clientId} value={client.clientId}>
                          {client.companyName}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Tab>
        <Tab eventKey="employees" title="Employees">
        <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>SrNo</th>
                    <th>Name</th>
                    <th>Emp-Code</th>
                    <th>Emp-Email</th>
                    <th>Emp-Designation</th>
                    
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
                  {employeesList.map((emp, index) => (
                    <tr key={emp.empId}>
                      <td>{index + 1}</td>
                      <td>{emp.empName}</td>
                      <td>{emp.empCode}</td>
                      <td>{emp.empEmailId}</td>
                      <td>{emp.empDesignation}</td>
                    </tr>
                  ))}
                  </>
                  }
                </tbody>
              </table>
        </Tab>
        <Tab eventKey="meetings" title="Meetings">
        <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Meeting Date</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Meeting Medium</th>
                      <th>Client Person</th>
                      <th>Meeting Title</th>
                      <th>Meeting Status</th>
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
                        {meetingsList.map((meeting, index) => (
                          <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>{meeting.meetingDate.split("T")[0]}</td>
                            <td>{meeting.startTime}</td>
                            <td>{meeting.endTime}</td>
                            <td>{meeting.meetingMedium}</td>
                            <td>{meeting.clientPersonNames}</td>
                            <td>{meeting.meetingTitle}</td>
                            <td>{meeting.meetingStatus}</td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
        </Tab>
        <Tab eventKey="projectChange" title="ProjectChange">
        <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>Change Details</th>
                      <th>Project Name</th>
                      <th>Company Name</th>
                      <th>Approved By Employee</th>
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
                            </tr>
                          );
                        })}
                      </>
                    )}
                  </tbody>
                </table>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
