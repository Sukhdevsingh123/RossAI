import { FiPlus, FiEdit, FiFolder, FiSettings } from "react-icons/fi";

function AddMenu({ onClose }) {
  return (
    <div className="absolute left-32 bottom-10 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-50">
      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
        <FiPlus className="mr-3" /> Import
      </button>
      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
        <FiEdit className="mr-3" /> Note
      </button>
      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
        <FiFolder className="mr-3" /> Folder
      </button>
      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
        <FiSettings className="mr-3" /> Workflow
      </button>
    </div>
  );
}

export default AddMenu;
