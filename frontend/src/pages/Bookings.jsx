import { useEffect, useState } from "react";
import '../styles/theme.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          grid-template-columns: 80px 1fr 1fr 120px 180px 180px 200px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          font-weight: 600;
          padding: 16px 20px;
          gap: 10px;
        }

        .header-cell {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.9;
        }

        .bookings-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .booking-row {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 120px 180px 180px 200px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          transition: var(--transition);
          gap: 10px;
          align-items: center;
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

        @media (max-width: 1024px) {
          .bookings-header,
          .booking-row {
            grid-template-columns: 70px 1fr 100px 110px 150px 150px 180px;
            padding: 14px 18px;
          }
        }

        @media (max-width: 768px) {
          .bookings-header,
          .booking-row {
            grid-template-columns: 60px 1fr 80px 100px 120px 120px 140px;
            padding: 12px 16px;
            gap: 8px;
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
        }
      `}</style>
    </>
  );
}

export default Bookings;