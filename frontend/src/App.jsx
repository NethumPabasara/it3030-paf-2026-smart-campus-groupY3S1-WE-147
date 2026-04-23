import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Pages (we will create next)
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Resources from "./pages/Resources";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;