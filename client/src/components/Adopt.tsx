import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Col, Row } from "reactstrap";

const Adopt: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <Row>
      <Col>
        <h1>Adopt</h1>
      </Col>
    </Row>
  );
};

export default withRouter(Adopt);
