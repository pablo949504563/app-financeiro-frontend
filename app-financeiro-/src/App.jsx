import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Transacoes from "./pages/Transacoes";

import PortfolioApp from "./components/PortfolioApp";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <PortfolioApp />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/legacy" element={<PortfolioApp />} /> 
      </Routes>
    </BrowserRouter>
  );
}
