/**
 * Set up Home redirect
 */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button } from "reactstrap";

class Home extends Component {
  state = {
    redirect: false,
  };
  setRedirect = () => {
    if (this.state.redirect === false) {
      this.setState({
        redirect: true,
      });
    }
    if (this.state.redirect === true) {
      this.setState({
        redirect: false,
      });
    }
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  render() {
    return (
      <div>
        {this.renderRedirect()}
        <Button action="/" outline color="secondary" onClick={this.setRedirect}>
          Home
        </Button>
      </div>
    );
  }
}

export default Home;
