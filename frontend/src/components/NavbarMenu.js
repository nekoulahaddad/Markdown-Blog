import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./Navbar.css";
import { LinkContainer } from "react-router-bootstrap";
import { useStateValue } from "./StateProvider";
import { logout } from "./actions";

export default function NavbarMenu(props) {
  const [state, dispatch] = useStateValue();
  const { isAuthenticated, user } = state;

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <div className="mb-3">
      <Navbar bg="light" expand="lg">
        <LinkContainer to="/">
          <Navbar.Brand>
            Nekoula<span className="text-info">Blog</span>
          </Navbar.Brand>
        </LinkContainer>
        <Nav className="halo linky">
          {isAuthenticated ? (
            <div>
              <span className="sign-text">SIGNED IN AS:</span>
              <span className="sign-text text-info">{user.name}</span>
              {isAuthenticated && user.admin ? (
                <LinkContainer className="sign-text" to="/AddArticle">
                  <Nav.Link className="linky">Add Article</Nav.Link>
                </LinkContainer>
              ) : null}
              <button className="ml-2 log-out button linky" onClick={logOut}>
                Log Out
              </button>
            </div>
          ) : (
            <div>
              <LinkContainer to="/signup">
                <Nav.Link className="linky">Sign Up</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/signin">
                <Nav.Link className="button linky">Log In</Nav.Link>
              </LinkContainer>
            </div>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}
