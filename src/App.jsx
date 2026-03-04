import { useRef, useState } from "react"

export default function App() {
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState("idle") // idle | reading | done | error
  const [msg, setMsg] = useState("")
  const [fileInfo, setFileInfo] = useState(null)

  function openPicker() {
    fileInputRef.current?.click()
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset
    setStatus("idle")
    setMsg("")
    setFileInfo(null)

    // Validate PDF
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      setStatus("error")
      setMsg("Por favor, selecione um arquivo PDF.")
      return
    }

    setStatus("reading")
    setMsg("Analisando PDF...")

    try {
      // Só para confirmar que o browser está lendo o arquivo:
      const arrayBuffer = await file.arrayBuffer()

      setFileInfo({
        name: file.name,
        sizeKB: Math.round(file.size / 1024),
        bytesRead: arrayBuffer.byteLength,
      })

      setStatus("done")
      setMsg("PDF carregado com sucesso ✅ (pronto para processar)")
    } catch (err) {
      console.error(err)
      setStatus("error")
      setMsg("Não consegui ler o PDF. Tente novamente.")
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "Arial", maxWidth: 720 }}>
      <h1>Folha Ponto</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={openPicker} style={{ padding: "10px 14px", cursor: "pointer" }}>
          Selecionar PDF
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        {status === "reading" && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                width: 16,
                height: 16,
                border: "3px solid #ddd",
                borderTop: "3px solid #333",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <strong>{msg}</strong>
          </div>
        )}

        {status !== "reading" && msg && <strong>{msg}</strong>}

        {fileInfo && (
          <div style={{ marginTop: 10, padding: 12, border: "1px solid #eee" }}>
            <div><b>Arquivo:</b> {fileInfo.name}</div>
            <div><b>Tamanho:</b> {fileInfo.sizeKB} KB</div>
            <div><b>Lido:</b> {fileInfo.bytesRead} bytes</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  )
}