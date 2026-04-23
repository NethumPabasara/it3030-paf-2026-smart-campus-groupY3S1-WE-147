import { useState } from 'react';


function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = ['Dashboard', 'Bookings', 'Resources', 'Users'];

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">SmartCampus</h2>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item}
            className={`sidebar-menu-item ${activeItem === item ? 'active' : ''}`}
            onClick={() => setActiveItem(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;