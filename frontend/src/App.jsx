import { useState, useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import './styles/theme.css';

function App() {
  const [bookingsCount, setBookingsCount] = useState(null);
  const [resourcesCount, setResourcesCount] = useState(null);

  useEffect(() => {
    // Fetch bookings data
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookingsCount(data.length);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    // Fetch resources data
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/resources');
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();
        setResourcesCount(data.data.length);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    // Fetch both data on component mount
    fetchBookings();
    fetchResources();
  }, []);

  return (
    <MainLayout>
      <h1 className="heading-1">Dashboard</h1>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="card-title">Total Bookings</h3>
          <p className="card-value">{bookingsCount !== null ? bookingsCount : '...'}</p>
          <p className="text-muted">Active bookings this month</p>
        </div>

        <div className="card">
          <h3 className="card-title">Resources</h3>
          <p className="card-value">{resourcesCount !== null ? resourcesCount : '...'}</p>
          <p className="text-muted">Available resources</p>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;