// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import CreateCluster from "./components/CreateCluster";
import Dashboard from "./paginas/Dashboard";
import DetailPage from "./paginas/DetailPage";
import LLMPage from "./paginas/LLMPage";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/detalle/:mode/:provider" element={
            <ProtectedRoute>
              <DetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/detalle/:mode/:provider/:status" element={
            <ProtectedRoute>
              <DetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/crear/llm" element={
            <ProtectedRoute>
              <LLMPage />
            </ProtectedRoute>
          } />
          
          <Route path="/crear/manual" element={
            <ProtectedRoute>
              <CreateCluster />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
