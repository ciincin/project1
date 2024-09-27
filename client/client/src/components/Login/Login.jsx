import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Login.css";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleSetEmail(event) {
    setEmail(event.target.value);
  }

  function handleSetPassword(event) {
    setPassword(event.target.value);
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, //allows send cookies
        }
      );

      if (response && response.data) {
        // Go to profile web
        navigate("/profile");
      } else {
        setErrorMessage("login failed: data no received");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "An error occurred");
    }
  }

  async function handleGoogleLoginSuccess(credentialResponse) {
    try {
      const response = await axios.post(
        "http://localhost:3000/google-login",
        {
          token: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );

      if (response && response.data) {
        navigate("/profile");
      } else {
        setErrorMessage("Google login failed:Data not received");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg || "Google login error occurred"
      );
    }
  }

  function handleGoogleLoginError() {
    setErrorMessage("Google login failed");
  }

  return (
    <div>
      <Form className="form-wrapper" onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleSetEmail}
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleSetPassword}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>

        <div className="register">
          Are you not registered? <a href="/signup">Register now</a>
        </div>
      </Form>
      <div className="google-login">
        <GoogleOAuthProvider clientId="445131528162-l6a7p0s8829srhi3gc2sa5vunsm34pp7.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </GoogleOAuthProvider>
      </div>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </div>
  );
}

export default Login;
