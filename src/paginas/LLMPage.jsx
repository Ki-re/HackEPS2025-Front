import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./LLMPage.css";

const LLMPage = () => {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `Hola ${user?.username || 'usuari'}, soy el asistente LLM. Pregúntame lo que quieras sobre tus instancias y clusters.`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: value,
    };

    const processingId = Date.now() + 1;
    const processingMessage = {
      id: processingId,
      role: "assistant",
      text: "🤖 Procesando tu consulta... esto puede tardar unos minutos.",
    };

    setMessages((prev) => [...prev, userMessage, processingMessage]);
    setInput("");

    try {
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo response based on user input
      const demoResponse = `🚀 Basándome en tu consulta "${value}", te sugiero:

• **Proveedor recomendado**: ${Math.random() > 0.5 ? 'AWS' : 'GCP'}
• **Instancias**: ${Math.floor(Math.random() * 3) + 2} nodos
• **Tipo**: ${['micro', 'small', 'medium'][Math.floor(Math.random() * 3)]}
• **Configuración**: Docker Swarm con auto-scaling

¿Te gustaría proceder con la creación automática del cluster? Puedes ir a "Crear Nuevo Cluster > Manual" para configurar los detalles.`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === processingId ? { ...m, text: demoResponse } : m
        )
      );
    } catch (err) {
      const errorText = `❌ Error: ${err?.message || "Error desconocido"}`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === processingId ? { ...m, text: errorText } : m
        )
      );
    }
  };

  return (
    <div className="llm-page">
      <div className="llm-page-inner">
        <Link to="/" className="back-link">
          &larr; Volver al panel
        </Link>

        <div className="llm-card">
          <div className="llm-header">
            <h2>Asistente LLM</h2>
            <p className="llm-subtitle">Pregúntame sobre clusters, instancias y configuraciones</p>
          </div>

          <div className="llm-chat">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "llm-message llm-message-user"
                    : "llm-message llm-message-assistant"
                }
              >
                <div className="llm-message-bubble">{m.text}</div>
              </div>
            ))}
          </div>

          <form className="llm-input-row" onSubmit={handleSubmit}>
            <input
              className="llm-input"
              type="text"
              placeholder="Ejemplo: 'Necesito un cluster para una web con alta disponibilidad'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="llm-send-button" type="submit">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LLMPage;
