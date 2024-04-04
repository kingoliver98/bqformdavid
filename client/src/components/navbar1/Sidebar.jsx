import { useState } from "react";
import { Offcanvas, Image } from "react-bootstrap";
import { GrMenu } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <GrMenu onClick={handleShow} className="d-md-none cursor" size="20px" />
      <Offcanvas show={show} onHide={handleClose} className="bgNav">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            {user && (
              <div className="d-flex gap-3 align-items-center text-white">
                <Image
                  src={user?.avatar}
                  roundedCircle
                  className="object-fit-cover"
                  style={{ width: "40px", height: "40px" }}
                  alt={user?.username}
                />
                <p className="text-white fs-4">Hi, {user.username}</p>
              </div>
            )}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-column gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "activeLink fs-4" : "no_activeLink text-white fs-4"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/topic-selection"
              className={({ isActive }) =>
                isActive ? "activeLink fs-4" : "no_activeLink text-white fs-4"
              }
            >
              Topics
            </NavLink>
            {!user && (
              <div className="d-flex flex-column gap-2">
                <hr className="text-white" />
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive
                      ? "activeLink fs-4"
                      : "no_activeLink text-white fs-4"
                  }
                >
                  Register
                </NavLink>
                <NavLink
                  to="/signin"
                  className={({ isActive }) =>
                    isActive
                      ? "activeLink fs-4"
                      : "no_activeLink text-white fs-4"
                  }
                >
                  Sign In
                </NavLink>
              </div>
            )}
            {user && (
              <p onClick={logout} className="fs-4 activeLink">
                Logout
              </p>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
