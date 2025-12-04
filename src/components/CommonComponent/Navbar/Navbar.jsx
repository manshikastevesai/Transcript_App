import React from "react";
import { useAppContext } from "../../Context/AppContext";

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAppContext();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex align-items-center">
      <div className="d-flex justify-content-between gap-lg-5">
        <div className="sidebar-heading">
          <span className="logo_txt">TranScript App</span>
        </div>
        <button
          className="btn btn-link text-secondary mt-0 "
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list fs-3"></i>
        </button>
      </div>

      <ul className="navbar-nav ms-auto mt-2 mt-lg-0 d-flex flex-row align-items-center">
        <li className="nav-item">
          <a className="nav-link text-secondary fw-bold ms-3" href="#">
            <i className="bi bi-person-circle fs-5 me-1"></i>
            {user?.role && (
              <span
                className="user-name text-muted ms-1"
                style={{ fontSize: "1.1rem" }}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
