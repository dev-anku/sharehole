import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import ItemPage from "./pages/ItemsPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ItemPage />} />
        <Route path="/test" element={<HomePage />} />
      </Routes>
    </Router>
  )
};

export default App;
