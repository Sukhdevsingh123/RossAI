import React from "react";
import { FiX, FiFileText } from "react-icons/fi";

export default function ChatHistoryModal({ responses, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-lg p-0 relative max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
        >
          <FiX size={24} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold px-6 pt-6 pb-3 text-gray-900">
          Search chats
        </h2>

        {/* List */}
        <div className="divide-y">
          {responses.length === 0 ? (
            <p className="text-gray-500 px-6 py-4">No chats yet.</p>
          ) : (
            responses
              .slice()
              .reverse()
              .map((res) => (
                <div
                  key={res.id}
                  className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1 text-red-500">
                    {res.type === "pdf" ? (
                      <FiFileText size={20} />
                    ) : (
                      <span className="text-gray-400">📝</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium truncate">
                      {res.title || "Untitled Chat"}
                    </p>
                    <p className="text-gray-500 text-sm truncate">
                      {res.preview || res.question}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {res.time || "Just now"}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
