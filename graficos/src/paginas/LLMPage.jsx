import { useState } from "react";
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

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let response;
    try {
      response = await fetch(
        "http://localhost:8000/api/v1/instances/auto-cluster",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: value }),
        }
      );
    } catch (err) {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          "No se ha podido conectar con el servidor LLM: " +
          (err?.message || "Error de red"),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      return;
    }

    try {
      const contentType = response.headers.get("content-type") || "";
      let raw = "";

      if (contentType.includes("application/json")) {
        raw = await response.text();
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          const assistantMessage = {
            id: Date.now() + 2,
            role: "assistant",
            text:
              "El servidor ha respondido pero el formato no es JSON válido:\n" +
              raw,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          return;
        }

        let responseText;
        if (!response.ok) {
          responseText =
            data.message ||
            `Error del servidor (${response.status}): ${JSON.stringify(
              data
            )}`;
        } else {
          if (typeof data === "string") {
            responseText = data;
          } else if (data.message) {
            responseText = data.message;
          } else {
            responseText = JSON.stringify(data, null, 2);
          }
        }

        const assistantMessage = {
          id: Date.now() + 3,
          role: "assistant",
          text: responseText,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const textBody = await response.text();
        const assistantMessage = {
          id: Date.now() + 4,
          role: "assistant",
          text:
            (response.ok
              ? "Respuesta del servidor:\n"
              : `Error del servidor (${response.status}):\n`) + textBody,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      const assistantMessage = {
        id: Date.now() + 5,
        role: "assistant",
        text:
          "Ha ocurrido un error procesando la respuesta del servidor LLM: " +
          (err?.message || "Error desconocido"),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  return (
    <div className="llm-page">
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
  );
};

export default LLMPage;
