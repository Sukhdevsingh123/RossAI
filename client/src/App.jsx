// import { useState, useEffect } from "react";
// import {
//   FiMessageSquare,
//   FiFolder,
//   FiGrid,
//   FiSettings,
//   FiHelpCircle,
//   FiClock,
//   FiChevronLeft,
//   FiChevronRight,
// } from "react-icons/fi";
// import Assistant from "./components/Assistant";
// import Vault from "./components/Vault";
// import WorkflowsPage from "./components/WorkflowsPage";
// import SettingsModal from "./components/SettingsModal";
// import AddMenu from "./components/AddMenu";
// import ChatHistoryModal from "./components/ChatHistoryModal";

// function App() {
//   const [activeComponent, setActiveComponent] = useState("assistant");
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
//   const [sources, setSources] = useState([]);
//   const [responses, setResponses] = useState([]);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   const navItems = [
//     { id: "assistant", icon: <FiMessageSquare />, label: "Assistant" },
//     { id: "vault", icon: <FiFolder />, label: "Vault" },
//     { id: "workflows", icon: <FiGrid />, label: "Workflows" },
//     { id: "chathistory", icon: <FiClock />, label: "Chat History" },
//   ];

//   const bottomItems = [
//     { id: "settings", icon: <FiSettings />, label: "Settings" },
//     { id: "support", icon: <FiHelpCircle />, label: "Support" },
//   ];

//   const handleBottomClick = (id) => {
//     if (id === "settings") setIsSettingsOpen(true);
//     else console.log(id);
//   };

//   const handleNavClick = (id) => {
//     if (id === "chathistory") setIsChatHistoryOpen(true);
//     else setActiveComponent(id);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.ctrlKey && e.shiftKey && e.code === "Digit1") setActiveComponent("assistant");
//       if (e.ctrlKey && e.shiftKey && e.code === "Digit2") setActiveComponent("vault");
//       if (e.ctrlKey && e.shiftKey && e.code === "Digit3") setActiveComponent("workflows");
//       if (e.ctrlKey && e.shiftKey && e.code === "Comma") setIsAddOpen((prev) => !prev);
//       if (e.ctrlKey && e.shiftKey && e.code === "Period") setIsSettingsOpen(true);
//       if (e.ctrlKey && e.shiftKey && e.code === "KeyH") console.log("Open Support");
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   return (
//     <div className="flex h-screen bg-white text-gray-900">
//       {/* Sidebar */}
//       <div
//         className={`flex flex-col justify-between border-r border-gray-200 transition-all duration-300 ${
//           isSidebarCollapsed ? "w-20" : "w-64"
//         } p-4`}
//       >
//         {/* Top: Title + Toggle */}
//         <div className="flex items-center justify-between mb-6">
//           {!isSidebarCollapsed && <h1 className="text-2xl font-serif font-bold">Ross AI</h1>}
//           <button
//             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//             className="p-1 rounded hover:bg-gray-200"
//           >
//             {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 space-y-1">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleNavClick(item.id)}
//               className={`flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50 hover:text-gray-900 ${
//                 activeComponent === item.id ? "bg-gray-300 text-black" : "text-gray-700"
//               }`}
//             >
//               <span className="text-lg">{item.icon}</span>
//               {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
//             </button>
//           ))}
//         </nav>

//         {/* Bottom + Add */}
//         <div className="space-y-2">
//           {bottomItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleBottomClick(item.id)}
//               className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
//             >
//               <span className="text-lg">{item.icon}</span>
//               {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
//             </button>
//           ))}

//           <div className="border-t border-gray-200 pt-2">
//             <button
//               onClick={() => setIsAddOpen(!isAddOpen)}
//               className="flex items-center justify-center w-full px-3 py-2 text-sm text-white bg-purple-500 rounded-md hover:bg-purple-600"
//             >
//               <span className="mr-2">{!isSidebarCollapsed && "Add"}</span>
//               <span className="text-lg">+</span>
//             </button>
//             {isAddOpen && !isSidebarCollapsed && <AddMenu />}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-hidden">
//         {activeComponent === "assistant" && (
//           <Assistant
//             sources={sources}
//             setSources={setSources}
//             responses={responses}
//             setResponses={setResponses}
//           />
//         )}
//         {activeComponent === "vault" && <Vault sources={sources} responses={responses} />}
//         {activeComponent === "workflows" && <WorkflowsPage />}
//       </div>

//       {/* Modals */}
//       {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
//       {isChatHistoryOpen && (
//         <ChatHistoryModal
//           responses={responses}
//           onClose={() => setIsChatHistoryOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import {
  FiMessageSquare,
  FiFolder,
  FiGrid,
  FiSettings,
  FiHelpCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiBarChart2,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
} from "react-icons/fi";
import Assistant from "./components/Assistant";
import Vault from "./components/Vault";
import WorkflowsPage from "./components/WorkflowsPage";
import SettingsModal from "./components/SettingsModal";
import AddMenu from "./components/AddMenu";
import ChatHistoryModal from "./components/ChatHistoryModal";
import ProfilePage from "./profile/ProfilePage";
import Analytics from "./components/Analytics";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const [activeComponent, setActiveComponent] = useState("assistant");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [sources, setSources] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && (activeComponent === "login" || activeComponent === "signup")) {
      setActiveComponent("assistant");
      setShowLoginModal(false);
      setShowSignupModal(false);
    }
  }, [isAuthenticated]);

  const navItems = [
    { id: "assistant", icon: <FiMessageSquare />, label: "Assistant" },
    { id: "vault", icon: <FiFolder />, label: "Vault" },
    { id: "workflows", icon: <FiGrid />, label: "Workflows" },
    { id: "analytics", icon: <FiBarChart2 />, label: "Analytics" },
    { id: "profile", icon: <FiUser />, label: "Profile" },
    { id: "chathistory", icon: <FiClock />, label: "Chat History" },
  ];

  const bottomItems = [
    { id: "settings", icon: <FiSettings />, label: "Settings" },
    { id: "support", icon: <FiHelpCircle />, label: "Support" },
  ];

  const handleBottomClick = (id) => {
    if (id === "settings") setIsSettingsOpen(true);
    else console.log(id);
  };

  const handleNavClick = (id) => {
    if (id === "chathistory") setIsChatHistoryOpen(true);
    else if (id === "login") setShowLoginModal(true);
    else if (id === "signup") setShowSignupModal(true);
    else setActiveComponent(id);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === "Digit1") setActiveComponent("assistant");
      if (e.ctrlKey && e.shiftKey && e.code === "Digit2") setActiveComponent("vault");
      if (e.ctrlKey && e.shiftKey && e.code === "Digit3") setActiveComponent("workflows");
      if (e.ctrlKey && e.shiftKey && e.code === "Digit4") setActiveComponent("analytics"); // Updated Shortcut
      if (e.ctrlKey && e.shiftKey && e.code === "Digit5") setActiveComponent("profile"); // Updated Shortcut
      if (e.ctrlKey && e.shiftKey && e.code === "Comma") setIsAddOpen((prev) => !prev);
      if (e.ctrlKey && e.shiftKey && e.code === "Period") setIsSettingsOpen(true);
      if (e.ctrlKey && e.shiftKey && e.code === "KeyH") console.log("Open Support");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <div
        className={`flex flex-col justify-between border-r border-gray-200 transition-all duration-300 ${isSidebarCollapsed ? "w-20" : "w-64"
          } p-4`}
      >
        {/* Top: Title + Toggle */}
        <div className="flex items-center justify-between mb-6">
          {!isSidebarCollapsed && <h1 className="text-2xl font-serif font-bold">Ross AI</h1>}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded hover:bg-gray-200"
          >
            {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50 hover:text-gray-900 ${activeComponent === item.id ? "bg-gray-300 text-black" : "text-gray-700"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom + Add */}
        <div className="space-y-2">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleBottomClick(item.id)}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="text-lg">{item.icon}</span>
              {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}

          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={() => setIsAddOpen(!isAddOpen)}
              className="flex items-center justify-center w-full px-3 py-2 text-sm text-white bg-purple-500 rounded-md hover:bg-purple-600"
            >
              <span className="mr-2">{!isSidebarCollapsed && "Add"}</span>
              <span className="text-lg">+</span>
            </button>
            {isAddOpen && !isSidebarCollapsed && <AddMenu />}
          </div>

          {/* Login/Signup or User Info */}
          {!isAuthenticated ? (
            <div className="border-t border-gray-200 pt-2 space-y-1">
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center w-full px-3 py-2 text-sm text-blue-600 rounded-md hover:bg-blue-50"
              >
                <FiLogIn className="text-lg" />
                {!isSidebarCollapsed && <span className="ml-3">Login</span>}
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="flex items-center w-full px-3 py-2 text-sm text-purple-600 rounded-md hover:bg-purple-50"
              >
                <FiUserPlus className="text-lg" />
                {!isSidebarCollapsed && <span className="ml-3">Sign Up</span>}
              </button>
            </div>
          ) : (
            user && !isSidebarCollapsed && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-xs text-gray-500">
                  <div>User: {user.user_id}</div>
                  <div>Role: {user.roles?.[0] || "member"}</div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 mt-2"
                >
                  <FiLogOut className="text-lg" />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeComponent === "assistant" && (
          <Assistant
            sources={sources}
            setSources={setSources}
            responses={responses}
            setResponses={setResponses}
          />
        )}
        {activeComponent === "vault" && <Vault sources={sources} responses={responses} />}
        {activeComponent === "workflows" && <WorkflowsPage />}
        {activeComponent === "analytics" && <Analytics />}
        {activeComponent === "profile" && <ProfilePage />}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <Login onSuccess={() => setShowLoginModal(false)} />
            <div className="mt-4 text-center bg-white p-4 rounded-lg">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <Signup onSuccess={() => setShowSignupModal(false)} />
            <div className="mt-4 text-center bg-white p-4 rounded-lg">
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isChatHistoryOpen && (
        <ChatHistoryModal
          responses={responses}
          onClose={() => setIsChatHistoryOpen(false)}
        />
      )}
    </div>
  );
}

export default App;


