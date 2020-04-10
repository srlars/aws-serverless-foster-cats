/**
 * Configured as part of the Auth0
 * setup guide for Single Page Apps
 */
import React from "react";
import { useAuth0 } from "../auth/react-auth0-spa";
import { Button } from "reactstrap";

type Props = {
  user?: { email: string };
};

const NavBar: React.FC<Props> = ({ user }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return isAuthenticated ? (
    <>
      {user && user.email}
      <Button
        className="logoutButton"
        onClick={(): void => logout()}
        outline
        color="secondary">
        Log Out
      </Button>
    </>
  ) : (
    <Button
      onClick={(): void => loginWithRedirect({})}
      outline
      color="secondary">
      Log In
    </Button>
  );
};

export default NavBar;
