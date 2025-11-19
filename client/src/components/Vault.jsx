import { useEffect, useState, useRef } from "react";
import { FiFileText, FiTrash2, FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE = "https://rossai.onrender.com";
// const API_BASE="http://0.0.0.0:8000";
function Vault() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [query, setQuery] = useState("");
  const [asking, setAsking] = useState(false);
  const [model, setModel] = useState("gpt-4o-mini");

  const [conversations, setConversations] = useState({});

  const inputRef = useRef(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/files`);
      const data = await res.json();
      if (data.status === "success") setFiles(data.files);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteFile = async (filename) => {
    try {
      const res = await fetch(`${API_BASE}/api/files/${filename}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "success") {
        setFiles((prev) => prev.filter((f) => f !== filename));
        setConversations((prev) => {
          const newConvs = { ...prev };
          delete newConvs[filename];
          return newConvs;
        });
        if (selectedFile === filename) {
          setSelectedFile(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAsk = async () => {
    if (!selectedFile) {
      const id = Date.now();
      setConversations((prev) => ({
        ...prev,
        general: [...(prev.general || []), { id, text: "⚠️ Please select a file first!" }],
      }));
      return;
    }
    if (!query.trim()) return;

    setAsking(true);
    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          task: "qa",
          file: selectedFile,
          top_k: 6,
          model,
        }),
      });
      const data = await res.json();
      const responseText = data.answer || "⚠️ No response.";
      const sources = data.sources || [];

      const newId = Date.now();
      const newResponse = {
        id: newId,
        text: "",
        fullText: responseText,
        question: query,
        citations: sources,
      };

      setConversations((prev) => ({
        ...prev,
        [selectedFile]: [...(prev[selectedFile] || []), newResponse],
      }));
      setQuery("");

      let i = 0;
      const interval = setInterval(() => {
        setConversations((prev) => ({
          ...prev,
          [selectedFile]: prev[selectedFile].map((r) =>
            r.id === newId ? { ...r, text: r.fullText.slice(0, i + 1) } : r
          ),
        }));
        i++;
        if (i >= responseText.length) clearInterval(interval);
      }, 18);
    } catch (err) {
      const newId = Date.now();
      setConversations((prev) => ({
        ...prev,
        [selectedFile]: [
          ...(prev[selectedFile] || []),
          { id: newId, text: "⚠️ Error fetching response." },
        ],
      }));
    } finally {
      setAsking(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const currentResponses = selectedFile ? conversations[selectedFile] || [] : [];

  return (
    <div className="p-8 h-full bg-gray-50 font-sans overflow-y-auto flex flex-col">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        📂 Legal Vault
      </h2>

      {/* Files Section */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Files</h3>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="text-gray-500 text-sm">No files uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {files.map((file, idx) => {
              const isActive = selectedFile === file;
              return (
                <li
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 border border-blue-400 shadow-inner"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (selectedFile === file) {
                      setSelectedFile(null);
                    } else {
                      setSelectedFile(file);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <FiFileText className={`text-xl ${isActive ? "text-blue-600" : "text-blue-500"}`} />
                    <span className="font-medium text-gray-800">{file}</span>
                    {isActive && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                        Open
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                        inputRef.current?.focus();
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                      title="Ask about this file"
                    >
                      Ask
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file);
                      }}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete file"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Conversations Section */}
      <div className="flex-1 mb-4 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Conversations</h3>
        {selectedFile ? (
          currentResponses.length === 0 ? (
            <p className="text-gray-500 text-sm">No chat history yet for this file.</p>
          ) : (
            <ul className="space-y-6">
              {currentResponses.map((res) => (
                <motion.li
                  key={res.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {res.question && (
                    <p className="text-blue-700 font-medium mb-3">
                      Q: {res.question}
                    </p>
                  )}
                  <div className="text-gray-800 space-y-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {res.text}
                    </ReactMarkdown>
                  </div>
                  {res.citations && res.citations.length > 0 && (
                    <div className="mt-4 bg-white border rounded p-3 text-sm space-y-2">
                      <div className="font-medium text-gray-700 mb-2">Sources:</div>
                      <ul className="list-disc ml-5 space-y-1">
                        {res.citations.map((c, i) => (
                          <li key={i} className="text-gray-700">
                            <span className="font-mono">{c.source}</span>
                            {c.page !== undefined && c.page !== null
                              ? `, p.${c.page}`
                              : ""}
                            {c.filetype ? ` (${c.filetype})` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
          )
        ) : (
          <p className="text-gray-500 text-sm">Select a file to view its conversation.</p>
        )}
      </div>

      {/* Ask Section Below Conversations */}
      {selectedFile && (
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Model
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="gpt-4o-mini">Lawyer 1</option>
              <option value="gpt-4">Lawyer 2</option>
              <option value="gpt-3.5-turbo">Lawyer 3</option>
            </select>
          </div>
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
              placeholder="Ask your question..."
            />
            <button
              onClick={handleAsk}
              disabled={asking}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center"
            >
              <FiSend className="mr-2" />
              {asking ? "Thinking…" : "Ask"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vault;
