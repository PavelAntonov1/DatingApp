import { Button, ButtonGroup, Form, Container } from "react-bootstrap";
import { useState } from "react";
import { Card } from "react-bootstrap";
import citiesRegions from "../../data/citiesRegions.json";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const regions = [...new Set(citiesRegions.map((obj) => obj.region))];

const SearchForm = (props) => {
  const [regionState, setRegion] = useState("Москва и Московская обл.");
  const navigate = useNavigate();

  const changeRegionHandler = (e) => {
    setRegion(e.target.value);
  };

  const genderRef = useRef();
  const ageMinRef = useRef();
  const ageMaxRef = useRef();
  const regionRef = useRef();
  const cityRef = useRef();
  const usernameRef = useRef();
  const hasPhotoRef = useRef();

  console.log("Filter:");
  console.log(props.filter);

  const filterUsersHandler = async (e) => {
    e.preventDefault();

    navigate("/search");

    const options = {
      gender: genderRef.current.value,
      ageMin: +ageMinRef.current.value,
      ageMax: +ageMaxRef.current.value,
      region: regionRef.current.value.startsWith("None")
        ? null
        : regionRef.current.value,
      city: cityRef.current.value.startsWith("None")
        ? null
        : cityRef.current.value,
      username: usernameRef.current.value,
      hasPhoto: hasPhotoRef.current.checked,
    };

    if (props.onFilterUsers) {
      props.onFilterUsers(options);
    } else {
      props.onPassFilter(options);
    }
  };

  return (
    <Form
      className={props.className}
      style={props.style}
      onSubmit={filterUsersHandler}
    >
      <Card className="bg-white p-4 d-flex flex-column gap-3">
        <Card.Title>Search</Card.Title>

        <Form.Group controlId="username">
          <Form.Label>Name:</Form.Label>
          <Form.Control type="text" name="searchName" ref={usernameRef} />
        </Form.Group>

        <div className="d-flex flex-row justify-content-between">
          <Form.Group
            controlId="gender"
            style={{ minWidth: "4rem" }}
            className="mr-2"
          >
            <Form.Label>Gender:</Form.Label>

            <Form.Select name="searchGender" ref={genderRef}>
              <option value="male">М</option>
              <option value="female">F</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="ageRange">
            <Form.Label>Age:</Form.Label>

            <div className="d-flex align-items-center w-100 gap-2">
              <span>from</span>
              <Form.Group controlId="ageRangeBegin">
                <Form.Control
                  type="number"
                  name="searchAgeBegin"
                  defaultValue={18}
                  min={18}
                  max={100}
                  style={{ width: "4rem" }}
                  className="text-center"
                  ref={ageMinRef}
                />
              </Form.Group>

              <span>to</span>
              <Form.Group controlId="ageRangeEnd">
                <Form.Control
                  type="number"
                  name="searchAgeEnd"
                  defaultValue={35}
                  min={18}
                  max={100}
                  style={{ width: "4rem" }}
                  className="text-center"
                  ref={ageMaxRef}
                />
              </Form.Group>
            </div>
          </Form.Group>
        </div>

        <Form.Group>
          <Form.Label>Region:</Form.Label>
          <Form.Select
            name="searchRegion"
            onChange={changeRegionHandler}
            ref={regionRef}
          >
            <option value={null}>None</option>
            {regions.map((region, i) => (
              <option value={region} key={i}>
                {region}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>City:</Form.Label>
          <Form.Select
            name="searchCity"
            style={{ width: "10rem" }}
            ref={cityRef}
          >
            <option value={null}>None</option>
            {citiesRegions.map((obj, i) => {
              if (obj.region === regionState) {
                return (
                  <option value={obj.city} key={i}>
                    {obj.city}
                  </option>
                );
              }
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Check
            name="searchHasPhoto"
            label="With photo"
            ref={hasPhotoRef}
          />
        </Form.Group>

        {/* <Form.Group className="d-flex gap-3">

          <Form.Check
            type="radio"
            name="searchActivity"
            label="Online"
            value="online"
          />

          <Form.Check
            type="radio"
            name="searchActivity"
            label="All"
            value="all"
            defaultChecked
          />
        </Form.Group> */}

        <Button variant="secondary" type="submit" className="">
          Search
        </Button>
      </Card>
    </Form>
  );
};

export default SearchForm;
