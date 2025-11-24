import { useEffect, useState, useRef } from "react";
import {
  FiFileText,
  FiTrash2,
  FiSend,
  FiUpload,
  FiSearch,
  FiMessageCircle,
  FiUserPlus,
  FiUserMinus,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../contexts/AuthContext";

function Vault() {
  const { getAuthHeaders, API_BASE, user } = useAuth();
  
  // Define role checks first
  const isOwner = user?.roles?.includes("owner");
  const isAdmin = user?.roles?.includes("admin");
  const isManager = user?.roles?.includes("manager");
  const canManageMembers = isOwner || isAdmin || isManager;
  
  // Set default role based on user's role
  const getDefaultRole = () => {
    if (isOwner) return "admin";
    if (isAdmin) return "manager";
    if (isManager) return "member";
    return "member";
  };
  
  const [activeTab, setActiveTab] = useState("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Chat state
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatting, setChatting] = useState(false);

  // Member management state
  const [memberUserId, setMemberUserId] = useState("");
  const [memberCompanyId, setMemberCompanyId] = useState(user?.company_id || "");
  const [memberTeamId, setMemberTeamId] = useState(user?.team_id || "");
  const [memberProjectId, setMemberProjectId] = useState(user?.project_id || "");
  const [removingMemberId, setRemovingMemberId] = useState("");
  const [memberRole, setMemberRole] = useState(getDefaultRole());
  
  // Update role when user changes
  useEffect(() => {
    setMemberRole(getDefaultRole());
  }, [isOwner, isAdmin, isManager]);

  const fileInputRef = useRef(null);
  const chatInputRef = useRef(null);

  // Upload PDF
  const handleUpload = async () => {
    if (!uploadFile) {
      setError("Please select a PDF file");
      return;
    }

    if (uploadFile.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    if (!user) {
      setError("Please login to upload files");
      return;
    }

    // Check if user has required scope (owners might not have company_id)
    const isOwner = user.roles?.includes("owner");
    if (!isOwner && (!user.company_id || !user.team_id || !user.project_id)) {
      setError("Your account is missing required scope information. Please contact an administrator.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      // For FormData, don't set Content-Type - browser will set it with boundary automatically
      const headers = getAuthHeaders();
      
      console.log("[Vault Upload] Uploading to:", `${API_BASE}/upload`);
      console.log("[Vault Upload] User:", user);
      console.log("[Vault Upload] File:", uploadFile.name, uploadFile.type, uploadFile.size);
      console.log("[Vault Upload] Headers:", headers);

      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: headers, // Only Authorization header, no Content-Type
        body: formData,
      });

      console.log("[Vault Upload] Response status:", response.status, response.statusText);

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("[Vault Upload] Non-JSON response:", text);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        console.error("[Vault Upload] Error response:", data);
        throw new Error(data.detail || data.message || `Upload failed: ${response.status}`);
      }

      console.log("[Vault Upload] Success:", data);
      setSuccess(`File uploaded successfully! Document ID: ${data.doc_id}, Chunks: ${data.chunks}`);
      setUploadFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("[Vault Upload] Exception:", err);
      setError(err.message || "Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  // Search documents
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setSearching(true);
    setError("");
    setSearchResults([]);

    try {
      const response = await fetch(
        `${API_BASE}/search?query=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Search failed");
      }

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
        setError("No relevant documents found.");
      }
    } catch (err) {
      setError(err.message || "Search failed");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Chat with documents
  const handleChat = async () => {
    if (!chatQuery.trim()) {
      return;
    }

    setChatting(true);
    setError("");

    const question = chatQuery;
    setChatQuery("");

    // Add user question to history
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: question,
    };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        `${API_BASE}/chat?query=${encodeURIComponent(question)}`,
        {
          method: "GET",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Chat failed");
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        text: data.answer || "No response",
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "error",
        text: err.message || "Error fetching response",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setChatting(false);
    }
  };

  // Add member
  const handleAddMember = async () => {
    if (!memberUserId || !memberCompanyId || !memberTeamId || !memberProjectId) {
      setError("Please fill in all required fields");
      return;
    }

    if (!canManageMembers) {
      setError("Only owner, admins, or managers can add members");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const params = new URLSearchParams({
        user_id: memberUserId,
        company_id: memberCompanyId,
        team_id: memberTeamId,
        project_id: memberProjectId,
        role: memberRole,
      });

      const response = await fetch(`${API_BASE}/add-member?${params.toString()}`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to add member");
      }

      setSuccess(data.message || "Member added successfully");
      setMemberUserId("");
      setMemberRole(getDefaultRole());
    } catch (err) {
      setError(err.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  // Remove member
  const handleRemoveMember = async () => {
    if (!removingMemberId || !memberCompanyId || !memberTeamId || !memberProjectId) {
      setError("Please fill in all required fields");
      return;
    }

    if (!canManageMembers) {
      setError("Only owner, admins, or managers can remove members");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const params = new URLSearchParams({
        user_id: removingMemberId,
        company_id: memberCompanyId,
        team_id: memberTeamId,
        project_id: memberProjectId,
      });

      const response = await fetch(`${API_BASE}/remove-member?${params.toString()}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to remove member");
      }

      setSuccess(data.message || "Member removed successfully");
      setRemovingMemberId("");
    } catch (err) {
      setError(err.message || "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const tabs = [
    { id: "upload", label: "Upload", icon: <FiUpload /> },
    { id: "search", label: "Search", icon: <FiSearch /> },
    { id: "chat", label: "Chat", icon: <FiMessageCircle /> },
    { id: "members", label: "Members", icon: <FiUsers /> },
  ];

  return (
    <div className="p-8 h-full bg-gray-50 font-sans overflow-y-auto flex flex-col">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        📂 Secure Vault
      </h2>

      {/* Tabs */}
      <div className="mb-6 flex space-x-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Upload PDF Document
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select PDF File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {uploadFile && (
                <p className="mt-2 text-sm text-gray-600">Selected: {uploadFile.name}</p>
                    )}
                  </div>
                    <button
              onClick={handleUpload}
              disabled={uploading || !uploadFile}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
            >
              <FiUpload className="mr-2" />
              {uploading ? "Uploading..." : "Upload PDF"}
                    </button>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Search Documents
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter your search query..."
              />
                    <button
                onClick={handleSearch}
                disabled={searching}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center"
              >
                <FiSearch className="mr-2" />
                {searching ? "Searching..." : "Search"}
                    </button>
                  </div>
      </div>

          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 overflow-y-auto">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Found {searchResults.length} results:</h4>
              <div className="space-y-4">
                {searchResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="font-medium text-gray-800 mb-2">
                      {result.filename || "N/A"}
                  </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Page: {result.page || "N/A"} | Score:{" "}
                      {result.score ? result.score.toFixed(3) : "N/A"}
                    </div>
                    <div className="text-gray-700">{result.content}</div>
                  </motion.div>
                ))}
              </div>
            </div>
        )}
      </div>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-white rounded-xl shadow-md p-6 mb-4 overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Chat with Documents</h3>
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">Start a conversation by asking a question...</p>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      msg.type === "user"
                        ? "bg-blue-50 ml-auto max-w-2xl"
                        : msg.type === "error"
                        ? "bg-red-50 max-w-2xl"
                        : "bg-gray-50 max-w-2xl"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <p className="text-blue-800 font-medium">{msg.text}</p>
                    ) : (
                      <div className="text-gray-800">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex gap-3">
            <input
                ref={chatInputRef}
              type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChat()}
                placeholder="Ask a question about your documents..."
            />
            <button
                onClick={handleChat}
                disabled={chatting}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center"
            >
              <FiSend className="mr-2" />
                {chatting ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="space-y-6">
          {!canManageMembers && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Only owner, admins, and managers can add or remove members. 
                Your current role: <strong>{user?.roles?.[0] || "member"}</strong>
              </p>
            </div>
          )}
          {canManageMembers && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Role Hierarchy:</strong>
                {isOwner && " Owner → Admin → Manager → Member"}
                {isAdmin && !isOwner && " Admin → Manager → Member"}
                {isManager && !isAdmin && !isOwner && " Manager → Member"}
                <br />
                {isOwner && "You can add admins. Admins can then add managers."}
                {isAdmin && !isOwner && "You can add managers. Managers can then add members."}
                {isManager && !isAdmin && !isOwner && "You can add members."}
              </p>
            </div>
          )}
          {/* Add Member */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FiUserPlus className="mr-2" />
              Add Member
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={memberUserId}
                  onChange={(e) => setMemberUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="user_id"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company ID
                  </label>
                  <input
                    type="text"
                    value={memberCompanyId}
                    onChange={(e) => setMemberCompanyId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team ID
                  </label>
                  <input
                    type="text"
                    value={memberTeamId}
                    onChange={(e) => setMemberTeamId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={memberProjectId}
                    onChange={(e) => setMemberProjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {isOwner ? (
                    <option value="admin">Admin</option>
                  ) : isAdmin ? (
                    <option value="manager">Manager</option>
                  ) : isManager ? (
                    <option value="member">Member</option>
                  ) : (
                    <option value="member">Member (No permission)</option>
                  )}
                </select>
                {isOwner && (
                  <p className="mt-1 text-xs text-blue-600">
                    Owner can only add admins. There can be only one owner per project.
                  </p>
                )}
                {isAdmin && !isOwner && (
                  <p className="mt-1 text-xs text-blue-600">
                    Admin can only add managers. Managers can then add members.
                  </p>
                )}
                {isManager && !isAdmin && !isOwner && (
                  <p className="mt-1 text-xs text-blue-600">
                    Manager can only add members.
                  </p>
                )}
              </div>
              <button
                onClick={handleAddMember}
                disabled={loading}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                {loading ? "Adding..." : "Add Member"}
              </button>
            </div>
          </div>

          {/* Remove Member */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FiUserMinus className="mr-2" />
              Remove Member
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID to Remove
                </label>
                <input
                  type="text"
                  value={removingMemberId}
                  onChange={(e) => setRemovingMemberId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="user_id"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company ID
                  </label>
                  <input
                    type="text"
                    value={memberCompanyId}
                    onChange={(e) => setMemberCompanyId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team ID
                  </label>
                  <input
                    type="text"
                    value={memberTeamId}
                    onChange={(e) => setMemberTeamId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={memberProjectId}
                    onChange={(e) => setMemberProjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleRemoveMember}
                disabled={loading}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {loading ? "Removing..." : "Remove Member"}
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vault;
