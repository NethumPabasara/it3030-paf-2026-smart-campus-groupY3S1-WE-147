import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <MainLayout>
      <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{
          background: "#1E293B",
          padding: "20px",
          borderRadius: "10px",
          width: "200px"
        }}>
          <h3>Total Bookings</h3>
          <p>12</p>
        </div>

        <div style={{
          background: "#1E293B",
          padding: "20px",
          borderRadius: "10px",
          width: "200px"
        }}>
          <h3>Resources</h3>
          <p>8</p>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;