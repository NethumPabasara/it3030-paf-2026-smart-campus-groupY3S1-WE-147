import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

// Role-based authorization
const userRole = "ADMIN"; // Change to "USER" for user access

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo-container">
          <img src={logo} alt="SmartCampus Logo" className="sidebar-logo-img" />
          <div className="sidebar-logo-text">SmartCampus</div>
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>
        </li>

        {userRole === 'ADMIN' && (
        <li>
          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
          >
            Bookings
          </NavLink>
        </li>
        )}

        <li>
          <NavLink
            to="/resources"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
          >
            Resources
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/create-booking"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
          >
            Create Booking
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
          >
            Users
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;