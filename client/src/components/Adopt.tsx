import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { Cat } from "../types/Cat";
import ListAdoptedCats from "./ListAdoptedCats";

const Adopt: React.FC = () => {
  const [fosteredCats, setFosteredCats] = useState<Cat[]>([]);

  return (
    <Row>
      <Col>
        <ListAdoptedCats
          fosteredCats={fosteredCats}
          setFosteredCats={setFosteredCats}
        />
      </Col>
    </Row>
  );
};

export default Adopt;
