import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { serverName } from "../../config";

const DeleteUsersForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ success: false, message: null });

  const usernameRef = useRef();

  const deleteUserHandler = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value.trim();

    setIsLoading(true);

    const res = await fetch(`${serverName}/api/users/${username}/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });

    const data = await res.json();

    console.log(data);
    setIsLoading(false);

    if (data.ok) {
      setFeedback({
        success: true,
        message: `User ${username} was deleted`,
      });
    } else {
      setFeedback({
        success: false,
        message: `Couldnt remove the user ${username}`,
      });
    }
  };

  return (
    <Form className="delete-user-form" onSubmit={deleteUserHandler}>
      <Card
        style={{ width: "max-content" }}
        className="delete-user-form-card d-flex flex-column gap-3 p-4"
      >
        {!isLoading && <Card.Title>Delete User</Card.Title>}

        {!isLoading && (
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" ref={usernameRef}></Form.Control>
          </Form.Group>
        )}

        {!isLoading && (
          <Button type="submit" variant="danger">
            Delete
          </Button>
        )}

        {isLoading && (
          <Spinner
            animation="border"
            variant="primary"
            role="status"
            aria-hidden="true"
            as="span"
            style={{
              width: "3rem",
              height: "3rem",
            }}
          />
        )}

        {feedback.message && (
          <Alert variant={feedback.success ? "success" : "danger"}>
            {feedback.message}
          </Alert>
        )}
      </Card>
    </Form>
  );
};

export default DeleteUsersForm;
