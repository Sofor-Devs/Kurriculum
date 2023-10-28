import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Modal from './components/Modal';
import CurriculumGenerator from './models/CurriculumGenerator';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import './app.css';
import Navigation from './components/navigate/Navigate';
import Home from './pages/Home/home'; // Create Home, About, Services, and Contact components accordingly


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ideas = useQuery(api.myFunctions.listIdeas);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const Bar = () => {
    return (
      <Router>
        <div className="app">
          <Navigation />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home/>} />
              {/* <Route path="/about" Component={About} />
              <Route path="/services" Component={Services} />
              <Route path="/contact" Component={Contact} /> */}
            </Routes>
          </div>
        </div>
      </Router>
    );
  };
  return (
    <Router>
      <div>
        <switch>
          {/* Define a route for the home page */}
          <Route path="/"  Component={Home} />
          {/* Define other routes for additional pages here */}
        </switch>
      </div>
    </Router>
  );

  return (
    <div id="root">
      <h1>Curriculum Generator</h1>

      <button onClick={openModal}>Open Curriculum Generator</button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CurriculumGenerator closeModal={closeModal} />
      </Modal>

      <ul>
        {ideas?.map((document, i) => (
          <li key={i}>
            {document.description}
          </li>
        ))}
      </ul>
      
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default App;
