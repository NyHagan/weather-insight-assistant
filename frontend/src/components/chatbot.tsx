import OpenAI from "openai"
import { useState, useEffect } from "react"

const Chatbot = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  // initialize openai client
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })
  console.log("openai key:", import.meta.env.VITE_OPENAI_API_KEY)

  // triggered when user presses send
  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = `🧑: ${input}`
    setMessages(prev => [...prev, userMessage])
    setInput("")

    try {
      // fetch raw weather data from fastapi container
      const res = await fetch("https://weather-insight-api.ambitiouswater-95212a1a.westus2.azurecontainerapps.io/weather")
      const { data } = await res.json()

      // pass user input + full weather json to gpt
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `you are weatherbot, a friendly assistant. the user may ask you anything. when helpful, base your answer on the data below. only use it if you are asked about weather and try to choose random data within it to answer, not just the first thing you find in the data:\n\n${JSON.stringify(data)}`
          },
          { role: "user", content: input }
        ]
      })

      const reply = response.choices[0].message.content
      setMessages(prev => [...prev, `🤖: ${reply}`])
    } catch (err: any) {
      console.error("🔍 openai error details:", err?.response || err?.message || err)
      setMessages(prev => [...prev, "🤖: something went wrong trying to respond."])
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      maxHeight: "100%",
      overflow: "hidden"
    }}>
      {/* scrollable chat thread */}
      <div style={{
        flex: "1 1 0%",
        minHeight: 0,
        overflowY: "auto",
        padding: "0.75rem",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column"
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.startsWith("🧑") ? "flex-end" : "flex-start",
              background: msg.startsWith("🧑")
                ? "rgba(46, 185, 206, 0.46)"
                : "rgba(0, 0, 0, 0.25)",
              color: "#fff",
              padding: "0.6rem 1rem",
              borderRadius: "16px",
              maxWidth: "75%",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              marginBottom: "0.5rem",
              fontSize: "0.95rem",
              wordBreak: "break-word"
            }}
          >
            {msg}
          </div>
        ))}
      </div>

      {/* fixed input area */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        paddingTop: "0.75rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        backgroundColor: "rgba(255, 255, 255, 0.02)"
      }}>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="talk to weatherbot"
          style={{
            width: "100%",
            boxSizing: "border-box",
            resize: "none",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        />
        <button onClick={handleSend} style={{
          alignSelf: "flex-end",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#4a90e2",
          color: "#fff",
          cursor: "pointer"
        }}>
          send
        </button>
      </div>
    </div>
  )
}

export default Chatbot