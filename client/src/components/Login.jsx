import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FiMail, FiLock, FiBriefcase, FiUsers, FiFolder } from "react-icons/fi";

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, API_BASE } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          company_id: companyId,
          team_id: teamId,
          project_id: projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      if (data.access_token) {
        login(data.access_token);
        if (onSuccess) onSuccess();
      } else {
        throw new Error("No access token received");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiMail className="inline mr-2" />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiLock className="inline mr-2" />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiBriefcase className="inline mr-2" />
            Company ID
          </label>
          <input
            type="text"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="company-id"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiUsers className="inline mr-2" />
            Team ID
          </label>
          <input
            type="text"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="team-id"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiFolder className="inline mr-2" />
            Project ID
          </label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="project-id"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;

