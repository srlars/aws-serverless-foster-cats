/**
 * Configured as part of the Auth0
 * setup guide for Single Page Apps
 */
import React from "react";
import { useAuth0 } from "../auth/react-auth0-spa";

type Props = {
  user?: { email: string };
};

const NavBar: React.FC<Props> = ({ user }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return isAuthenticated ? (
    <>
      {user && user.email}
      <button className="logoutButton" onClick={(): void => logout()}>
        Log out
      </button>
    </>
  ) : (
    <button onClick={(): void => loginWithRedirect({})}>Log in</button>
  );
};

export default NavBar;
