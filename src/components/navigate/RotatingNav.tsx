
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import "../../pages/Home/home";

const RotatingNav: React.FC = () => {
  const [rotated, setRotated] = useState(false);

  const handleRotation = () => {
    setRotated(true);
  };
  return (
    <nav>
      <ul>
        <Link className="link" to="/home">
          <li className={rotated ? 'rotated' : ''}>
            <div className="home-icon">
              <div className="roof">
                <div className="roof-edge"></div>
              </div>
              <div className="front"></div>
            </div>
          </li>
        </Link>

        <Link className="link" to="/">
          <li className={rotated ? 'rotated' : ''}>
            <div className="main">
              <div className="horizontol"></div>
              <div className="vertical"></div>
            </div>
          </li>
        </Link>

        <Link className="link" to="/about">
          <li className={rotated ? 'rotated' : ''}>
            <div className="work-icon">
              <div className="paper"></div>
              <div className="lines"></div>
              <div className="lines"></div>
              <div className="lines"></div>
            </div>
          </li>
        </Link>

        <Link className="link" to="/contact">
          <li className={rotated ? 'rotated' : ''}>
            <div className="mail-icon">
              <div className="mail-base">
                <div className="mail-top"></div>
              </div>
            </div>
          </li>
        </Link>
    </ul>
    </nav>
  );
}

export default RotatingNav;
