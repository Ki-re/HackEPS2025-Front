// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./paginas/Dashboard";
import DetailPage from "./paginas/DetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/detalle/:mode/:provider" element={<DetailPage />} />
        <Route path="/detalle/:mode/:provider/:status" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
