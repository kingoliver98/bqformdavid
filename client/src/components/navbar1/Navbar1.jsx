import { Container, Image, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Sidebar from "./Sidebar";
import useAuth from "../../hooks/useAuth";

const Navbar1 = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bgNav text-white fixed-top w-100 p-3">
      <Container className="d-flex justify-content-between align-items-center">
        <NavLink to="/">
          <Image src={logo} alt="logo" style={{ width: "50px" }} />
        </NavLink>
        <div className="d-none d-md-flex gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "activeLink" : "no_activeLink text-white"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/topic-selection"
            className={({ isActive }) =>
              isActive ? "activeLink" : "no_activeLink text-white"
            }
          >
            Topics
          </NavLink>
          <NavLink
            to="/spaces"
            className={({ isActive }) =>
              isActive ? "activeLink" : "no_activeLink text-white"
            }
          >
            Spaces
          </NavLink>
        </div>
        {user ? (
          <div className="d-none d-md-flex gap-4">
            <Button variant="light" className="rounded-4" onClick={logout}>
              Logout
            </Button>
            <Image
              src={user?.avatar}
              roundedCircle
              className="object-fit-cover"
              style={{ width: "40px", height: "40px" }}
              alt={user?.username}
            />
          </div>
        ) : (
          <div className="d-none d-md-flex gap-4 align-items-center">
            <Button
              as={NavLink}
              to="/signup"
              variant="light"
              className="rounded-4"
            >
              Register
            </Button>
            <NavLink to="/signin" className="text-white">
              Sign In
            </NavLink>
          </div>
        )}
        <Sidebar />
      </Container>
    </nav>
  );
};

export default Navbar1;
