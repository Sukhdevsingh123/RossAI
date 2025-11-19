import { useState } from "react";
import {
  FiX,
  FiUser,
  FiCreditCard,
  FiCpu,
  FiSettings,
  FiDatabase,
  FiZap,
} from "react-icons/fi";

import AppearancePanel from "./AppearancePanel";
import AccountPanel from "./AccountPanel";
import DataPanel from "./DataPanel";
import ShortcutsPanel from "./ShortcutsPanel";

function SettingsModal({ onClose }) {
  const [selected, setSelected] = useState("account");

  const navItems = [
    { id: "account", label: "Account", icon: <FiUser className="mr-2" /> },
    { id: "appearance", label: "Appearance", icon: <FiSettings className="mr-2" /> },
    // { id: "billing", label: "Billing & Usage", icon: <FiCreditCard className="mr-2" /> },
    // { id: "ai", label: "AI Models", icon: <FiCpu className="mr-2" /> },
    { id: "data", label: "Data", icon: <FiDatabase className="mr-2" /> },
    { id: "shortcuts", label: "Shortcuts", icon: <FiZap className="mr-2" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-3xl h-full max-h-[90vh] flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-100 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`flex items-center text-sm p-2 rounded-md w-full text-left ${
                  selected === item.id ? "bg-white font-semibold" : "hover:bg-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Panel */}
          <div className="flex-1 bg-white p-6 relative overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FiX size={20} />
            </button>

            {selected === "account" && <AccountPanel />}
            {selected === "appearance" && <AppearancePanel />}
            {/* {selected === "billing" && <div><h2 className="text-xl font-bold">Billing & Usage</h2></div>} */}
            {selected === "ai" && <div><h2 className="text-xl font-bold">AI Models</h2></div>}
            {selected === "data" && <DataPanel/>}
            {selected === "shortcuts" && <ShortcutsPanel/>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
