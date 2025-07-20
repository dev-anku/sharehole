import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ItemPage from "./pages/ItemsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ItemPage />} />
      </Routes>
    </Router>
  )
};

export default App;
