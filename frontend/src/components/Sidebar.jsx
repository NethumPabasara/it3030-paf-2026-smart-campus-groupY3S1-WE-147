import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

function Sidebar() {
  const [user, setUser] = useState(null);

  // Get user role from logged-in user, default to null if not logged in
  const userRole = user?.role || null;

  useEffect(() => {
    // Check if user is logged in from localStorage first
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Check for OAuth login redirect
    const checkLoginStatus = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get("username");
      const role = urlParams.get("role");
      
      if (username && role) {
        const userData = {
          username,
          role,
          loggedIn: true
        };
        
        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    checkLoginStatus();
  }, []);

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

        {(userRole === 'ADMIN' || userRole === 'USER') && (
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

      {/* User Authentication Section */}
      <div className="sidebar-auth">
        {user && user.loggedIn ? (
          <div className="user-info">
            <div className="user-avatar-small">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="username">{user.username}</div>
              <div className="login-status">Logged in</div>
            </div>
          </div>
        ) : (
          <a 
            href="http://localhost:8080/oauth2/authorization/google"
            className="login-btn"
          >
            Login with Google
          </a>
        )}
      </div>
    </div>
  );
}

export default Sidebar;