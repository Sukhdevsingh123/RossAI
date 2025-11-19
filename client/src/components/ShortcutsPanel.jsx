function ShortcutsPanel() {
  const shortcuts = [
    // Assistant / Chat Functional Shortcuts
    { action: "Open New Chat", keys: ["Alt", "Shift", "N"] }, // Clear responses
    { action: "Upload Files", keys: ["Alt", "Shift", "U"] }, // Click file input
    { action: "Edit Last Message", keys: ["Alt", "E"] }, // Edit last question
    { action: "Focus Chat Input", keys: ["Shift", "Escape"] }, // Focus input
    { action: "Copy Last Response", keys: ["Alt", "Shift", "C"] }, // Copy last response
    { action: "Delete All Chats", keys: ["Alt", "Shift", "D"] }, // Clear all responses

    // App / Navigation Shortcuts
    { action: "Open Assistant", keys: ["Ctrl", "Shift", "1"] },
    { action: "Open Vault", keys: ["Ctrl", "Shift", "2"] },
    { action: "Open Workflows", keys: ["Ctrl", "Shift", "3"] },
    { action: "Toggle Add Menu", keys: ["Ctrl", "Shift", ","] },
    { action: "Open Settings", keys: ["Ctrl", "Shift", "."] },
    { action: "Open Support", keys: ["Ctrl", "Shift", "H"] },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Shortcuts</h2>
      <p className="text-sm text-gray-500 mb-6">
        Use these shortcuts to navigate the app
      </p>

      <div className="space-y-4">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <span>{shortcut.action}</span>
            <div className="flex space-x-1">
              {shortcut.keys.map((key, idx) => (
                <kbd
                  key={idx}
                  className="bg-gray-200 px-2 py-1 rounded text-xs font-mono text-gray-700"
                >
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShortcutsPanel;
