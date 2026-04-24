import { useEffect, useState } from "react";
import '../styles/theme.css';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/resources");
        const data = await response.json();
        
        // Handle both wrapped and direct array responses
        const resourcesData = data.data || data;
        setResources(resourcesData);
        setError(null);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#22C55E'; // success green
      case 'out_of_service':
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
        {safeStatus.replace('_', ' ')}
      </span>
    );
  };

  return (
    <>
      <h1 className="heading-1">Resources</h1>

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
        {!loading && !error && resources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
              No resources found
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              Add your first resource to get started
            </p>
          </div>
        ) : !loading && !error && (
          <div className="resources-table-container">
            <div className="resources-header">
              <div className="header-cell">ID</div>
              <div className="header-cell">Name</div>
              <div className="header-cell">Type</div>
              <div className="header-cell">Capacity</div>
              <div className="header-cell">Location</div>
              <div className="header-cell">Status</div>
            </div>
            <div className="resources-list">
              {resources.map((r) => (
                <div key={r.id} className="resource-row">
                  <div className="resource-cell resource-id">#{r.id}</div>
                  <div className="resource-cell resource-name">{r.name || r.type || '-'}</div>
                  <div className="resource-cell resource-type">{r.type}</div>
                  <div className="resource-cell resource-capacity">{r.capacity || '-'}</div>
                  <div className="resource-cell resource-location">{r.location || '-'}</div>
                  <div className="resource-cell resource-status">
                    {getStatusBadge(r.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .resources-table-container {
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .resources-header {
          display: grid;
          grid-template-columns: 80px 1fr 120px 100px 150px 140px;
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

        .resources-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .resource-row {
          display: grid;
          grid-template-columns: 80px 1fr 120px 100px 150px 140px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          transition: var(--transition);
          gap: 10px;
          align-items: center;
        }

        .resource-row:hover {
          background-color: rgba(124, 58, 237, 0.05);
        }

        .resource-row:last-child {
          border-bottom: none;
        }

        .resource-cell {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
        }

        .resource-id {
          font-weight: 700;
          color: var(--primary);
          font-family: 'Courier New', monospace;
        }

        .resource-name {
          color: var(--text);
          font-weight: 500;
        }

        .resource-type {
          color: var(--text-muted);
        }

        .resource-capacity {
          color: var(--text);
          font-weight: 600;
        }

        .resource-location {
          color: var(--text-muted);
        }

        .resource-status {
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .resources-header,
          .resource-row {
            grid-template-columns: 70px 1fr 100px 80px 120px 120px;
            padding: 14px 18px;
          }
        }

        @media (max-width: 768px) {
          .resources-header,
          .resource-row {
            grid-template-columns: 60px 1fr 80px 70px 100px 100px;
            padding: 12px 16px;
            gap: 8px;
          }

          .resource-cell {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}

export default Resources;