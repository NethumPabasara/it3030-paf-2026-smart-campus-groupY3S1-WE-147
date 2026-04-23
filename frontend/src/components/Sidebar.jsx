function Sidebar() {
  return (
    <div style={{
      width: "220px",
      background: "linear-gradient(180deg, #7C3AED, #4F46E5)",
      color: "white",
      minHeight: "100vh",
      padding: "25px 20px"
    }}>
      <h2 style={{ marginBottom: "30px" }}>SmartCampus</h2>

      <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.5" }}>
        <li>Dashboard</li>
        <li>Bookings</li>
        <li>Resources</li>
        <li>Users</li>
      </ul>
    </div>
  );
}

export default Sidebar;