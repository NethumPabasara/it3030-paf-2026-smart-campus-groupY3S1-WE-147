import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [bookingsCount, setBookingsCount] = useState(null);
  const [resourcesCount, setResourcesCount] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bookings', { credentials: "include" });
        const data = await response.json();
        setBookingsCount(data.length);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/resources', { credentials: "include" });
        const data = await response.json();
        // Handle both possible wrapper structures based on backend response
        setResourcesCount(data.data ? data.data.length : data.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
    fetchResources();
  }, []);

  const username = user?.username ? user.username.split('@')[0] : "Student";
  const userRole = user?.role || "USER";

  return (
    <div className="dashboard-wrapper">
      <div className="welcome-banner">
        <div>
          <h1 className="welcome-title">Welcome back, <span>{username}</span> 👋</h1>
          <p className="welcome-subtitle">Here is your SmartCampus overview for today.</p>
        </div>
        <div className="date-badge">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">📅</span>
          </div>
          <div className="stat-info">
            <h3 className="stat-title">Total Bookings</h3>
            <div className="stat-value">{bookingsCount !== null ? bookingsCount : "..."}</div>
            <p className="stat-desc">Active bookings across campus</p>
          </div>
        </div>

        <div className="stat-card stat-secondary">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">🏢</span>
          </div>
          <div className="stat-info">
            <h3 className="stat-title">Total Resources</h3>
            <div className="stat-value">{resourcesCount !== null ? resourcesCount : "..."}</div>
            <p className="stat-desc">Spaces & Equipment available</p>
          </div>
        </div>

        <div className="stat-card stat-tertiary">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">✨</span>
          </div>
          <div className="stat-info">
            <h3 className="stat-title">System Status</h3>
            <div className="stat-value">Active</div>
            <p className="stat-desc">All services operating normally</p>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/resources')}>
            <div className="action-icon">🔍</div>
            <div className="action-text">
              <h4>Browse Resources</h4>
              <p>Find labs, halls, and equipment</p>
            </div>
          </button>

          <button className="action-card" onClick={() => navigate('/create-booking')}>
            <div className="action-icon">➕</div>
            <div className="action-text">
              <h4>New Booking</h4>
              <p>Reserve a space for your needs</p>
            </div>
          </button>
          
          {(userRole === 'ADMIN' || userRole === 'USER') && (
            <button className="action-card" onClick={() => navigate('/bookings')}>
              <div className="action-icon">📋</div>
              <div className="action-text">
                <h4>My Bookings</h4>
                <p>View and manage your reservations</p>
              </div>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 30px;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Welcome Banner */
        .welcome-banner {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.1));
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 16px;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
        }

        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }

        .welcome-title span {
          color: var(--primary);
          background: -webkit-linear-gradient(45deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-subtitle {
          color: var(--text-muted);
          font-size: 1.05rem;
        }

        .date-badge {
          background: white;
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--primary);
          box-shadow: 0 4px 10px rgba(124, 58, 237, 0.1);
        }

        /* Stats Grid */
        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid var(--border);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
        }

        .stat-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .stat-primary .stat-icon-wrapper {
          background: rgba(124, 58, 237, 0.1);
          color: var(--primary);
        }

        .stat-secondary .stat-icon-wrapper {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .stat-tertiary .stat-icon-wrapper {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-title {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          margin-bottom: 8px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Quick Actions */
        .quick-actions-section {
          margin-top: 10px;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 20px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .action-card:hover {
          border-color: var(--primary);
          background: rgba(124, 58, 237, 0.02);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
        }

        .action-icon {
          font-size: 1.8rem;
          background: var(--background);
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-text h4 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 4px;
        }

        .action-text p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .welcome-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 24px;
          }
          
          .welcome-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;