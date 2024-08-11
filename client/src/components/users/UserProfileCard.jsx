import { Card, Image, Form, Button, ButtonGroup } from "react-bootstrap";
import iconUserLg from "../../icons/icon-user-lg.png";
import { useDispatch } from "react-redux";
import { logOut } from "../../state/userActions";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";
import { setUser } from "../../state/userActions";
import FileButton from "../buttons/FileButton";
import { useParams } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import { serverName } from "../../config";

const UserProfileCard = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const user = useSelector((state) => state.user.user);

  const [isChangingPhoto, setIsChangingPhoto] = useState(false);

  const age =
    new Date(
      Date.now() - new Date(props.user.dateOfBirth).getTime()
    ).getFullYear() - 1970;

  const zodiacSign = getZodiacSign(
    new Date(props.user.dateOfBirth).getMonth() + 1,
    new Date(props.user.dateOfBirth).getDate() + 1
  );

  const [profilePicture, setProfilePicture] = useState(null);
  const [pictureURL, setPictureURL] = useState(null);

  const logOutHandler = async () => {
    try {
      const res = await fetch(`${serverName}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok) {
        dispatch(logOut());
        navigate("/homepage");
        console.log("User logged out");
      } else {
        console.error(`Could not log out user: ${data.message}`);
      }
    } catch (err) {
      console.error(
        `Error sending post request to log out the user ${err.message}`
      );
    }
  };

  const photoChangeHandler = async (e) => {
    setIsChangingPhoto(true);

    setProfilePicture(e.target.files[0]);
    setPictureURL(URL.createObjectURL(e.target.files[0]));
  };

  const profilePictureDeletionHandler = async () => {
    if (isChangingPhoto) {
      setProfilePicture(null);
      setPictureURL(null);
      return;
    }

    const res = await fetch(
      `${serverName}/api/users/${props.user._id}/profilePicture/delete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      }
    );

    const data = await res.json();

    if (data.ok) {
      setProfilePicture(null);
      setPictureURL(null);
      dispatch(setUser({ ...props.user, profilePicture: null }));
    } else {
      console.error(data.message);
    }
  };

  useEffect(() => {
    if (!props.user.profilePicture || !props.user.profilePicture.data) {
      setPictureURL(null);
      return;
    }

    const bufferArr = props.user.profilePicture.data.data;

    const blob = new Blob([new Uint8Array(bufferArr)], {
      type: props.user.profilePicture.contentType,
    });

    setPictureURL(URL.createObjectURL(blob));
  }, [props.user.profilePicture, props.isClient]);

  const photoSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("profilePicture", profilePicture);

    const res = await fetch(
      `${serverName}/api/users/${props.user._id}/profilePicture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    const reader = new FileReader();

    reader.onload = (event) => {
      const buffer = event.target.result;

      dispatch(
        setUser({
          ...props.user,
          profilePicture: {
            contentType: profilePicture.type,
            data: {
              data: [...new Uint8Array(buffer)],
              type: "Buffer",
            },
          },
        })
      );
    };

    reader.readAsArrayBuffer(profilePicture);

    setIsChangingPhoto(false);
  };

  const messageUserHandler = async () => {
    const res = await fetch(`${serverName}/api/dialogues/${params.username}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernameClient: user.username }),
    });

    const data = await res.json();

    if (data.ok) {
      navigate(`../dialogues/${params.username}`);
    } else {
      console.error("Could not initiate a dialogue with the user selected");
    }
  };

  return (
    <Card className="user-card w-50">
      <Card.Header as="h3" className="p-4">
        {props.isClient ? "My profile" : `Profile ${params.username}`}
      </Card.Header>

      <Card.Body className="p-4 d-flex flex-column gap-4 ">
        <div className="d-flex gap-4 flex-wrap">
          <Form
            onSubmit={photoSubmitHandler}
            style={{ width: "10rem", height: "10rem", position: "relative" }}
          >
            {pictureURL != null && props.isClient && (
              <Button
                variant="danger"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontSize: "0.8rem",
                  opacity: 0.6,
                }}
                className="p-2"
                onClick={profilePictureDeletionHandler}
              >
                <FaTrash />
              </Button>
            )}

            <Image
              src={pictureURL != null ? pictureURL : iconUserLg}
              className="w-100 rounded shadow-sm h-100 border"
              style={{ objectFit: "cover" }}
            />

            {props.isClient && (
              <FileButton
                onChange={photoChangeHandler}
                className="p-0 mx-2 px-3 border rounded d-flex gap-2 btn-light"
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  bottom: 0,
                  fontSize: "1.02rem",
                  opacity: 0.6,
                }}
                name="profilePicture"
                id={"profile-picture-upload"}
              >
                Change photo
              </FileButton>
            )}

            {isChangingPhoto && (
              <Button variant="success" className="px-2 mt-2 p-0" type="submit">
                Submit
              </Button>
            )}
          </Form>

          <div>
            <span className="fs-3">{props.user.username}</span>
            <div className="text-muted">
              <span className="font-weight-bold">Gender: </span>
              <span className="gender">
                {props.user.gender === "male" ? "Male ♂️" : "Female ♀️"}
              </span>
            </div>

            <div className="text-muted">
              <span className="font-weight-bold">Age: </span>
              <span className="age">{age}</span>
            </div>

            <div className="text-muted">
              <span className="font-weight-bold">Region: </span>
              <span className="region">{props.user.region}</span>
            </div>

            <div className="text-muted">
              <span className="font-weight-bold">City: </span>
              <span className="city">{props.user.city}</span>
            </div>

            <div className="text-muted">
              <span className="font-weight-bold">Zodiac Sign: </span>
              <span className="zodiac-sign">{zodiacSign}</span>
            </div>
          </div>
        </div>

        {props.isClient && (
          <div>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button
                variant="danger"
                className="p-1 px-2"
                onClick={logOutHandler}
              >
                Exit
              </Button>
            </div>
          </div>
        )}

        {!props.isClient && (
          <Button
            variant="success"
            className="d-flex align-items-center justify-content-center gap-2"
            onClick={messageUserHandler}
          >
            <FaComment style={{ color: "#fff" }} />
            Send a Message
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

function getZodiacSign(birthmonth, birthday) {
  let result;

  if (
    (birthmonth == 1 && birthday >= 20) ||
    (birthmonth == 2 && birthday <= 18)
  ) {
    result = "Aquarius ♒";
  }

  if (
    (birthmonth == 2 && birthday >= 19) ||
    (birthmonth == 3 && birthday <= 20)
  ) {
    result = "Pisces ♓";
  }
  if (
    (birthmonth == 3 && birthday >= 21) ||
    (birthmonth == 4 && birthday <= 19)
  ) {
    result = "Aries ♈";
  }

  if (
    (birthmonth == 4 && birthday >= 20) ||
    (birthmonth == 5 && birthday <= 20)
  ) {
    result = "Taurus ♉";
  }

  if (
    (birthmonth == 5 && birthday >= 21) ||
    (birthmonth == 6 && birthday <= 20)
  ) {
    result = "Gemini ♊";
  }

  if (
    (birthmonth == 6 && birthday >= 21) ||
    (birthmonth == 7 && birthday <= 22)
  ) {
    result = "Cancer ♋";
  }
  if (
    (birthmonth == 7 && birthday >= 23) ||
    (birthmonth == 8 && birthday <= 22)
  ) {
    result = "Leo ♌";
  }
  if (
    (birthmonth == 8 && birthday >= 23) ||
    (birthmonth == 9 && birthday <= 22)
  ) {
    result = "Virgo ♍";
  }
  if (
    (birthmonth == 9 && birthday >= 23) ||
    (birthmonth == 10 && birthday <= 22)
  ) {
    result = "Libra ♎";
  }
  if (
    (birthmonth == 10 && birthday >= 23) ||
    (birthmonth == 11 && birthday <= 21)
  ) {
    result = "Scorpio ♏";
  }
  if (
    (birthmonth == 11 && birthday >= 22) ||
    (birthmonth == 12 && birthday <= 21)
  ) {
    result = "Sagittarius ♐";
  }

  if (
    (birthmonth == 12 && birthday >= 22) ||
    (birthmonth == 1 && birthday <= 19)
  ) {
    result = "Capricorn ♑";
  }

  return result;
}

export default UserProfileCard;
