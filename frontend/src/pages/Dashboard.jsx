import { useState, useEffect } from "react";

function Dashboard() {
  const [bookingsCount, setBookingsCount] = useState(null);
  const [resourcesCount, setResourcesCount] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bookings');
        const data = await response.json();
        setBookingsCount(data.length);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/resources');
        const data = await response.json();
        setResourcesCount(data.data.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
    fetchResources();
  }, []);

  return (
    <>
      <h1 className="heading-1">Dashboard</h1>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="card-title">Total Bookings</h3>
          <p className="card-value">
            {bookingsCount !== null ? bookingsCount : "..."}
          </p>
          <p className="text-muted">Active bookings this month</p>
        </div>

        <div className="card">
          <h3 className="card-title">Resources</h3>
          <p className="card-value">
            {resourcesCount !== null ? resourcesCount : "..."}
          </p>
          <p className="text-muted">Available resources</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;