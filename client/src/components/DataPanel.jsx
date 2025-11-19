function DataPanel() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Data</h2>

      {/* Delete Chat Histories Section */}
      <div className="mb-8">
        <h4 className="font-semibold mb-2">Delete Chat Histories</h4>
        <p className="text-sm text-gray-500 mb-3">
          Remove all your chat history data
        </p>
        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md cursor-not-allowed" disabled>
          Delete Chat Histories
        </button>
      </div>

      {/* Delete Account Section */}
      <div>
        <h4 className="font-semibold mb-2">Delete Account</h4>
        <p className="text-sm text-gray-500 mb-3">
          Permanently delete your account and associated data
        </p>
        <button className="border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-50">
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default DataPanel;
