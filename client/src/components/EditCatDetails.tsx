/**
 * Display Modal dialog for editing the race and gender of a cat
 * and updating the details in the DynamoDB
 */
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Row,
  Col,
  Container,
} from "reactstrap";
import log from "../utils/Log";
import { Cat } from "../types/Cat";
import { updateCat } from "../api/cat-pool-api";
import uuid from "uuid";

export interface Props {
  jwt: string | undefined;
  fosteredCats: Cat[];
  setFosteredCats: (arg: Cat[]) => void;
  modal: boolean;
  setModal: (arg: boolean) => void;
  currentCat: Cat;
  getCatsForUser: (jwt: string) => void;
}

const EditCatDetails: React.FC<Props> = ({
  jwt,
  fosteredCats,
  setFosteredCats,
  modal,
  setModal,
  currentCat,
  getCatsForUser,
}) => {
  const [race, setRace] = useState(currentCat.race);
  const [gender, setGender] = useState(currentCat.gender);
  const [age, setAge] = useState(currentCat.age);
  const [name, setName] = useState(currentCat.name);

  const toggle = (): void => setModal(!modal);

  /**
   * Update the cat race, gender, age and name on DynamoDB
   */
  const updateDetails = async (): Promise<void> => {
    log.info("Updating cat");
    if (jwt) {
      const response = await updateCat(
        jwt,
        currentCat.catId,
        race,
        gender,
        age,
        name
      );
      log.info(JSON.stringify(response));
      if (response.status < 299) {
        // On successful change, close modal and refresh
        setModal(false);
        const cats = [...fosteredCats];
        const catToUpdate = cats.filter(
          (cat) => cat.catId === currentCat.catId
        )[0];
        catToUpdate.nonce = uuid.v4();
        catToUpdate.race = race;
        catToUpdate.gender = gender;
        catToUpdate.age = age;
        catToUpdate.name = name;
        setFosteredCats(cats);
        getCatsForUser(jwt);
      }
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Cat Details</ModalHeader>
      <ModalBody>
        <Container>
          <Row>
            <Col sm={2}>
              <Label htmlFor="race">Race</Label>
            </Col>
            <Col>
              <Input
                id="race"
                type="text"
                value={race}
                onChange={(e): void => setRace(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <Label htmlFor="gender">Gender</Label>
            </Col>
            <Col>
              <Input
                id="gender"
                type="text"
                value={gender}
                onChange={(e): void => setGender(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <Label htmlFor="age">Age</Label>
            </Col>
            <Col>
              <Input
                id="age"
                type="text"
                value={age}
                onChange={(e): void => setAge(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <Label htmlFor="name">Name</Label>
            </Col>
            <Col>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e): void => setName(e.target.value)}
              />
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={updateDetails}
          disabled={!race || !gender || !age || !name}>
          Update
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

EditCatDetails.propTypes = {
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
  modal: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
  currentCat: PropTypes.shape({
    catId: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    race: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    pictureUrl: PropTypes.string,
    nonce: PropTypes.string,
  }).isRequired,
  getCatsForUser: PropTypes.func.isRequired,
};

export default EditCatDetails;
