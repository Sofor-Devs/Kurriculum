import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Modal from './components/Modal';
import CurriculumGenerator from './models/CurriculumGenerator';
import CurriculumPage from './../src/pages/CurriculumPage/CurriculumPage';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "../src/components/ui/button";
import Sidebar from './components/navigate/Sidebar';
import './app.css';
import { CurriculumProvider } from './components/CurriculumContext/CurriculumContext';

function App() {
  return (
    <Router>
      <CurriculumProvider>
        <AppContent />
      </CurriculumProvider>
    </Router>
  );
}

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projects = useQuery(api.myFunctions.getCurriculum);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app">
      <Sidebar />
      <main className="container max-w-2xl flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold mt-8 text-center">
          Curriculum Generator
        </h1>

        <Button onClick={openModal}>Open Curriculum Generator</Button>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <CurriculumGenerator closeModal={closeModal} />
        </Modal>
        <footer className="text-center text-xs mb-5 mt-10 w-full">
          {/* Footer content */}
        </footer>
      </main>

      <Routes>
        <Route path="/curriculum" element={<CurriculumPage />} />
      </Routes>
    </div>
  );
}

export default App;
