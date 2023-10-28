import React, { useState } from 'react';
import Modal from '../Modal';
import CurriculumGenerator from '../../models/CurriculumGenerator';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import './index.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Navigation = () => {
    return (
      <nav className="sidebar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Navigation;