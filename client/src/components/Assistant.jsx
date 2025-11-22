import { useState, useEffect, useRef } from "react";
import { FiFileText, FiSend, FiUploadCloud, FiUser, FiCpu } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

const API_BASE = "https://rossai.onrender.com";

function Assistant({ sources, setSources, responses, setResponses }) {
  const [query, setQuery] = useState("");
  const [loadingAsk, setLoadingAsk] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [task, setTask] = useState("qa");
  const [prompts, setPrompts] = useState({ shared: {}, private: {} });
  const [promptKey, setPromptKey] = useState("qa_default");
  const [customPrompt, setCustomPrompt] = useState("");
  const [model, setModel] = useState("SukhdevTechsteck/US-Law-v3");

  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/prompts`)
      .then((r) => r.json())
      .then(setPrompts)
      .catch(() => { });

    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    };

    const handleDragOver = (e) => e.preventDefault();

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    // ✅ Keyboard Shortcuts Handler
    // ✅ Keyboard Shortcuts Handler (Functional only)
    const handleKeyDown = (e) => {
      // Open new chat → clear responses (Alt+Shift+N)
      if (e.altKey && e.shiftKey && e.code === "KeyN") {
        e.preventDefault();
        setResponses([]);
      }

      // Open upload module → click file input (Alt+Shift+U)
      if (e.altKey && e.shiftKey && e.code === "KeyU") {
        e.preventDefault();
        fileInputRef.current?.click();
      }

      // Edit last message (Alt+E)
      if (e.altKey && !e.shiftKey && e.code === "KeyE") {
        e.preventDefault();
        const last = [...responses].reverse().find((r) => r.question);
        if (last) {
          setQuery(last.question);
          setResponses((prev) => prev.filter((r) => r.id !== last.id));
        }
      }

      // Focus chat input (Shift+Escape)
      if (!e.altKey && e.shiftKey && e.code === "Escape") {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Copy last response to clipboard (Alt+Shift+C)
      if (e.altKey && e.shiftKey && e.code === "KeyC") {
        e.preventDefault();
        const last = [...responses].reverse().find((r) => r.fullText);
        if (last) {
          navigator.clipboard.writeText(last.fullText || last.text);
          alert("Last response copied!");
        }
      }

      // Delete all chats (Alt+Shift+D)
      if (e.altKey && e.shiftKey && e.code === "KeyD") {
        e.preventDefault();
        setResponses([]);
      }
    };


    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [responses]);

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    setSources((prev) => [
      ...prev,
      ...Array.from(files).map((f) => ({ id: Date.now() + f.name, name: f.name })),
    ]);

    try {
      setLoadingUpload(true);
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      await res.json();
    } catch {
      setResponses((prev) => [
        ...prev,
        { id: Date.now(), text: "⚠️ Error uploading file(s)." },
      ]);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleUpload = (event) => {
    uploadFiles(event.target.files);
    event.target.value = "";
  };

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoadingAsk(true);

    try {
      const payload = {
        question: query,
        task,
        top_k: 6,
        model,
        promptKey: customPrompt.trim() ? null : promptKey,
        customPrompt: customPrompt.trim() || null,
      };

      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const responseText = data.answer || "⚠️ No response";
      const citations = data.sources || [];

      const newId = Date.now();
      setResponses((prev) => [
        ...prev,
        { id: newId, text: "", fullText: responseText, question: query, citations },
      ]);
      setQuery("");

      let i = 0;
      const interval = setInterval(() => {
        setResponses((prev) =>
          prev.map((r) =>
            r.id === newId ? { ...r, text: r.fullText.slice(0, i + 1) } : r
          )
        );
        i++;
        if (i >= responseText.length) clearInterval(interval);
      }, 18);
    } catch {
      setResponses((prev) => [
        ...prev,
        { id: Date.now(), text: "⚠️ Error fetching response." },
      ]);
    } finally {
      setLoadingAsk(false);
    }
  };

  const promptOptions = Object.keys(prompts.shared || {});

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Controls */}
      <div className="border-b bg-white shadow-sm px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          >
            <option value="qa">Answer Questions</option>
            <option value="summarize">Summarize</option>
            <option value="identify_risks">Identify Risks</option>
            <option value="draft_email">Draft Email</option>
          </select>

          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="SukhdevTechsteck/US-Law-v3">US Law v3</option>
          </select>

          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={promptKey}
            onChange={(e) => setPromptKey(e.target.value)}
            disabled={!!customPrompt.trim()}
          >
            {promptOptions.length === 0 ? (
              <option value="">No prompts</option>
            ) : (
              promptOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))
            )}
          </select>

          <input
            className="px-3 py-2 border rounded-lg text-sm"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Custom prompt..."
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {responses.map((res) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {res.question && (
              <div className="flex justify-end">
                <div className="flex items-start space-x-2 max-w-xl">
                  <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md">
                    <p className="text-sm">{res.question}</p>
                  </div>
                  <FiUser className="text-gray-400 mt-1" />
                </div>
              </div>
            )}

            <div className="flex items-start space-x-2 max-w-2xl">
              <FiCpu className="text-blue-500 mt-1" />
              <div className="p-4 bg-white border rounded-2xl shadow-md text-gray-800 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {res.text.replace(/Refer:/g, "\n\n**Refer:**")}
                </ReactMarkdown>
              </div>
            </div>

            {res.citations && res.citations.length > 0 && (
              <div className="ml-7 p-3 bg-gray-100 border rounded-lg text-xs">
                {/* <p className="font-medium mb-1">Sources:</p> */}
                {/* <ul className="space-y-1">
                  {res.citations.map((c, i) => (
                    <li key={i}>
                      <span className="font-mono">{c.source}</span>
                      {c.page ? `, p.${c.page}` : ""}
                    </li>
                  ))}
                </ul> */}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
            placeholder="Ask your question..."
          />
          <label
            htmlFor="fileInput"
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer"
            title="Upload files"
          >
            <FiUploadCloud className="text-xl text-blue-500" />
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.zip"
            onChange={handleUpload}
            disabled={loadingUpload}
            id="fileInput"
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={handleAsk}
            disabled={loadingAsk}
            className="ml-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <FiSend className="mr-2" />
            {loadingAsk ? "Thinking…" : "Ross Ai"}
          </button>
        </div>

        {loadingUpload && (
          <p className="mt-2 text-sm text-gray-500 text-center">Uploading…</p>
        )}

        {sources.length > 0 && (
          <div className="mt-3 max-w-3xl mx-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
            <div className="flex flex-wrap gap-2">
              {sources.map((file) => (
                <span
                  key={file.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200"
                >
                  <FiFileText className="mr-1" /> {file.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assistant;
