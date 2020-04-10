import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useEffect, useCallback } from "react";
import { Col, Row, Table } from "reactstrap";
import uuid from "uuid";
import { getAllCats } from "../api/cat-pool-api";
import { Cat } from "../types/Cat";
import log from "../utils/Log";
import "../App.css";

export interface Props {
  fosteredCats: Cat[];
  setFosteredCats: (arg: Cat[]) => void;
}

/**
 * {user} is the authenticated user's JWT
 */
const ListFosteredCats: React.FC<Props> = ({
  fosteredCats,
  setFosteredCats,
}) => {
  /**
   * List of all cats for user
   */
  const getCats = useCallback(async (): Promise<void> => {
    log.info("Calling API to get all fostered cats");
    try {
      const response = await getAllCats();
      const cats = response.data.map((cat) => ({ ...cat, nonce: uuid.v4() }));
      setFosteredCats(cats);
      log.info(`${JSON.stringify(response)}`);
    } catch (e) {
      log.error(JSON.stringify(e));
    }
  }, [setFosteredCats]);

  /**
   * Login will trigger getting list of cats from DynamoDB
   */
  useEffect(() => {
    getCats();
  }, [getCats]);

  /**
   * Shortcut if no fostered cats
   */
  if (fosteredCats.length === 0) {
    return <></>;
  }

  /**
   * Utility to render a single fostered cat
   * @param cat
   * @param idx
   */
  const fosteredCat = (cat: Cat, idx: number): React.ReactElement => {
    const imageUrl = `${cat.pictureUrl}?nonce=${cat.nonce}`;
    return (
      <tr key={cat.catId}>
        <td>{idx + 1}</td>
        <td>{cat.race}</td>
        <td>{cat.gender}</td>
        <td>{cat.age}</td>
        <td>{cat.name}</td>
        <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
        <td>
          <img src={imageUrl} height={150} alt="" />
        </td>
        <td>
          <FontAwesomeIcon icon={faHome} size="lg" />
        </td>
      </tr>
    );
  };

  return (
    <>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Cats Searching A New Family</h3>
        </Col>
      </Row>

      <Row>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Race</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Name</th>
              <th>Date</th>
              <th>Picture</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{fosteredCats.map((cat, idx) => fosteredCat(cat, idx))}</tbody>
        </Table>
      </Row>
    </>
  );
};

ListFosteredCats.propTypes = {
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

export default ListFosteredCats;
