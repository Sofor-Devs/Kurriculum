import React, { useState } from "react";
import Modal from "./components/Modal";
import CurriculumGenerator from "./models/CurriculumGenerator";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "../src/components/ui/button";
import Sidebar from "./components/navigate/Sidebar"; // Import Sidebar component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RotatingNav from "../src/components/navigate/RotatingNav";
import Home from "./pages/Home/home";
import About from "./pages/About/about";
import Contact from "./pages/Contact/contact";
import Curriculum from "./pages/Curriculum/curriculum";


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ideas = useQuery(api.myFunctions.listIdeas);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="container max-w-2xl flex flex-col gap-8">
          <Routes>
            <Route path="home" element={<Home />} />
            <Route path="contact" element={<Contact />} />
            {/* <Route path="about" element={<About />} /> */}
            <Route path="curriculum" element={<Curriculum />} />
            <Route
              path="/"
              element={
                <>
                  <h1 className="text-3xl font-extrabold mt-8 text-center">
                    Curriculum Generator
                  </h1>

                  <Button onClick={openModal}>
                      Open Curriculum Generator
                  </Button>

                  <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <CurriculumGenerator closeModal={closeModal} />
                  </Modal>

                  <ul>
                    {ideas?.map((document, i) => (
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

export default App;
