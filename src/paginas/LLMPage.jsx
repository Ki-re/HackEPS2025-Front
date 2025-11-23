import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
import "./LLMPage.css";

const LLMPage = () => {
  // Recuperamos el usuario o usamos un placeholder para evitar errores
  // const { user } = useAuth();
  const user = { username: "Usuario" }; // Placeholder seguro

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `Hola ${user?.username || 'viajero'}, soy el asistente LLM. Describe qué infraestructura necesitas y la crearé por ti.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Referencia para el auto-scroll
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value || loading) return;

    // 1. Añadir mensaje del usuario
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: value,
    };

    // 2. Añadir mensaje temporal de "pensando"
    const processingId = Date.now() + 1;
    const processingMessage = {
      id: processingId,
      role: "assistant",
      text: "🤖 Analizando tu solicitud y provisionando recursos... (Esto puede tardar 1-2 minutos)",
    };

    setMessages((prev) => [...prev, userMessage, processingMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/instances/auto-cluster",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: value }),
        }
      );

      const data = await response.json();

      let responseText;
      if (!response.ok) {
        // Intentamos leer el detalle del error del backend
        responseText = `❌ Error: ${data.detail || `Código ${response.status}`}`;
      } else {
        // Formateamos el mensaje de éxito
        const clusterName = data.cluster?.name || "Cluster";
        responseText = `✅ ¡Hecho! ${data.message}. He creado el clúster "${clusterName}" y desplegado los servicios solicitados.`;
      }

      // 3. Actualizar el mensaje del asistente con la respuesta real
      setMessages((prev) =>
        prev.map((m) =>
          m.id === processingId ? { ...m, text: responseText } : m
        )
      );

    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === processingId ? { ...m, text: `❌ Error de conexión: ${err.message}` } : m
        )
      );
    } finally {
      setLoading(false);
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
            <h2>🧠 Arquitecto IA</h2>
            <p className="llm-subtitle">
              Describe tu infraestructura ideal y deja que la IA la construya.
            </p>
          </div>

          <div className="llm-chat">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`llm-message ${
                  m.role === "user" ? "llm-message-user" : "llm-message-assistant"
                }`}
              >
                <div className="llm-message-bubble">
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="llm-input-row" onSubmit={handleSubmit}>
            <input
              className="llm-input"
              type="text"
              placeholder="Ej: 'Quiero un cluster en AWS con 2 workers para desplegar un Nginx'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              className="llm-send-button" 
              type="submit" 
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LLMPage;