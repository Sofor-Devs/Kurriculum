import React from "react";
import logo from "../../assets/images/logo.png"; // Import the image using import

import "./index.css";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is your home page content.</p>
      <img alt="logo" style={{ width: 100 }} src={logo} /> Use the imported
      variable directly
    </div>
  );
};

export default Home;
