import React from "react";
// import logo from "../../assets/images/logo.png"; // Import the image using import

import "./index.css";

const Home = () => {
  return (
    <div>
      <h1>Kurriculum</h1>
      <h2>Hear from Kurriculum's Creators</h2>
      <p><b>-Soroush:</b> I came up with this idea to generate a curriculum for Project based classes that I teavh at Coding Minds. This would really help be on track and get access to a well-organized fetched curriculum </p>
      <br/>
      <p><b>-Fozhan:</b> As a K-12 newbie teacher, I have no idea how to plan out a semester long for each one of my student individually. Our Web App would help everyone to come up with plans without having to open hundreds of tabs on their browsers! </p>
      {/* <img alt="logo" style={{ width: 200 }} src={logo} /> */}
    </div>
  );
};

export default Home;
