import Amplify from "aws-amplify";
import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Col, Container, Jumbotron, Row } from "reactstrap";
import "./App.css";
/**
 * Authenticate React with AWS using Auth0
 * See https://auth0.com/authenticate/react/amazon/
 */
import awsconfig from "./aws-exports";
import Foster from "./components/Foster";
import AdoptOrFoster from "./components/AdoptOrFoster";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./auth/react-auth0-spa";

Amplify.configure(awsconfig);

const App: React.FC = () => {
  const [jwt, setJwt] = useState<string | undefined>(undefined);
  const { loading, user, getIdTokenClaims } = useAuth0();

  /**
   * Get a JWT from Auth0 SDK
   */
  if (!loading) {
    getIdTokenClaims().then((claims: IdToken) => {
      if (claims && claims.__raw) {
        setJwt(claims.__raw);
      }
    });
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <Row className="float-right">
                <NavBar user={user} />
              </Row>
              <Row>
                <Col>
                  <h1 className="display-3">Foster Cats</h1>
                  <h3 className="lead">Gift a furry friend a home</h3>
                </Col>
              </Row>
            </Jumbotron>
          </Col>
        </Row>

        <Switch>
          <Route path="/" exact render={(): JSX.Element => <AdoptOrFoster />} />
          {/* <Route
            path="/adopt"
            render={(): JSX.Element => <Adopt jwt={jwt} />}
          /> */}
          <Route
            path="/foster"
            render={(): JSX.Element => <Foster jwt={jwt} />}
          />
        </Switch>
      </Container>
    </>
  );
};

export default App;
