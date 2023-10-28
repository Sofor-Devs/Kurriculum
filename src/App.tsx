import React, { useState } from 'react';
import Modal from './components/Modal';  // Assuming you have this component created
import CurriculumGenerator from './models/CurriculumGenerator';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "../src/components/ui/button";


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ideas = useQuery(api.myFunctions.listIdeas);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="container max-w-2xl flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold mt-8 text-center">
      Kurriculum
      </h1>

      <Button onClick={openModal}>Open Curriculum Generator</Button>

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
      
      <footer className="text-center text-xs mb-5 mt-10 w-full">
        {/* Footer content */}
      </footer>
    </main>
  );
}

export default App;