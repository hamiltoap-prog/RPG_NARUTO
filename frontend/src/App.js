import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import Dashboard from "@/components/Dashboard";
import Wizard from "@/components/Wizard";
import CharacterView from "@/components/CharacterView";
import SharedCharacter from "@/components/SharedCharacter";
import AdvancedEdit from "@/components/AdvancedEdit";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<Wizard />} />
          <Route path="/character/:id" element={<CharacterView />} />
          <Route path="/share/:shareId" element={<SharedCharacter />} />
          <Route path="/edit/:id" element={<AdvancedEdit />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
