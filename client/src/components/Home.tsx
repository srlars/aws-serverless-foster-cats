/**
 * Set up Home redirect
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <Link to="/" className="btn btn-outline-secondary">
          Home
        </Link>
      </div>
    );
  }
}

export default Home;
