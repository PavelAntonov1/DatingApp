import { Card, Container } from "react-bootstrap";
import LoginForm from "../forms/LoginForm";
import SearchForm from "../forms/SearchForm";
import NewUsers from "../users/NewUsers";
import { useState } from "react";
import ReactDOM from "react-dom";
import Overlay from "../overlay/Overlay";
import RegistrationForm from "../forms/RegistrationForm";
import { useSelector } from "react-redux";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = (props) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const registrationShowHandler = () => {
    setShowRegistration((showRegistration) => !showRegistration);
  };

  return (
    <Container className="homepage-container d-flex my-4 align-items-stretch justify-content-start">
      {showRegistration &&
        ReactDOM.createPortal(
          <Overlay color="rgba(0, 0, 0, 0.30)" />,
          document.querySelector("#overlay")
        )}

      {showRegistration && (
        <RegistrationForm
          onHideRegistrationForm={registrationShowHandler}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: "11",
            width: "32rem",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <div
        className="search-form-container d-flex flex-column gap-3"
        style={{ width: !isLoggedIn ? "40rem" : "max-content" }}
      >
        {!isLoggedIn && (
          <div className="registration-link">
            <LoginForm />

            <div className="d-flex flex-row mt-1 justify-content-around">
              <span className="text-muted">Нет аккаунта?</span>
              <a
                className="text-muted"
                onClick={registrationShowHandler}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Registration
              </a>
            </div>
          </div>
        )}

        <SearchForm
          className="search-form"
          onPassFilter={(options) => {
            props.onSetFilter(options);
          }}
        />
      </div>

      <div className="text-container d-flex flex-column gap-5 m-5 mt-0 mr-0">
        <Card className="p-4">
          <Card.Title className="display-6">
            Innovative Dating App Simulation
          </Card.Title>
          <hr />
          <p>
            <p>
              Welcome to our cutting-edge dating app simulation, designed to
              showcase a deep understanding of backend procedures and modern
              technology. Built with React, Express.js, MongoDB, and CSS
              Bootstrap, this responsive app features seamless Yandex OAuth for
              user authentication and integrates advanced AI to generate
              interactive bots from the admin account (admin@gmail.com /
              Admin-12).
            </p>

            <p>
              The app focuses more on demonstrating key backend concepts
              including Cookies, JWT, OAuth, sessions, password hashing, and
              etc. rather than on UI / UX design. Users can engage in chat,
              upload photos, update profiles, and search for potential partners,
              all while experiencing a realistic and interactive environment.
            </p>

            <p>
              Specialized libraries enhance the chat functionality, ensuring a
              smooth user experience. The responsive design guarantees optimal
              performance across various devices, making the app not only
              functional but also user-friendly. Dive into a simulated dating
              experience that highlights both frontend and backend expertise,
              offering a comprehensive preview of future dating app
              technologies.
            </p>
          </p>
        </Card>

        <NewUsers />
      </div>
    </Container>
  );
};

export default HomePage;
