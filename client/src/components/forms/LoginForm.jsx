import AuthButton from "../buttons/AuthButton";
import { Alert, Button, Form } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useRef } from "react";
import { serverName } from "../../config";
import Cookies from "js-cookie";

import { useDispatch } from "react-redux";
import { logIn, setUser, setLoading } from "../../state/userActions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const loginHandler = async (e) => {
    e.preventDefault();

    const userEmail = emailRef.current.value.trim();
    const userPassword = passwordRef.current.value.trim();

    dispatch(setLoading(true));

    try {
      const res = await fetch(`${serverName}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, userPassword }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        // Wait 1 second before accessing the cookie

        if (data.loggedIn) {
          if (Cookies.get("jwt")) {
            const res = await fetch(`${serverName}/api/user`, {
              headers: {
                Authorization: `Bearer ${Cookies.get("jwt")}`,
              },
            });

            const userData = (await res.json()).user;

            if (userData != null) {
              dispatch(logIn());
              dispatch(setUser(userData));
              navigate("/profile");
              setError(null);
            }
          }
        } else {
          setError(data.message);
        }
      } else {
        console.error("Error while sending post request from client");
        dispatch(setError("Error while sending post request from client"));
      }
    } catch (err) {
      setError("Unknown error");
    }

    dispatch(setLoading(false));
  };

  return (
    <Form onSubmit={loginHandler} className="login-form">
      <Card className="bg-white p-4 d-flex flex-column gap-3">
        <Card.Title>Login</Card.Title>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>E-mail:</Form.Label>
          <Form.Control type="email" name="userEmail" ref={emailRef} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" name="userPassword" ref={passwordRef} />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* <a href="#" className="text-muted text-right mb-3">
          Forgot password?
        </a> */}

        <div>
          <span className="mb-1 d-inline-block">Login through:</span>

          <div
            className="w-100 d-flex flex-row justify-content-between"
            style={{ columnGap: "1rem" }}
          >
            <AuthButton
              value="Yandex"
              icon="yandex"
              href=""
              variant="outline-secondary"
            />
          </div>
        </div>
      </Card>
    </Form>
  );
};

export default LoginForm;
