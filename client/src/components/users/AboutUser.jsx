import { Card, Button, Form } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../../state/userActions.js";
import { serverName } from "../../config.js";

const bodyTypeArr = [
  "Skinny",
  "Normal",
  "Sportive",
  "Muscular",
  "Slight Overweight",
  "Overweight",
];

const hairColorArr = [
  "Light",
  "Dark",
  "Red",
  "Brown",
  "Bright",
  "Gray",
  "Bald",
];

const financialStatusArr = [
  "Unstable income",
  "Constant small income",
  "Stable average income",
  "High income",
];

const AboutUser = (props) => {
  const dispatch = useDispatch();
  console.log("<About User /> mounted!");

  const [isEditing, setIsEditing] = useState(false);

  const [info, setInfo] = useState(props.userInfo ?? "");

  const [height, setHeight] = useState(props.user.height);
  const [weight, setWeight] = useState(props.user.weight);

  const [bodyType, setBodyType] = useState(props.user.bodyType);

  const [hairColor, setHairColor] = useState(props.user.hairColor);

  const [financialStatus, setFinancialStatus] = useState(
    props.user.financialStatus
  );

  const [additionalInfo, setAdditionalInfo] = useState(
    props.user.additionalInfo
  );

  useEffect(() => {
    setHeight(props.user.height);
    setWeight(props.user.weight);

    setBodyType(props.user.bodyType);
    setHairColor(props.user.hairColor);
    setFinancialStatus(props.user.financialStatus);

    setAdditionalInfo(props.user.additionalInfo);
  }, [props.user]);

  const heightRef = useRef();
  const weightRef = useRef();

  const params = useParams();

  const submitInfoHandler = async (e) => {
    e.preventDefault();

    const height = +heightRef.current.value;
    const weight = +weightRef.current.value;

    const userInfo = {
      height,
      weight,
      bodyType,
      hairColor,
      financialStatus,
      additionalInfo,
    };

    const res = await fetch(
      `${serverName}/api/users/${props.user.username}/info`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInfoObj: userInfo }),
      }
    );

    const data = await res.json();

    console.log(data);

    if (data.ok) {
      dispatch(setUser({ ...props.user, ...userInfo }));
    }

    setIsEditing(false);
  };

  console.log(weight, height, financialStatusArr[financialStatus]);
  return (
    <Card className="w-100">
      <Card.Header as="h3" className="p-4">
        {props.isClient ? "About me" : `About ${params.username}`}
      </Card.Header>

      <Card.Body className="p-4">
        {(!isEditing || !props.isClient) && (
          <Form onSubmit={submitInfoHandler}>
            <div className="d-flex gap-4">
              <span>
                Height: <i>{!height || height <= 0 ? "None" : height + "cm"}</i>
              </span>

              <span>
                Weight: <i>{!weight || weight <= 0 ? "None" : weight + "kg"}</i>
              </span>

              <div className="d-flex flex-column gap-3">
                <span>
                  Physique:{" "}
                  <i>
                    {bodyType === null || bodyType === undefined
                      ? "None"
                      : bodyTypeArr[bodyType]}
                  </i>
                </span>

                <span>
                  Hair Color:{" "}
                  <i>
                    {hairColor === null || hairColor === undefined
                      ? "None"
                      : hairColorArr[hairColor]}
                  </i>
                </span>

                <span>
                  Financial situation:{" "}
                  <i>
                    {financialStatus === null || financialStatus === undefined
                      ? "None"
                      : financialStatusArr[financialStatus]}
                  </i>
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                Additional Information:{" "}
                <p
                  className={`${
                    additionalInfo !== null &&
                    additionalInfo !== undefined &&
                    additionalInfo?.length > 0 &&
                    "p-2 border border-secondary rounded"
                  }`}
                >
                  <i>
                    {additionalInfo === null ||
                    additionalInfo === undefined ||
                    additionalInfo?.length === 0
                      ? "None"
                      : additionalInfo}
                  </i>
                </p>
              </div>
            </div>
          </Form>
        )}

        {isEditing && (
          <Form className="text-right" onSubmit={submitInfoHandler}>
            <div className="d-flex gap-4 flex-wrap">
              <div className="d-flex gap-3 text-left height-weight">
                <Form.Group controlId="height-e">
                  <Form.Label className="font-weight-bold">Height:</Form.Label>
                  <Form.Control
                    type="number"
                    style={{ width: "5rem" }}
                    ref={heightRef}
                    onChange={(e) => setHeight(e.target.value)}
                    defaultValue={height && height > 0 ? height : ""}
                  />
                </Form.Group>

                <Form.Group controlId="weight-e">
                  <Form.Label className="font-weight-bold">Weight:</Form.Label>
                  <Form.Control
                    type="number"
                    style={{ width: "5rem" }}
                    ref={weightRef}
                    onChange={(e) => setWeight(e.target.value)}
                    defaultValue={weight && weight > 0 ? weight : ""}
                  />
                </Form.Group>
              </div>

              <div>
                <div className="d-flex text-left gap-4 user-data w-100">
                  <Form.Group controlId="bodyType-e">
                    <Form.Label className="font-weight-bold">
                      Physique:
                    </Form.Label>
                    <div>
                      <Form.Check
                        label="Skinny"
                        value="0"
                        name="body-type"
                        type="radio"
                        defaultChecked={bodyType !== null && bodyType === 0}
                        onChange={() => setBodyType(0)}
                      />
                      <Form.Check
                        label="Normal"
                        value="1"
                        name="body-type"
                        type="radio"
                        defaultChecked={bodyType !== null && bodyType === 1}
                        onChange={() => setBodyType(1)}
                      />
                      <Form.Check
                        label="Sportive"
                        value="2"
                        name="body-type"
                        type="radio"
                        defaultChecked={bodyType !== null && bodyType === 2}
                        onChange={() => setBodyType(2)}
                      />
                      <Form.Check
                        label="Muscular"
                        value="3"
                        name="body-type"
                        type="radio"
                        defaultChecked={bodyType !== null && bodyType === 3}
                        onChange={() => setBodyType(3)}
                      />
                      <Form.Check
                        label="Slight Overweight"
                        value="4"
                        name="body-type"
                        type="radio"
                        defaultChecked={bodyType !== null && bodyType === 4}
                        onChange={() => setBodyType(4)}
                      />
                      <Form.Check
                        label="Overweight"
                        value="5"
                        name="body-type"
                        type="radio"
                        defaultChecked={bodyType !== null && bodyType === 5}
                        onChange={() => setBodyType(5)}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="hairColor-e">
                    <Form.Label className="font-weight-bold">
                      Hair Color:
                    </Form.Label>
                    <div>
                      <Form.Check
                        label="Light"
                        value="0"
                        type="radio"
                        defaultChecked={hairColor !== null && hairColor === 0}
                        name="hair-color"
                        onChange={() => setHairColor(0)}
                      />
                      <Form.Check
                        label="Dark"
                        value="1"
                        name="hair-color"
                        type="radio"
                        defaultChecked={hairColor !== null && hairColor === 1}
                        onChange={() => setHairColor(1)}
                      />
                      <Form.Check
                        label="Red"
                        value="2"
                        name="hair-color"
                        type="radio"
                        defaultChecked={hairColor !== null && hairColor === 2}
                        onChange={() => setHairColor(2)}
                      />
                      <Form.Check
                        label="Brown"
                        value="3"
                        name="hair-color"
                        type="radio"
                        defaultChecked={hairColor !== null && hairColor === 3}
                        onChange={() => setHairColor(3)}
                      />
                      <Form.Check
                        label="Bright"
                        value="4"
                        name="hair-color"
                        type="radio"
                        defaultChecked={hairColor !== null && hairColor === 4}
                        onChange={() => setHairColor(4)}
                      />
                      <Form.Check
                        label="Gray"
                        value="5"
                        name="hair-color"
                        type="radio"
                        defaultChecked={hairColor !== null && hairColor === 5}
                        onChange={() => setHairColor(5)}
                      />
                      <Form.Check
                        type="radio"
                        label="Bald"
                        value="6"
                        name="hair-color"
                        defaultChecked={hairColor !== null && hairColor === 6}
                        onChange={() => setHairColor(6)}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="financialStatus-e">
                    <Form.Label className="font-weight-bold">
                      Financial situation:
                    </Form.Label>
                    <Form.Check
                      label="Unstable income"
                      value="0"
                      name="financial-status"
                      type="radio"
                      defaultChecked={
                        financialStatus !== null && financialStatus === 0
                      }
                      onChange={() => setFinancialStatus(0)}
                    />
                    <Form.Check
                      label="Constant small income"
                      value="1"
                      name="financial-status"
                      type="radio"
                      defaultChecked={
                        financialStatus !== null && financialStatus === 1
                      }
                      onChange={() => setFinancialStatus(1)}
                    />
                    <Form.Check
                      label="Stable average income"
                      value="2"
                      name="financial-status"
                      type="radio"
                      defaultChecked={
                        financialStatus !== null && financialStatus === 2
                      }
                      onChange={() => setFinancialStatus(2)}
                    />
                    <Form.Check
                      label="High income"
                      type="radio"
                      value="3"
                      name="financial-status"
                      defaultChecked={
                        financialStatus !== null && financialStatus === 3
                      }
                      onChange={() => setFinancialStatus(3)}
                    />
                  </Form.Group>
                </div>

                <Form.Group controlId="additionalInfo-e" className="text-left">
                  <Form.Label className="font-weight-bold">
                    Additional Information
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="5"
                    defaultValue={
                      additionalInfo && additionalInfo?.length > 0
                        ? additionalInfo
                        : ""
                    }
                    onChange={(e) => {
                      setAdditionalInfo(e.target.value);
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            {props.isClient && (
              <Button type="submit" variant="primary" className="mt-3">
                Submit
              </Button>
            )}
          </Form>
        )}
      </Card.Body>

      {props.isClient && !isEditing && (
        <Card.Footer className="p-4 text-right">
          <Button variant="primary" onClick={setIsEditing.bind(null, true)}>
            Edit
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default AboutUser;
