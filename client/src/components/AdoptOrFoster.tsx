import { faCat, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Card, CardBody, CardText, CardTitle, Col, Row } from "reactstrap";

const AdoptOrFoster: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <Row>
      <Col>
        <Card
          style={{ cursor: "pointer" }}
          onClick={() => history.push("/adopt")}
          className="padding center">
          <CardBody>
            <FontAwesomeIcon icon={faHome} size={"10x"} />
          </CardBody>
          <CardBody>
            <CardTitle>
              <h1>Adopt</h1>
            </CardTitle>
            <CardText>a cat and grow your family</CardText>
          </CardBody>
        </Card>
      </Col>
      <Col>
        <Card
          style={{ cursor: "pointer" }}
          onClick={(): void => history.push("/foster")}
          className="padding center">
          <CardBody>
            <FontAwesomeIcon icon={faCat} size={"10x"} />
          </CardBody>
          <CardBody>
            <CardTitle>
              <h1>Foster</h1>
            </CardTitle>
            <CardText>your cat and spread love</CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default withRouter(AdoptOrFoster);
