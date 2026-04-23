import { useState } from 'react';
import Sidebar from "../components/Sidebar";


function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar />
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;