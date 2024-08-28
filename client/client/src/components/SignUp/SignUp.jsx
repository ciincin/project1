import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import "./SignUp.css"
import { useState } from "react";

function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setimage] = useState("");
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState("");

  function handleSetFirstname(event) {
    setFirstname(event.target.value);
  }

  function handleSetLastname(event) {
    setLastname(event.target.value);
  }

  function handleSetUsername(event) {
    setUsername(event.target.value);
  }

  function handleSetEmail(event) {
    setEmail(event.target.value);
  }

  function handleSetPassword(event) {
    setPassword(event.target.value);
  }

  function handleSetimage(event) {
    setimage(event.target.value);
  }
  function handleSetTerms(event) {
    setTerms(event.target.checked);
  }

  async function handleSubmitAsync(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          email,
          password,
          image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup successful");
      } else {
        setMessage(`Signup failled: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please, try again.");
    }
  }

  return (
    <div className="signup-wrapper-message">
      <div>
        <Form noValidate onSubmit={handleSubmitAsync}>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormik101"
              className="position-relative"
            >
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                placeholder="First name"
                value={firstname}
                onChange={handleSetFirstname}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormik102"
              className="position-relative"
            >
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                placeholder="Last name"
                value={lastname}
                onChange={handleSetLastname}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationFormikUsername2">
              <Form.Label>Username</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  name="username"
                  value={username}
                  onChange={handleSetUsername}
                />
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormik103"
              className="position-relative"
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleSetEmail}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId="validationFormik104"
              className="position-relative"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleSetPassword}
              />
            </Form.Group>
          </Row>
          <Form.Group className="position-relative mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="file"
              value={image}
              onChange={handleSetimage}
            />
          </Form.Group>
          <Form.Group className="position-relative mb-3">
            <Form.Check
              required
              name="terms"
              checked={terms}
              label="Agree to terms and conditions"
              onChange={handleSetTerms}
              feedbackType="invalid"
              id="validationFormik106"
              feedbackTooltip
            />
          </Form.Group>
          <Button type="submit">Register</Button>
        </Form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUp;
