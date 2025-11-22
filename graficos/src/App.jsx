// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./paginas/Dashboard";
import DetailPage from "./paginas/DetailPage";
import LLMPage from "./paginas/LLMPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/detalle/:mode/:provider" element={<DetailPage />} />
        <Route path="/detalle/:mode/:provider/:status" element={<DetailPage />} />
        <Route path="/crear/llm" element={<LLMPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
