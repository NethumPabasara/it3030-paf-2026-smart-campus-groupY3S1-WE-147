function Dashboard() {
  return (
    <>
      <h1 className="heading-1">Dashboard</h1>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="card-title">Total Bookings</h3>
          <p className="card-value">12</p>
          <p className="text-muted">Active bookings this month</p>
        </div>

        <div className="card">
          <h3 className="card-title">Resources</h3>
          <p className="card-value">8</p>
          <p className="text-muted">Available resources</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;