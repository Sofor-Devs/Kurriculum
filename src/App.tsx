import React, { useState } from 'react';
import Modal from './components/Modal';
import CurriculumGenerator from './models/CurriculumGenerator';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import './app.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ideas = useQuery(api.myFunctions.listIdeas);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
