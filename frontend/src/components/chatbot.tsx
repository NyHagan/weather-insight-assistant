
import OpenAI from "openai"

import { useState } from "react"

const Chatbot = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  // initialize Openai client
  const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})
console.log("OpenAI Key:", import.meta.env.VITE_OPENAI_API_KEY)

  // triggered when user presses send  
  const handleSend = async () => {
  if (!input.trim()) return

  const userMessage = `🧑: ${input}`
  setMessages(prev => [...prev, userMessage])
  setInput("")

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        { role: "system", content: "You are a helpful weather assistant." },
        { role: "user", content: input }
      ]
    })

    const reply = response.choices[0].message.content
    setMessages(prev => [...prev, `🤖: ${reply}`])
  } catch (err: any) {
  console.error("🔍 OpenAI error details:", err?.response || err?.message || err)
  setMessages(prev => [...prev, "🤖: Something went wrong trying to respond."])
}

}


  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      width: "100%",
      gap: "0.75rem",
      height: "100%",
    }}>
      <div style={{
        flexGrow: 1,
        overflowY: "auto",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        padding: "0.75rem",
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

      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="talk to weatherbot"
        style={{
          flexShrink: 0,
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
        Send
      </button>
    </div>
  )
}

export default Chatbot
