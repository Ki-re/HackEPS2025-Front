import { useState } from "react";
import { Link } from "react-router-dom";
import "./LLMPage.css";

const LLMPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hola, soy el asistente LLM. Pregúntame lo que quieras sobre tus instancias.",
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
      text: "Procesando... esto puede tardar unos minutos.",
    };

    setMessages((prev) => [...prev, userMessage, processingMessage]);
    setInput("");

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

      let responseText;

      if (!response.ok) {
        responseText = `Error del servidor (${response.status}).`;
      } else {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          if (typeof data === "string") {
            responseText = data;
          } else if (data.message) {
            responseText = data.message;
          } else {
            responseText = JSON.stringify(data, null, 2);
          }
        } else {
          responseText = await response.text();
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === processingId ? { ...m, text: responseText } : m
        )
      );
    } catch (err) {
      const errorText =
        "Ha ocurrido un error al conectar con el servidor LLM: " +
        (err?.message || "Error desconocido");

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
            <p className="llm-subtitle">Pregúntame lo que quieras</p>
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
              placeholder="Escribe aquí tu pregunta..."
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
