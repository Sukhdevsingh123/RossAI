import { useState } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

function AppearancePanel() {
  const [theme, setTheme] = useState("light");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Appearance</h2>

      {/* Theme Selection */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Theme</h4>
        <p className="text-sm text-gray-500 mb-4">Customise the appearance of Ross AI</p>

        <div className="flex space-x-4">
          {/* Light Mode */}
          <div
            onClick={() => handleThemeChange("light")}
            className={`cursor-pointer w-32 p-4 rounded-md border ${
              theme === "light" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-center mb-2">
              <FiSun size={24} />
            </div>
            <p className="text-center text-sm">Light Mode</p>
          </div>

          {/* Dark Mode */}
          <div
            onClick={() => handleThemeChange("dark")}
            className={`cursor-pointer w-32 p-4 rounded-md border ${
              theme === "dark" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-center mb-2">
              <FiMoon size={24} />
            </div>
            <p className="text-center text-sm">Dark Mode</p>
          </div>

          {/* System Preference */}
          <div
            onClick={() => handleThemeChange("system")}
            className={`cursor-pointer w-32 p-4 rounded-md border ${
              theme === "system" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-center mb-2">
              <FiMonitor size={24} />
            </div>
            <p className="text-center text-sm">System Preference</p>
          </div>
        </div>
      </div>

      {/* Toggle Switch */}
      <div>
        <h4 className="font-semibold mb-2">Chat Suggestions</h4>
        <p className="text-sm text-gray-500 mb-4">Show chat typing suggestions</p>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showSuggestions}
            onChange={() => setShowSuggestions(!showSuggestions)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default AppearancePanel;
