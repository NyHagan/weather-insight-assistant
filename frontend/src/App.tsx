import Chatbot from "./components/chatbot"

function App() {
  return (
    <div style={{
  width: "90%",
  maxWidth: "700px",
  height: "600px",
  borderRadius: "20px",
  padding: "1.5rem",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column"
}}>

      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Hi! I'm WeatherBot
      </h1>
      <Chatbot />
    </div>
  )
}

export default App
