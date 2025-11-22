import React, { useState } from "react";
import LawyerSection from "./LawyerSection";
import JudgeSection from "./JudgeSection";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("lawyers");

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Profile Header Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("lawyers")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "lawyers"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Lawyers
          </button>
          <button
            onClick={() => setActiveTab("judges")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "judges"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Judges
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "lawyers" && <LawyerSection />}
        {activeTab === "judges" && <JudgeSection />}
      </div>
    </div>
  );
};

export default ProfilePage;