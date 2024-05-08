import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoggedIn }) => {
  const [emailId, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginObj = {
        "password": password,
        "username": emailId
      }
      const result = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/login", loginObj);
      if (result.data.data.token) {
        toast.success("Login successfully");
        localStorage.setItem('loginToken', result.data.data.token);
        setLoggedIn(true); // Set loggedIn state to true
        navigate('/employee'); // Redirect to homepage after login
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while logging in");
    }
  };

  return (
    <>
      <div className="login-page">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={5} className="login-form">
              <h1 className='text-center'>Login</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group >
                  <Form.Label className='font-lg'>Email address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter email"
                    value={emailId}
                    onChange={handleEmailChange}
                  />
                </Form.Group>

                <Form.Group >
                  <Form.Label className='font-lg'>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>

                <div className="text-center mt-2 " >
                  <Button variant="primary" type="submit" className='btn-lg'>
                    Login
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Login;
