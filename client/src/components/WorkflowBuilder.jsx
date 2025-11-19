// import { useState, useCallback, useEffect, useRef } from "react";
// import {
//   ReactFlow,
//   ReactFlowProvider,
//   addEdge,
//   Background,
//   Controls,
//   MiniMap,
//   useNodesState,
//   useEdgesState,
//   Handle,
//   Position,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";

// import {
//   Zap,
//   PlayCircle,
//   Bell,
//   GitBranch,
//   PauseCircle,
//   User,
//   RefreshCcw,
//   Layers,
//   Shuffle,
//   GitMerge,
//   Minus,
// } from "lucide-react";

// // Sidebar node definitions
// const nodeItems = [
//   { label: "Trigger", sub: "Initiate workflows", icon: <Zap size={16} /> },
//   { label: "Action", sub: "Perform tasks", icon: <PlayCircle size={16} /> },
//   { label: "Notification", sub: "Send alerts", icon: <Bell size={16} /> },
//   { label: "Conditional", sub: "Branch workflow", icon: <GitBranch size={16} /> },
//   { label: "Delay", sub: "Pause workflow", icon: <PauseCircle size={16} /> },
//   { label: "User Task", sub: "Assign tasks", icon: <User size={16} /> },
//   { label: "Loop", sub: "Repeat actions", icon: <RefreshCcw size={16} /> },
//   { label: "Sub-process", sub: "Embed workflow", icon: <Layers size={16} /> },
//   { label: "Parallel", sub: "Simultaneous branches", icon: <Shuffle size={16} /> },
//   { label: "Decision", sub: "Route workflow", icon: <GitMerge size={16} /> },
// ];

// // ✅ Custom Node Component
// function CustomNode({ id, data, isConnectable, selected, setNodes, setEdges, edges }) {
//   const handleRemove = () => {
//     const connectedEdges = edges.filter((e) => e.source === id || e.target === id);
//     if (connectedEdges.length > 0) {
//       setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
//     } else {
//       setNodes((nds) => nds.filter((n) => n.id !== id));
//     }
//   };

//   return (
//     <div
//       className="px-2"
//       style={{
//         border: selected ? "2px solid blue" : "1px solid #ddd",
//         borderRadius: 8,
//         background: "#fff",
//         minWidth: 20,
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
//           <p>{data.icon}</p>
//           <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
//             <p className="font-semibold" style={{ fontSize: "10px" }}>{data.label}</p>
//             <p style={{ fontSize: "8px", color: "#666" }}>{data.sub}</p>
//           </div>
//         </div>
//         <div>
//           <button
//             onClick={handleRemove}
//             style={{ border: "none", background: "none", cursor: "pointer" }}
//           >
//             <Minus size={16} color="red" />
//           </button>
//         </div>
//       </div>

//       <Handle type="source" position={Position.Right} id="a" isConnectable={isConnectable} />
//       <Handle type="target" position={Position.Left} id="b" isConnectable={isConnectable} />
//     </div>
//   );
// }

// // ✅ Sidebar
// function Sidebar({ addNode }) {
//   return (
//     <div
//       style={{
//         width: 300,
//         height: "100vh",
//         padding: 10,
//         borderRight: "1px solid #ccc",
//         overflowY: "auto",
//       }}
//     >
//       <h3 style={{ marginBottom: 10 }}>Nodes Library</h3>
//       {nodeItems.map((node) => (
//         <div
//           key={node.label}
//           draggable
//           onDragStart={(e) => e.dataTransfer.setData("nodeType", node.label)}
//           onClick={() => addNode(node.label)}
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             padding: "10px",
//             marginBottom: "8px",
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             background: "#f9f9f9",
//             cursor: "pointer",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             {node.icon}
//             <span style={{ fontWeight: 600 }}>{node.label}</span>
//           </div>
//           <span style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{node.sub}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ✅ Node Configuration
// function NodeConfig({ selectedNode, setSelectedNode, setNodes }) {
//   if (!selectedNode) return <p>Select a node to configure</p>;

//   const updateData = (key, value) => {
//     setNodes((nds) =>
//       nds.map((n) =>
//         n.id === selectedNode.id ? { ...n, data: { ...n.data, [key]: value } } : n
//       )
//     );
//     setSelectedNode((n) => ({ ...n, data: { ...n.data, [key]: value } }));
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//       <label>Label</label>
//       <input
//         type="text"
//         value={selectedNode.data.label}
//         onChange={(e) => updateData("label", e.target.value)}
//         placeholder="Enter label"
//       />
//     </div>
//   );
// }

// // ✅ Main Builder Component
// export default function WorkflowBuilder({ workflow, onSave, onCancel }) {
//   const [nodes, setNodes, onNodesChange] = useNodesState([
//     { id: "1", type: "custom", position: { x: 250, y: 25 }, data: { label: "Trigger", icon: <Zap size={16} />, sub: "Start" } },
//   ]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const canvasRef = useRef(null);

//   const nodeTypes = {
//     custom: (props) => (
//       <CustomNode {...props} selected={selectedNode && selectedNode.id === props.id} setNodes={setNodes} setEdges={setEdges} edges={edges} />
//     ),
//   };

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
//     [setEdges]
//   );

//   const addNode = useCallback(
//     (label, position = { x: 100, y: 100 }) => {
//       const nodeItem = nodeItems.find((n) => n.label === label);
//       if (!nodeItem) return;
//       const newNode = { id: `${+new Date()}`, type: "custom", position, data: { ...nodeItem } };
//       setNodes((nds) => nds.concat(newNode));
//     },
//     [setNodes]
//   );

//   const onDrop = useCallback(
//     (event) => {
//       event.preventDefault();
//       const nodeType = event.dataTransfer.getData("nodeType");
//       const position = { x: event.clientX - 300, y: event.clientY - 100 };
//       addNode(nodeType, position);
//     },
//     [addNode]
//   );

//   const onDragOver = useCallback((event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "move";
//   }, []);

//   const onNodeClick = (event, node) => {
//     setSelectedNode(node);
//     if (canvasRef.current) canvasRef.current.focus();
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "Delete" && selectedNode) {
//         setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
//         setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
//         setSelectedNode(null);
//       }
//     };

//     const canvas = canvasRef.current;
//     if (canvas) canvas.addEventListener("keydown", handleKeyDown);
//     return () => canvas && canvas.removeEventListener("keydown", handleKeyDown);
//   }, [selectedNode, setNodes, setEdges]);


  
//   const handleSave = () => {
//     const isComplete = nodes.length > 1;
//     onSave(workflow.id, { name: workflow.name }, isComplete);
//   };

//   return (
//     <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
//       {/* Header */}
//       <div style={{ padding: 20, borderBottom: "1px solid #ddd", display: "flex", justifyContent:"end", gap: 20 ,fontWeight:500}}>
//         <button onClick={handleSave}>💾 Save Workflow</button>
//         <button onClick={onCancel}>❌ Cancel</button>
//       </div>

//       {/* Builder */}
//       <div style={{ flex: 1, display: "flex" }}>
//         <Sidebar addNode={addNode} />

//         <div style={{ flex: 1 }} onDrop={onDrop} onDragOver={onDragOver} tabIndex={0} ref={canvasRef}>
//           <ReactFlowProvider>
//             <ReactFlow
//               nodes={nodes}
//               edges={edges}
//               onNodesChange={onNodesChange}
//               onEdgesChange={onEdgesChange}
//               onConnect={onConnect}
//               nodeTypes={nodeTypes}
//               onNodeClick={onNodeClick}
//               fitView
//             >
//               <MiniMap />
//               <Controls />
//               <Background />
//             </ReactFlow>
//           </ReactFlowProvider>
//         </div>

//         <div style={{ width: 300, padding: 20, borderLeft: "1px solid #ccc", background: "#fff" }}>
//           <h3 style={{ marginBottom: "20px" }}>Node Configuration</h3>
//           <NodeConfig selectedNode={selectedNode} setSelectedNode={setSelectedNode} setNodes={setNodes} />
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Zap,
  PlayCircle,
  Bell,
  GitBranch,
  PauseCircle,
  User,
  RefreshCcw,
  Layers,
  Shuffle,
  GitMerge,
  Minus,
} from "lucide-react";

const getStorageKey = (workflowId) => `workflow-data-${workflowId}`;

const nodeItems = [
  { label: "Trigger", sub: "Initiate workflows", icon: <Zap size={16} /> },
  { label: "Action", sub: "Perform tasks", icon: <PlayCircle size={16} /> },
  { label: "Notification", sub: "Send alerts", icon: <Bell size={16} /> },
  {
    label: "Conditional",
    sub: "Branch workflow",
    icon: <GitBranch size={16} />,
  },
  { label: "Delay", sub: "Pause workflow", icon: <PauseCircle size={16} /> },
  { label: "User Task", sub: "Assign tasks", icon: <User size={16} /> },
  { label: "Loop", sub: "Repeat actions", icon: <RefreshCcw size={16} /> },
  { label: "Sub-process", sub: "Embed workflow", icon: <Layers size={16} /> },
  {
    label: "Parallel",
    sub: "Simultaneous branches",
    icon: <Shuffle size={16} />,
  },
  { label: "Decision", sub: "Route workflow", icon: <GitMerge size={16} /> },
];

// Custom Node
function CustomNode({
  id,
  data,
  isConnectable,
  selected,
  setNodes,
  setEdges,
  edges,
}) {
  const handleRemove = () => {
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <div
      className="px-2"
      style={{
        border: selected ? "2px solid blue" : "1px solid #ddd",
        borderRadius: 8,
        background: "#fff",
        minWidth: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <p>{data.icon}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <p className="font-semibold" style={{ fontSize: "10px" }}>
              {data.label}
            </p>
            <p style={{ fontSize: "8px", color: "#666" }}>{data.sub}</p>
          </div>
        </div>
        <div>
          <button
            onClick={handleRemove}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <Minus size={16} color="red" />
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

// Sidebar
function Sidebar({ addNode }) {
  return (
    <div
      style={{
        width: 300,
        height: "100vh",
        padding: 10,
        borderRight: "1px solid #ccc",
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Nodes Library</h3>
      {nodeItems.map((node) => (
        <div
          key={node.label}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("nodeType", node.label)}
          onClick={() => addNode(node.label)}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            marginBottom: "8px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#f9f9f9",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {node.icon}
            <span style={{ fontWeight: 600 }}>{node.label}</span>
          </div>
          <span style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
            {node.sub}
          </span>
        </div>
      ))}
    </div>
  );
}

// Node Configuration
function NodeConfig({ selectedNode, setSelectedNode, setNodes }) {
  if (!selectedNode) return <p>Select a node to configure</p>;

  const updateData = (key, value) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, [key]: value } }
          : n
      )
    );
    setSelectedNode((n) => ({ ...n, data: { ...n.data, [key]: value } }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <label>Label</label>
      <input
        type="text"
        value={selectedNode.data.label}
        onChange={(e) => updateData("label", e.target.value)}
        placeholder="Enter label"
      />
    </div>
  );
}

// WorkflowBuilder
export default function WorkflowBuilder({
  workflow,
  onSave,
  onCancel,
  onUpdate,
}) {
  const canvasRef = useRef(null);
  const savedRaw = JSON.parse(localStorage.getItem(getStorageKey(workflow.id)));

  const attachIcons = (nodes) =>
    nodes.map((n) => {
      const nodeItem = nodeItems.find((item) => item.label === n.data.label);
      return { ...n, data: { ...n.data, icon: nodeItem?.icon || null } };
    });

  const saved = savedRaw
    ? { nodes: attachIcons(savedRaw.nodes), edges: savedRaw.edges }
    : {
        nodes: [
          {
            id: "1",
            type: "custom",
            position: { x: 250, y: 25 },
            data: { label: "Trigger", icon: <Zap size={16} />, sub: "Start" },
          },
        ],
        edges: [],
      };

  const [nodes, setNodes, onNodesChange] = useNodesState(saved.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(saved.edges);
  const [selectedNode, setSelectedNode] = useState(null);

  // Save nodes/edges to localStorage (status unchanged)
  useEffect(() => {
    const serializableNodes = nodes.map((n) => ({
      ...n,
      data: { ...n.data, icon: undefined },
    }));

    localStorage.setItem(
      getStorageKey(workflow.id),
      JSON.stringify({ nodes: serializableNodes, edges })
    );

    onUpdate(workflow.id, { name: workflow.name });
  }, [nodes, edges, workflow.id, onUpdate]);

  const nodeTypes = {
    custom: (props) => (
      <CustomNode
        {...props}
        selected={selectedNode && selectedNode.id === props.id}
        setNodes={setNodes}
        setEdges={setEdges}
        edges={edges}
      />
    ),
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNode = useCallback(
    (label, position = { x: 100, y: 100 }) => {
      const nodeItem = nodeItems.find((n) => n.label === label);
      if (!nodeItem) return;
      const newNode = {
        id: `${+new Date()}`,
        type: "custom",
        position,
        data: { ...nodeItem },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("nodeType");
      const position = { x: event.clientX - 300, y: event.clientY - 100 };
      addNode(nodeType, position);
    },
    [addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    if (canvasRef.current) canvasRef.current.focus();
  };

  // Delete key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && selectedNode) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) =>
          eds.filter(
            (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
          )
        );
        setSelectedNode(null);
      }
    };
    const canvas = canvasRef.current;
    if (canvas) canvas.addEventListener("keydown", handleKeyDown);
    return () => canvas && canvas.removeEventListener("keydown", handleKeyDown);
  }, [selectedNode, setNodes, setEdges]);

  const handleSave = () => {
    onSave(workflow.id, { name: workflow.name }, true); // Save marks complete
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "end",
          gap: 20,
          fontWeight: 500,
        }}
      >
        <button onClick={handleSave}>💾 Save Workflow</button>
        <button onClick={onCancel}>❌ Cancel</button>
      </div>

      {/* Builder */}
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar addNode={addNode} />

        <div
          style={{ flex: 1 }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          tabIndex={0}
          ref={canvasRef}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
            >
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        <div
          style={{
            width: 300,
            padding: 20,
            borderLeft: "1px solid #ccc",
            background: "#fff",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>Node Configuration</h3>
          <NodeConfig
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            setNodes={setNodes}
          />
        </div>
      </div>
    </div>
  );
}
