import { Button, Card, Form } from "react-bootstrap";
import { useRef, useState } from "react";
import "./EmailVerificationForm.css";
import { serverName } from "../../config";
const EmailVerificationForm = (props) => {
  const verificationCodeRef = useRef();

  const [codeInvalid, setCodeInvalid] = useState(false);

  let inputCodeClass = codeInvalid ? "is-invalid" : "";

  const verificationCodeHandler = async (e) => {
    e.preventDefault();

    const userInputCode = verificationCodeRef.current.value.trim();

    try {
      const res = await fetch(`${serverName}/api/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: userInputCode }),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.verified) {
          setCodeInvalid(false);
          props.onSubmitVerificationForm();
        } else {
          setCodeInvalid(true);
        }
      }
    } catch (err) {
      console.error(`Error while sending post request: ${err.message}`);
    }
  };

  return (
    <Form
      style={props.style}
      onSubmit={verificationCodeHandler}
      className="ver-form"
    >
      <Card className="bg-white d-flex flex-column p-4 gap-4">
        <div className="d-flex justify-content-between">
          <Card.Title>E-mail Verification</Card.Title>
          <button
            type="button"
            className="btn-close"
            onClick={props.onHideEmailVerificationForm}
          />
        </div>

        <Form.Group controlId="formBasicVerificationCode">
          <Form.Label>Enter confirmation code from your e-mail</Form.Label>
          <Form.Control
            type="text"
            ref={verificationCodeRef}
            className={inputCodeClass}
          />
          {codeInvalid && (
            <div className="invalid-feedback">Invalid confirmation code</div>
          )}
        </Form.Group>

        <Button variant="success" type="submit">
          Confirm
        </Button>
      </Card>
    </Form>
  );
};

export default EmailVerificationForm;
