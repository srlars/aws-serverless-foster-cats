import * as React from "react";
import Auth from "../auth/Auth";
import { Button } from "reactstrap";
// import { Button } from '@material-ui/core';

interface LogInProps {
  auth: Auth;
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = (): void => {
    this.props.auth.login();
  };

  render(): React.ReactElement {
    return (
      <div>
        <h1>Please Log In</h1>

        <Button
          onClick={this.onLogin}
          size="huge"
          color="olive"
          className="padding">
          Log In
        </Button>
      </div>
    );
  }
}
