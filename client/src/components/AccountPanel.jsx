import { FiUser, FiExternalLink } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

function AccountPanel() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Account</h2>

      {/* User Info */}
      {isAuthenticated && user ? (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white mr-4">
              <FiUser size={24} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{user.user_id}</p>
              <p className="text-sm text-gray-500">
                Role: {user.roles?.[0] || "member"}
              </p>
            </div>
            <button
              onClick={logout}
              className="ml-auto bg-black text-white px-3 py-1 text-sm rounded-md hover:bg-gray-800"
            >
              Log out
            </button>
          </div>

          {/* User Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">User ID</p>
                <p className="font-medium">{user.user_id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Role</p>
                <p className="font-medium">{user.roles?.join(", ") || "member"}</p>
              </div>
              {user.company_id && (
                <div>
                  <p className="text-gray-500 mb-1">Company ID</p>
                  <p className="font-medium">{user.company_id}</p>
                </div>
              )}
              {user.team_id && (
                <div>
                  <p className="text-gray-500 mb-1">Team ID</p>
                  <p className="font-medium">{user.team_id}</p>
                </div>
              )}
              {user.project_id && (
                <div>
                  <p className="text-gray-500 mb-1">Project ID</p>
                  <p className="font-medium">{user.project_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please log in to view your account information.
          </p>
        </div>
      )}

      {/* Connected Apps */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Connected Apps</h4>
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
          <div>
            <p className="font-medium">Google Drive</p>
            <p className="text-sm text-gray-500">
              Import Google Docs, Sheets, Slides and other supported files.
            </p>
          </div>
          <button className="bg-black text-white text-sm px-3 py-1 rounded-md hover:bg-gray-800">
            Connect
          </button>
        </div>
      </div>

      {/* Ross AI Bots */}
      <div className="pb-32">
        <h4 className="font-semibold mb-2">Ross Ai Bots</h4>
        <p className="text-sm text-gray-500 mb-3">
          Chat with RossAi and add links/documents from anywhere in your library.
        </p>
        <div className="flex gap-4">
          <button className="flex-1 border border-gray-300 p-3 rounded-md hover:bg-gray-100 flex items-center justify-center text-sm">
            <FiExternalLink className="mr-2" /> WhatsApp Bot
          </button>
          <button className="flex-1 border border-gray-300 p-3 rounded-md hover:bg-gray-100 flex items-center justify-center text-sm">
            <FiExternalLink className="mr-2" /> Telegram Bot
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPanel;
