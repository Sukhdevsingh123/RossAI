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

// Sidebar nodes definition
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

// ✅ Custom Node Component
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
    const connectedEdges = edges.filter(
      (e) => e.source === id || e.target === id
    );

    if (connectedEdges.length > 0) {
      // Disconnect edges
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    } else {
      // Delete node
      setNodes((nds) => nds.filter((n) => n.id !== id));
    }
  };

  console.log(data);

  return (
    <div className="px-2"
      style={{
        // padding: 0,
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
          padding: "0px 0",
          gap:"4px"
        }}
      >
        {/* Left side: Icon + Label + Sub */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <p >{data.icon}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <p className="font-semibold " style={{ fontSize: "10px" }}>{data.label}</p>
            <p style={{ fontSize: "8px", color: "#666" }}>{data.sub}</p>
          </div>
        </div>

        {/* Right side: Delete button */}
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

// ✅ Sidebar Component
// function Sidebar({ addNode }) {
//   return (
//     <div style={{ width: 250, padding: 10, borderRight: "1px solid #ccc" }}>
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

function Sidebar({ addNode }) {
  return (
    <div
      style={{
        width: 300,
        height: "100vh", // pura viewport height le
        padding: 10,
        borderRight: "1px solid #ccc",
        overflowY: "auto", // scroll bar dikhane ke liye
        boxSizing: "border-box", // ensure padding includes in size
        scrollbarWidth: "none", // Firefox mein scrollbar hide
        msOverflowStyle: "none", // Internet Explorer mein scrollbar hide
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

// ✅ Node Configuration Panel
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

// ✅ Main Component
export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "custom",
      position: { x: 250, y: 25 },
      data: { label: "Trigger" },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const canvasRef = useRef(null);

  const nodeTypes = {
    custom: (props) => (
      <CustomNode
        {...props}
        selected={selectedNode && selectedNode.id === props.id}
        setNodes={setNodes}
        setEdges={setEdges}
        edges={edges} // pass edges to each node
      />
    ),
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // const addNode = useCallback(
  //   (label, position = { x: 100, y: 100 }) => {

  //     const newNode = { id: `${+new Date()}`, type: "custom", position, data: { label } };
  //     setNodes((nds) => nds.concat(newNode));
  //   },
  //   [setNodes]
  // );

  const addNode = useCallback(
    (label, position = { x: 100, y: 100 }) => {
      const nodeItem = nodeItems.find((n) => n.label === label); // poora object le lo
      if (!nodeItem) return; // safety check
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

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex" }}>
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
  );
}
