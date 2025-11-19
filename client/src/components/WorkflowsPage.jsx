import { useState, useEffect } from "react";
import WorkflowBuilder from "./WorkflowBuilder";
import { Plus, MoreVertical, Trash2 } from "lucide-react";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(() => {
    const saved = localStorage.getItem("workflows");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "untitled workflow", status: "Complete" },
          { id: 2, name: "untitled workflow", status: "Incomplete" },
        ];
  });

  const [activeWorkflow, setActiveWorkflow] = useState(null);

  // Save to localStorage whenever workflows change
  useEffect(() => {
    localStorage.setItem("workflows", JSON.stringify(workflows));
  }, [workflows]);

  const handleNewWorkflow = () => {
    const newWf = {
      id: Date.now(),
      name: "Untitled Workflow",
      status: "Incomplete",
    };
    setWorkflows([...workflows, newWf]);
    setActiveWorkflow(newWf);
  };

  const handleSaveWorkflow = (id, data, isComplete) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id
          ? { ...wf, ...data, status: isComplete ? "Complete" : "Incomplete" }
          : wf
      )
    );
    setActiveWorkflow(null);
  };

  //   const handleUpdateWorkflow = (id, data) => {
  //     setWorkflows((prev) =>
  //       prev.map((wf) =>
  //         wf.id === id ? { ...wf, ...data, status: "incomplete" } : wf
  //       )
  //     );
  //   };

  const handleUpdateWorkflow = (id, data) => {
    setWorkflows((prev) =>
      prev.map(
        (wf) => (wf.id === id ? { ...wf, ...data } : wf) // ✅ remove forced "incomplete"
      )
    );
  };

  const handleDeleteWorkflow = (id) => {
    setWorkflows((prev) => prev.filter((wf) => wf.id !== id));
    localStorage.removeItem(`workflow-data-${id}`);
  };

  if (activeWorkflow) {
    return (
      <WorkflowBuilder
        workflow={activeWorkflow}
        onSave={handleSaveWorkflow}
        onCancel={() => setActiveWorkflow(null)}
        onUpdate={handleUpdateWorkflow}
      />
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Workflows</h2>
      <div className="flex flex-wrap gap-4   max-h-[80vh] overflow-y-auto">
        {/* New Workflow Card */}
        <div
          onClick={handleNewWorkflow}
          className="min-w-[200px] rounded-xl p-20  border border-dashed border-gray-300  cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center text-gray-600 transition"
        >
          <Plus size={24} />
          <h3 className="mt-2 font-medium">New Workflow</h3>
        </div>

        {/* Saved Workflows */}
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="min-w-[200px] flex flex-col  justify-center rounded-xl border border-gray-200 bg-white shadow-sm p-4 cursor-pointer hover:shadow-md transition gap-3"
          >
            {/* Header */}
            <div className="flex justify-around  items-center">
              <h3
                className="font-medium text-gray-800"
                onClick={() => setActiveWorkflow(wf)}
              >
                {wf.name}
              </h3>
              <div className="flex gap-2">
                {/* <MoreVertical
                  size={18}
                  className="text-gray-500 cursor-pointer"
                /> */}
                <Trash2
                  size={18}
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteWorkflow(wf.id)}
                />
              </div>
            </div>
<div className="flex justify-center ">
            {/* Status */}
            <div
              className={`px-2 py-1 text-sm font-semibold rounded-md self-start text-center ${
                wf.status === "Complete"
                  ? "bg-green-100 text-green-900"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {wf.status}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
