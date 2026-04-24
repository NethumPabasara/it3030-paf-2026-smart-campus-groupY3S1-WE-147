import { useEffect, useState } from "react";
import '../styles/theme.css';

function CreateBooking() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/resources");
        const data = await response.json();
        
        // Handle both wrapped and direct array responses
        const resourcesData = data.data || data;
        setResources(resourcesData);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Get current user from localStorage
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const username = savedUser?.username;

      console.log("Creating booking for:", username);

      const response = await fetch("http://localhost:8080/api/bookings", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resource: {
  id: parseInt(formData.resourceId)
},
bookedBy: username,
          startTime: formData.startTime + ":00",
          endTime: formData.endTime + ":00",
          purpose: formData.purpose
        })
      });

      if (response.ok) {
        setMessage('Booking created successfully');
        setFormData({
          resourceId: '',
          startTime: '',
          endTime: '',
          purpose: ''
        });
      } else {
        const errorData = await response.text();   // 👈 ADD THIS
        console.log("Backend error:", errorData); 
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setMessage('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = formData.resourceId && formData.startTime && formData.endTime && formData.purpose;

  return (
    <>
      <h1 className="heading-1">Create Booking</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="booking-form">
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="resourceId" className="form-label">Resource</label>
            <select
              id="resourceId"
              name="resourceId"
              value={formData.resourceId}
              onChange={handleInputChange}
              className="form-select"
              disabled={loading}
              required
            >
              <option value="">Select a resource</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name || resource.type} - {resource.type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startTime" className="form-label">Start Time</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime" className="form-label">End Time</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose" className="form-label">Purpose</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="Enter the purpose of this booking..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isFormValid || submitting}
          >
            {submitting ? 'Creating...' : 'Create Booking'}
          </button>
        </form>
      </div>

      <style>{`
        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-weight: 600;
          color: var(--text);
          font-size: 0.95rem;
        }

        .form-select,
        .form-input,
        .form-textarea {
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          background-color: var(--card-bg);
          color: var(--text);
          font-size: 0.95rem;
          transition: var(--transition);
        }

        .form-select:focus,
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .form-textarea {
          resize: vertical;
          font-family: inherit;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: var(--border-radius);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 12px rgba(124, 58, 237, 0.2);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .message {
          padding: 12px 16px;
          border-radius: var(--border-radius);
          font-weight: 500;
          margin-bottom: 20px;
        }

        .message.success {
          background-color: rgba(34, 197, 94, 0.1);
          border: 1px solid #22C55E;
          color: #22C55E;
        }

        .message.error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid #EF4444;
          color: #EF4444;
        }

        @media (max-width: 768px) {
          .form-select,
          .form-input,
          .form-textarea {
            padding: 10px 14px;
            font-size: 0.9rem;
          }

          .btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}

export default CreateBooking;
