import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Resources from "./pages/Resources";
import Users from "./pages/Users";
import CreateBooking from "./pages/CreateBooking";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/users" element={<Users />} />
        <Route path="/create-booking" element={<CreateBooking />} />
      </Routes>
    </MainLayout>
  );
}

export default App;