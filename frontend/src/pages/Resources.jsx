import { useEffect, useState } from "react";
import '../styles/theme.css';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const userRole = user?.role || null;

  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'LAB',
    capacity: '',
    location: '',
    status: 'ACTIVE'
  });

  const fetchResources = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/resources", { credentials: "include" });
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

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchResources();
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: name === "capacity" ? parseInt(value) : value
  }));
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const method = editingResource ? "PUT" : "POST";
  const url = editingResource
    ? `http://localhost:8080/api/resources/${editingResource.id}`
    : "http://localhost:8080/api/resources";

  try {
    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const err = await response.text();
      console.log("Backend error:", err);
      alert("Failed to save resource");
      return;
    }

    alert("Resource saved successfully ✅");

    setShowForm(false);
    setEditingResource(null);
    fetchResources();

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
};

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData(resource);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
  await fetch(`http://localhost:8080/api/resources/${id}`, {
    method: "DELETE",
    credentials: "include" // ⭐ MUST ADD
  });
  fetchResources();
};

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

      {userRole === "ADMIN" && (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingResource(null);
            } else {
              setEditingResource(null);
              setFormData({
                name: '',
                type: 'LAB',
                capacity: '',
                location: '',
                status: 'ACTIVE'
              });
              setShowForm(true);
            }
          }}>
            {showForm ? 'Cancel' : '+ Add Resource'}
          </button>
        </div>
      )}

      {userRole === "ADMIN" && showForm && (
        <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
          <h2 style={{ marginBottom: '15px' }}>{editingResource ? 'Edit Resource' : 'Add New Resource'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
            <input 
              name="name" 
              placeholder="Name" 
              value={formData.name || ''} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
            
            <select 
              name="type" 
              value={formData.type || 'LAB'} 
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
            >
              <option value="LAB">LAB</option>
              <option value="LECTURE_HALL">LECTURE HALL</option>
              <option value="MEETING_ROOM">MEETING ROOM</option>
              <option value="EQUIPMENT">EQUIPMENT</option>
            </select>

            <input 
              name="capacity" 
              type="number" 
              placeholder="Capacity"
              value={formData.capacity || ''} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
            
            <input 
              name="location" 
              placeholder="Location"
              value={formData.location || ''} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
            />

            <select 
              name="status" 
              value={formData.status || 'ACTIVE'} 
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {editingResource ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

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
            <div className={`resources-header ${userRole === 'ADMIN' ? 'admin-grid' : ''}`}>
              <div className="header-cell">ID</div>
              <div className="header-cell">Name</div>
              <div className="header-cell">Type</div>
              <div className="header-cell">Capacity</div>
              <div className="header-cell">Location</div>
              <div className="header-cell">Status</div>
              {userRole === "ADMIN" && <div className="header-cell">Actions</div>}
            </div>
            <div className="resources-list">
              {resources.map((r) => (
                <div key={r.id} className={`resource-row ${userRole === 'ADMIN' ? 'admin-grid' : ''}`}>
                  <div className="resource-cell resource-id">#{r.id}</div>
                  <div className="resource-cell resource-name">{r.name || r.type || '-'}</div>
                  <div className="resource-cell resource-type">{r.type}</div>
                  <div className="resource-cell resource-capacity">{r.capacity || '-'}</div>
                  <div className="resource-cell resource-location">{r.location || '-'}</div>
                  <div className="resource-cell resource-status">
                    {getStatusBadge(r.status)}
                  </div>
                  {userRole === "ADMIN" && (
                    <div className="resource-cell resource-actions" style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(r)} style={{ padding: '4px 8px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                      <button onClick={() => handleDelete(r.id)} style={{ padding: '4px 8px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
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

        .resources-header.admin-grid {
          grid-template-columns: 80px 1fr 120px 100px 150px 120px 120px;
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

        .resource-row.admin-grid {
          grid-template-columns: 80px 1fr 120px 100px 150px 120px 120px;
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

          .resources-header.admin-grid,
          .resource-row.admin-grid {
            grid-template-columns: 70px 1fr 100px 80px 120px 100px 100px;
          }
        }

        @media (max-width: 768px) {
          .resources-header,
          .resource-row {
            grid-template-columns: 60px 1fr 80px 70px 100px 100px;
            padding: 12px 16px;
            gap: 8px;
          }

          .resources-header.admin-grid,
          .resource-row.admin-grid {
            grid-template-columns: 60px 1fr 80px 70px 100px 80px 80px;
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