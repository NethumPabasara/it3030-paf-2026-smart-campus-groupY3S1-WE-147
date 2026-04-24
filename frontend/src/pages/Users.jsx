import { useEffect, useState } from "react";
import '../styles/theme.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Get user role from logged-in user, default to null if not logged in
  const userRole = user?.role || null;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const currentUser = savedUser ? JSON.parse(savedUser) : null;
        
        if (currentUser?.role !== "ADMIN") {
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8080/api/users", { credentials: "include" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(`Failed to load users: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (!loading && userRole !== 'ADMIN') {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#EF4444', fontSize: '1.2rem', fontWeight: '600' }}>
          Access Denied. Only Administrators can view this page.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="heading-1">Users</h1>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            Loading users...
          </p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}>
          <p style={{ color: '#EF4444', fontSize: '1.1rem', fontWeight: '600' }}>
            {error}
          </p>
        </div>
      )}

      <div className="card">
        {!loading && !error && users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 15px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white',
                opacity: '0.7'
              }}>
                👥
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
              No users found
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Start by inviting users to the system
            </p>
          </div>
        ) : !loading && !error && (
          <div className="users-table-container">
            <div className="users-header">
              <div className="header-cell">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ opacity: '0.8' }}>🔢</span>
                  ID
                </div>
              </div>
              <div className="header-cell">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ opacity: '0.8' }}>👤</span>
                  Username
                </div>
              </div>
              <div className="header-cell">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ opacity: '0.8' }}>🛡️</span>
                  Role
                </div>
              </div>
              <div className="header-cell">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ opacity: '0.8' }}>📅</span>
                  Created
                </div>
              </div>
            </div>
            <div className="users-list">
              {users.map((u) => (
                <div key={u.id} className="user-row">
                  <div className="user-cell user-id">
                    <span style={{ 
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      color: 'var(--primary)',
                      fontSize: '0.9rem'
                    }}>
                      #{u.id}
                    </span>
                  </div>
                  <div className="user-cell user-info">
                    <div className="user-avatar">
                      {u.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{u.username}</div>
                      <div className="user-email">{u.email || 'No email'}</div>
                    </div>
                  </div>
                  <div className="user-cell user-role">
                    <span 
                      className={`role-badge ${u.role?.toLowerCase()}`}
                    >
                      {u.role === 'ADMIN' ? '👑' : '👤'} {u.role}
                    </span>
                  </div>
                  <div className="user-cell user-created">
                    <div className="created-info">
                      <div className="created-date">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                      <div className="created-time">
                        {u.createdAt ? new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .users-table-container {
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .users-header {
          display: grid;
          grid-template-columns: 80px 1.5fr 120px 140px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          font-weight: 600;
          padding: 16px 20px;
          gap: 12px;
          border-radius: var(--border-radius) var(--border-radius) 0 0;
        }

        .user-row {
          display: grid;
          grid-template-columns: 80px 1.5fr 120px 140px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          transition: all 0.2s ease;
          gap: 12px;
          align-items: center;
          background-color: var(--card-bg);
        }

        .user-row:hover {
          background-color: rgba(124, 58, 237, 0.05);
          transform: translateX(2px);
        }

        .user-row:last-child {
          border-bottom: none;
        }

        .user-cell {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
        }

        .user-id {
          justify-content: flex-start;
        }

        .user-info {
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-name {
          font-weight: 600;
          color: var(--text);
          font-size: 0.95rem;
        }

        .user-email {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .user-role {
          justify-content: center;
        }

        .role-badge {
          background-color: var(--primary);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .role-badge.admin {
          background: linear-gradient(135deg, #7C3AED, #9333EA);
          box-shadow: 0 2px 4px rgba(124, 58, 237, 0.3);
        }

        .role-badge.user {
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .role-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .user-created {
          justify-content: flex-start;
        }

        .created-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .created-date {
          font-size: 0.85rem;
          color: var(--text);
          font-weight: 500;
        }

        .created-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: 'monospace';
        }

        @media (max-width: 768px) {
          .users-header {
            grid-template-columns: 60px 1fr 80px;
            padding: 12px 16px;
          }
          
          .user-row {
            grid-template-columns: 60px 1fr 80px;
            padding: 12px 16px;
          }
          
          .user-created {
            display: none;
          }
          
          .users-header .header-cell:nth-child(4),
          .user-row .user-cell:nth-child(4) {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default Users;