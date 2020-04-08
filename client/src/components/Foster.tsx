import PropTypes from "prop-types";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { Cat } from "../types/Cat";
import ListFosteredCats from "./ListFosteredCats";
import FosterCat from "./FosterCat";

export interface Props {
  jwt: string | undefined;
}

/**
 * {user} is the authenticated user's JWT
 */
const Foster: React.FC<Props> = ({ jwt }) => {
  const [fosteredCats, setFosteredCats] = useState<Cat[]>([]);

  return !jwt ? (
    <Row>
      <Col>Please login (see login button at top-right)</Col>
    </Row>
  ) : (
    <Row>
      <Col>
        <FosterCat
          jwt={jwt}
          fosteredCats={fosteredCats}
          setFosteredCats={setFosteredCats}
        />

        <ListFosteredCats
          jwt={jwt}
          fosteredCats={fosteredCats}
          setFosteredCats={setFosteredCats}
        />
      </Col>
    </Row>
  );
};

Foster.propTypes = {
  jwt: PropTypes.string,
};

export default Foster;
