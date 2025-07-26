import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ItemPage from "./pages/ItemsPage";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ChooseOtherUsername from "./pages/ChooseOtherUsername.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><ItemPage /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chooseotherusername" element={<ChooseOtherUsername />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
};

export default App;
