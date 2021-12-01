import React from "react";
import logo from "../img/logo.png";
import { Link } from "react-router-dom";

import "./Layout.css";
/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-dark align-items-start p-0">
      <div className="container-fluid d-flex flex-column p-0">
        <Link
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          to="/"
        >
          <div className="sidebar-brand-text  mx-3 sidebar-logo">
            <p className="hide">periodic tables</p>
            <img alt="logo" width="100%" className="" src={logo} />
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />
        <div
          className=" text-light d-flex flex-wrap col-md-6 justify-content-center"
          id="accordionSidebar"
        >
          <div className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <span className="oi oi-clipboard"></span>
            </Link>
          </div>
          <div className="nav-item">
            <Link className="nav-link" to="/search">
              <span className="oi oi-magnifying-glass" />
            </Link>
          </div>
          <div className="nav-item">
            <Link className="nav-link" to="/reservations/new">
              <span className="oi oi-people"></span>
            </Link>
          </div>
          <div className="nav-item">
            <Link className="nav-link" to="/tables/new">
              <span className="oi oi-layers" />
            </Link>
          </div>
        </div>
        <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;
