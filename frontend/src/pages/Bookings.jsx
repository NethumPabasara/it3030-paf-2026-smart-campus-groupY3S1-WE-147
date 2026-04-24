import { useEffect, useState } from "react";
import '../styles/theme.css';

// Role-based authorization
const userRole = "ADMIN"; // Change to "ADMIN" for admin access

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/bookings");
        const data = await response.json();
        setBookings(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#22C55E'; // success green
      case 'pending':
        return '#F59E0B'; // warning orange
      case 'cancelled':
        return '#EF4444'; // danger red
      default:
        return '#6B7280'; // gray
    }
  };

  const getStatusBadge = (status) => {
    const safeStatus = status || 'UNKNOWN';
    const color = getStatusColor(safeStatus);
    return (
      <span 
        style={{
          backgroundColor: color,
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {safeStatus}
      </span>
    );
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
      return '-';
    }
  };

  const getRejectionReason = (reason, status) => {
    if (!reason) return '-';
    
    const isCancelled = status?.toLowerCase() === 'cancelled';
    const textColor = isCancelled ? '#EF4444' : 'var(--text)';
    
    return (
      <span style={{ color: textColor, fontSize: '0.9rem' }}>
        {reason}
      </span>
    );
  };

  const refreshBookings = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error refreshing bookings:", error);
    }
  };

  const handleApprove = async (bookingId) => {
    if (userRole !== 'ADMIN') {
      setActionMessage('Access denied');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/approve`, {
        method: 'PUT'
      });

      if (response.ok) {
        setActionMessage('Booking approved successfully');
        await refreshBookings();
      } else {
        throw new Error('Failed to approve booking');
      }
    } catch (error) {
      console.error("Error approving booking:", error);
      setActionMessage('Failed to approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    if (userRole !== 'ADMIN') {
      setActionMessage('Access denied');
      return;
    }

    if (!rejectReason.trim()) {
      setActionMessage('Please provide a rejection reason');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}/reject?reason=${encodeURIComponent(rejectReason)}`,
        { method: 'PUT' }
      );

      if (res.ok) {
        setActionMessage('Booking rejected successfully');
        setRejectingId(null);
        setRejectReason('');
        await refreshBookings();
      } else {
        const err = await res.text();
        console.error("Reject error:", err);
        throw new Error();
      }
    } catch (e) {
      setActionMessage('Failed to reject booking');
    }
  };

  const startReject = (bookingId) => {
    setRejectingId(bookingId);
    setRejectReason('');
    setActionMessage(null);
  };

  const cancelReject = () => {
    setRejectingId(null);
    setRejectReason('');
    setActionMessage(null);
  };

  return (
    <>
      <h1 className="heading-1">Bookings</h1>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            Loading...
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

      {actionMessage && (
        <div style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}>
          <p style={{ 
            color: actionMessage.includes('successfully') ? '#22C55E' : '#F59E0B', 
            fontSize: '1.1rem', 
            fontWeight: '600' 
          }}>
            {actionMessage}
          </p>
        </div>
      )}

      <div className="card">
        {!loading && !error && bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
              No bookings found
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              Create your first booking to get started
            </p>
          </div>
        ) : !loading && !error && (
          <div className="bookings-table-container">
            <div className="bookings-header">
              <div className="header-cell">ID</div>
              <div className="header-cell">User</div>
              <div className="header-cell">Resource</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Start Time</div>
              <div className="header-cell">End Time</div>
              <div className="header-cell">Rejection Reason</div>
              <div className="header-cell">Actions</div>
            </div>
            <div className="bookings-list">
              {bookings.map((b) => (
                <div key={b.id} className="booking-row">
                  <div className="booking-cell booking-id">#{b.id}</div>
                  <div className="booking-cell booking-user">
                    <div className="user-avatar">
                      {b.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span>{b.username}</span>
                  </div>
                  <div className="booking-cell booking-resource">{b.resourceId}</div>
                  <div className="booking-cell booking-status">
                    {getStatusBadge(b.status)}
                  </div>
                  <div className="booking-cell booking-time">{formatDateTime(b.startTime)}</div>
                  <div className="booking-cell booking-time">{formatDateTime(b.endTime)}</div>
                  <div className="booking-cell booking-reason">{getRejectionReason(b.rejection_reason, b.status)}</div>
                  <div className="booking-cell booking-actions">
                    {b.status?.toLowerCase() === 'pending' && userRole === 'ADMIN' && (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleApprove(b.id)}
                          className="btn-approve"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => startReject(b.id)}
                          className="btn-reject"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {rejectingId === b.id && userRole === 'ADMIN' && (
                      <div className="reject-form">
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Enter rejection reason..."
                          className="reject-input"
                          rows="2"
                        />
                        <div className="reject-buttons">
                          <button
                            onClick={() => handleReject(b.id)}
                            className="btn-confirm-reject"
                          >
                            Reject
                          </button>
                          <button
                            onClick={cancelReject}
                            className="btn-cancel-reject"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .bookings-table-container {
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .bookings-header {
          display: grid;
          grid-template-columns: 70px 1.2fr 1fr 100px 160px 160px 180px 120px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          font-weight: 600;
          padding: 14px 16px;
          gap: 8px;
          border-radius: var(--border-radius) var(--border-radius) 0 0;
        }

        .header-cell {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.9;
        }

        .booking-row {
          display: grid;
          grid-template-columns: 70px 1.2fr 1fr 100px 160px 160px 180px 120px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          transition: var(--transition);
          gap: 8px;
          align-items: center;
          background-color: var(--card-bg);
        }

        .booking-row:hover {
          background-color: rgba(124, 58, 237, 0.05);
        }

        .booking-row:last-child {
          border-bottom: none;
        }

        .booking-cell {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
        }

        .booking-id {
          font-weight: 700;
          color: var(--primary);
          font-family: 'Courier New', monospace;
        }

        .booking-user {
          gap: 12px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .booking-resource {
          color: var(--text);
        }

        .booking-status {
          justify-content: center;
        }

        .booking-time {
          color: var(--text-muted);
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
        }

        .booking-reason {
          color: var(--text);
          font-size: 0.9rem;
        }

        .booking-actions {
          justify-content: center;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-approve,
        .btn-reject,
        .btn-confirm-reject,
        .btn-cancel-reject {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-approve {
          background-color: #22C55E;
          color: white;
        }

        .btn-approve:hover {
          background-color: #16a34a;
          transform: translateY(-1px);
        }

        .btn-reject {
          background-color: #EF4444;
          color: white;
        }

        .btn-reject:hover {
          background-color: #dc2626;
          transform: translateY(-1px);
        }

        .reject-form {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 110px;
          max-width: 110px;
          position: relative;
          z-index: 10;
        }

        .reject-input {
          padding: 8px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background-color: var(--card-bg);
          color: var(--text);
          font-size: 0.8rem;
          resize: vertical;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
        }

        .reject-buttons {
          display: flex;
          gap: 6px;
        }

        .btn-confirm-reject {
          background-color: #EF4444;
          color: white;
        }

        .btn-confirm-reject:hover {
          background-color: #dc2626;
        }

        .btn-cancel-reject {
          background-color: #6B7280;
          color: white;
        }

        .btn-cancel-reject:hover {
          background-color: #4B5563;
        }

        @media (max-width: 1024px) {
          .bookings-header,
          .booking-row {
            grid-template-columns: 60px 1fr 100px 90px 140px 140px 160px 100px;
            padding: 12px 14px;
            gap: 6px;
          }

          .btn-approve,
          .btn-reject,
          .btn-confirm-reject,
          .btn-cancel-reject {
            padding: 5px 10px;
            font-size: 0.7rem;
          }

          .reject-form {
            min-width: 90px;
            max-width: 90px;
          }
        }

        @media (max-width: 768px) {
          .bookings-header,
          .booking-row {
            grid-template-columns: 50px 1fr 80px 80px 120px 120px 140px 90px;
            padding: 10px 12px;
            gap: 6px;
          }
          
          .user-avatar {
            width: 28px;
            height: 28px;
            font-size: 0.75rem;
          }

          .booking-time {
            font-size: 0.75rem;
          }

          .booking-reason {
            font-size: 0.8rem;
          }

          .btn-approve,
          .btn-reject,
          .btn-confirm-reject,
          .btn-cancel-reject {
            padding: 4px 8px;
            font-size: 0.65rem;
          }

          .reject-form {
            min-width: 80px;
            max-width: 80px;
          }
        }
      `}</style>
    </>
  );
}

export default Bookings;