import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{
        flex: 1,
        padding: "30px",
        background: "#0B132B",
        minHeight: "100vh"
      }}>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;