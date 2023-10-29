// import React from 'react';
// import { Link } from 'react-router-dom'; // If you're using react-router for navigation
// import './index.css'; // Import your CSS file for styling

// const Sidebar: React.FC = () => {
//   return (
//     <div className="sidebar">
//       <h2>Sidebar</h2>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/about">About</Link></li>
//         <li><Link to="/contact">Contact</Link></li>
//         {/* Add more navigation links as needed */}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;

import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import RotatingNav from './RotatingNav'; // Import the new RotatingNav component

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      {/* <h2>Sidebar</h2> */}
      <ul>
        <RotatingNav />
        {/* <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li> */}
        {/* Add more navigation links as needed */}
      </ul>
      {/* Include the RotatingNav component */}
      
    </div>
  );
}

export default Sidebar;

