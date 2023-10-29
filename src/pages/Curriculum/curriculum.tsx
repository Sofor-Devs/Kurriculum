import React, { useState } from "react";
import Modal from "../../components/Modal";
import CurriculumGenerator from "../../models/CurriculumGenerator";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../../src/components/ui/button";
import Sidebar from "../../components/navigate/Sidebar"; // Import Sidebar component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "../Home/home";
import RotatingNav from "../../../src/components/navigate/RotatingNav";
import Home from "../Home/home";

function Curriculum() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projects = useQuery(api.myFunctions.getCurriculum);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <div className="Curriculum">
        <Sidebar />
        <main className="container max-w-2xl flex flex-col gap-8">
          <Routes>
            <Route path="Home" element={<Home />} />

            <Route
              path="/"
              element={
                <>
                  <h1 className="text-3xl font-extrabold mt-8 text-center">
                    Curriculum Generator
                  </h1>

                  <Button onClick={openModal}>Open Curriculum Generator</Button>

                  <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <CurriculumGenerator closeModal={closeModal} />
                  </Modal>

                  <ul>
                    {projects?.map((document, i) => (
                      <li key={i}>{document.description}</li>
                    ))}
                  </ul>
                </>
              }
            />
          </Routes>

          <footer className="text-center text-xs mb-5 mt-10 w-full">
            {/* Footer content */}
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default Curriculum;
