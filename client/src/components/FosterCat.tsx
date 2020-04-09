import React, { useState, useEffect } from "react";
import { Row, Col, Label, Input, Button, Spinner } from "reactstrap";
import { createCat } from "../api/cat-pool-api";
import { Cat } from "../types/Cat";
import log from "../utils/Log";
import PropTypes from "prop-types";

interface Props {
  jwt: string;
  fosteredCats: Cat[];
  setFosteredCats: (arg: Cat[]) => void;
}

const FosterCat: React.FC<Props> = ({ jwt, fosteredCats, setFosteredCats }) => {
  // State of the Foster button:  Disabled <-> Idle -> Fostering -> Success|Failed
  enum FosterAction {
    Disabled = "Foster!",
    Idle = "Foster it!",
    Fostering = "Fostering... ",
    Failed = "Failed 🆇",
    Success = "Completed",
  }

  const [catRace, setCatRace] = useState<string | undefined>("");
  const [catGender, setCatGender] = useState<string | undefined>("");
  const [catAge, setCatAge] = useState<string | undefined>("");
  const [catName, setCatName] = useState<string | undefined>("");
  const [fosterStatus, setFosterStatus] = useState<FosterAction>(
    FosterAction.Disabled
  );

  useEffect(() => {
    if (fosterStatus === FosterAction.Idle || FosterAction.Disabled) {
      if (catRace && catGender && catAge && catName) {
        setFosterStatus(FosterAction.Idle);
      } else {
        setFosterStatus(FosterAction.Disabled);
      }
    }
  }, [
    catRace,
    catGender,
    catAge,
    catName,
    FosterAction.Idle,
    FosterAction.Disabled,
    fosterStatus,
  ]);

  /**
   * User has requested to upload details of cat
   * to foster to marketplace
   * @param e
   */
  const fosterCat = async (): Promise<void> => {
    if (fosterStatus === FosterAction.Idle) {
      if (jwt && catRace && catGender && catAge && catName) {
        setFosterStatus(FosterAction.Fostering);
        try {
          const response = await createCat(jwt, {
            race: catRace,
            gender: catGender,
            age: catAge,
            name: catName,
          });
          if (response.status < 299) {
            const cat = response.data;
            log.info(`created cat for fostering ${JSON.stringify(cat)}`);
            // const uploadUrl = response.data.uploadUrl;
            // log.info(`upload URL is ${uploadUrl}`);
            setFosteredCats([...fosteredCats, cat]);
            // Temporarily set upload button to success
            // then blank out the Race, Gender, Age and Name
            setFosterStatus(FosterAction.Success);
            setTimeout(() => {
              setCatRace("");
              setCatGender("");
              setCatAge("");
              setCatName("");
            }, 1000);
          } else {
            setFosterStatus(FosterAction.Failed);
          }
        } catch (e) {
          log.error(JSON.stringify(e));
          setFosterStatus(FosterAction.Failed);
        }
      } else {
        log.info(
          "Can't foster cat: either jwt, race, gender, age or name are not available."
        );
      }
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h3>Foster Your Cat</h3>
        </Col>
      </Row>

      <Row>
        <Col sm={1}>
          <Label for="race" class="align-middle">
            Race
          </Label>
        </Col>
        <Col>
          <Input
            type="text"
            id="race"
            placeholder="Persian"
            value={catRace}
            onChange={(e): void => setCatRace(e.target.value)}
          />
        </Col>
        <Col sm={1}>
          <Label for="gender" class="align-middle">
            Gender
          </Label>
        </Col>
        <Col>
          <Input
            type="text"
            id="gender"
            placeholder="Female"
            value={catGender}
            onChange={(e): void => setCatGender(e.target.value)}
          />
        </Col>
        <Col sm={1}>
          <Label for="age" class="align-middle">
            Age
          </Label>
        </Col>
        <Col>
          <Input
            type="text"
            id="age"
            placeholder="1 year"
            value={catAge}
            onChange={(e): void => setCatAge(e.target.value)}
          />
        </Col>
        <Col sm={1}>
          <Label for="name" class="align-middle">
            Name
          </Label>
        </Col>
        <Col>
          <Input
            type="text"
            id="name"
            placeholder="Missy"
            value={catName}
            onChange={(e): void => setCatName(e.target.value)}
          />
        </Col>
        <Col>
          <Button
            outline
            color={"secondary"}
            onClick={fosterCat}
            disabled={!catRace || !catGender || !catAge || !catName}>
            {fosterStatus}{" "}
            {fosterStatus === FosterAction.Fostering && (
              <Spinner style={{ height: "1.5rem", width: "1.5rem" }} />
            )}
          </Button>
        </Col>
      </Row>
    </>
  );
};

FosterCat.propTypes = {
  jwt: PropTypes.string.isRequired,
  fosteredCats: PropTypes.arrayOf(
    PropTypes.shape({
      catId: PropTypes.string.isRequired,
      ownerId: PropTypes.string.isRequired,
      race: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      age: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      pictureUrl: PropTypes.string,
      nonce: PropTypes.string,
    }).isRequired
  ).isRequired,
  setFosteredCats: PropTypes.func.isRequired,
};

export default FosterCat;
