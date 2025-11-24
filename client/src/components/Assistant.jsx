import { useState, useEffect, useRef } from "react";
import { FiFileText, FiSend, FiUploadCloud, FiUser, FiCpu } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

function Assistant({ sources, setSources, responses, setResponses }) {
  const { API_BASE, getAuthHeaders, isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [loadingAsk, setLoadingAsk] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {

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
        const last = [...responses].reverse().find((r) => r.type === "user");
        if (last) {
          setQuery(last.text);
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
    
    if (!isAuthenticated) {
      setResponses((prev) => [
        ...prev,
        { id: Date.now(), text: "⚠️ Please login to upload files." },
      ]);
      return;
    }

    setSources((prev) => [
      ...prev,
      ...Array.from(files).map((f) => ({ id: Date.now() + f.name, name: f.name })),
    ]);

    // Upload files one by one (backend expects single file)
    for (const file of Array.from(files)) {
      if (file.type !== "application/pdf") {
        setResponses((prev) => [
          ...prev,
          { id: Date.now(), text: `⚠️ ${file.name} is not a PDF file. Only PDF files are supported.` },
        ]);
        continue;
      }

      try {
        setLoadingUpload(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Upload failed");
        }

        const data = await res.json();
        setResponses((prev) => [
          ...prev,
          { id: Date.now(), text: `✅ ${file.name} uploaded successfully! Document ID: ${data.doc_id}, Chunks: ${data.chunks}` },
        ]);
      } catch (err) {
        setResponses((prev) => [
          ...prev,
          { id: Date.now(), text: `⚠️ Error uploading ${file.name}: ${err.message}` },
        ]);
      } finally {
        setLoadingUpload(false);
      }
    }
  };

  const handleUpload = (event) => {
    uploadFiles(event.target.files);
    event.target.value = "";
  };

  const handleAsk = async () => {
    if (!query.trim()) return;

    if (!isAuthenticated) {
      setResponses((prev) => [
        ...prev,
        { id: Date.now(), text: "⚠️ Please login to chat with documents." },
      ]);
      return;
    }

    setLoadingAsk(true);

    const question = query;
    setQuery("");

    // Add user question to responses
    const userMessageId = Date.now();
    setResponses((prev) => [
      ...prev,
      { id: userMessageId, text: question, question: question, type: "user" },
    ]);

    try {
      const res = await fetch(
        `${API_BASE}/chat?query=${encodeURIComponent(question)}`,
        {
          method: "GET",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Chat failed");
      }

      const data = await res.json();
      const responseText = data.answer || "⚠️ No response";

      const newId = Date.now();
      setResponses((prev) => [
        ...prev,
        { id: newId, text: "", fullText: responseText, question: null },
      ]);

      // Typewriter effect
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
    } catch (err) {
      setResponses((prev) => [
        ...prev,
        { id: Date.now(), text: `⚠️ Error: ${err.message}` },
      ]);
    } finally {
      setLoadingAsk(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">

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
            {res.type === "user" && (
              <div className="flex justify-end">
                <div className="flex items-start space-x-2 max-w-xl">
                  <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md">
                    <p className="text-sm">{res.text}</p>
                  </div>
                  <FiUser className="text-gray-400 mt-1" />
                </div>
              </div>
            )}
            
            {res.type !== "user" && (

              <div className="flex items-start space-x-2 max-w-2xl">
                <FiCpu className="text-blue-500 mt-1" />
                <div className="p-4 bg-white border rounded-2xl shadow-md text-gray-800 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {res.text}
                  </ReactMarkdown>
                </div>
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
            accept=".pdf"
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
