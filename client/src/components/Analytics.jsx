import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    FiUsers,
    FiUser,
    FiClock,
    FiActivity,
    FiChevronRight,
    FiCalendar
} from "react-icons/fi";

// --- Dummy Data Generators ---
const generateData = (base, type) => {
    const variance = 1.5;

    if (type === 'daily') {
        // Hourly breakdown (9 AM - 6 PM)
        // Value represents minutes worked in that hour (0-60)
        return Array.from({ length: 10 }, (_, i) => ({
            label: `${i + 9}:00`,
            value: Math.max(0, Math.min(60, (base / 8 * 60) + (Math.random() * 20 - 10)))
        }));
    }

    if (type === 'weekly') {
        // Daily hours (e.g., 8h)
        return Array.from({ length: 7 }, (_, i) => ({
            label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            value: Math.max(0, Math.min(14, base + (Math.random() * variance - variance / 2)))
        }));
    }

    if (type === 'monthly') {
        // Average Daily Hours per Week
        // We want to show ~8h, representing the daily average for that week
        return Array.from({ length: 4 }, (_, i) => ({
            label: `Week ${i + 1}`,
            value: Math.max(4, Math.min(12, base + (Math.random() * variance - variance / 2)))
        }));
    }

    if (type === 'yearly') {
        // Average Daily Hours per Month
        // We want to show ~8h, representing the daily average for that month
        return Array.from({ length: 12 }, (_, i) => ({
            label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
            value: Math.max(4, Math.min(12, base + (Math.random() * variance - variance / 2)))
        }));
    }
    return [];
};

// Helper to calculate metric
const calculateMetric = (data, type) => {
    if (!data || data.length === 0) return 0;

    if (type === 'daily') {
        // For daily, we want Total Hours (Sum of minutes / 60)
        const sumMinutes = data.reduce((acc, curr) => acc + curr.value, 0);
        return sumMinutes / 60;
    }

    // For others, we want Average Daily Hours
    const sum = data.reduce((acc, curr) => acc + curr.value, 0);
    return sum / data.length;
};

// Static definitions for people to maintain identity across renders
const MANAGERS_LIST = [
    { id: "m1", name: "Alice Freeman", role: "Product Manager", base: 8.4 },
    { id: "m2", name: "Bob Smith", role: "Eng Manager", base: 7.8 },
    { id: "m3", name: "Charlie Davis", role: "Design Lead", base: 6.9 },
    { id: "m4", name: "Diana Prince", role: "Marketing Lead", base: 9.2 },
    { id: "m5", name: "Evan Wright", role: "Sales Director", base: 8.0 },
];

const EMPLOYEES_LIST = [
    { id: "e1", name: "Frank Miller", role: "Senior Dev", base: 7.5 },
    { id: "e2", name: "Grace Lee", role: "Frontend Dev", base: 8.1 },
    { id: "e3", name: "Henry Wilson", role: "Backend Dev", base: 7.2 },
    { id: "e4", name: "Ivy Chen", role: "UI Designer", base: 8.5 },
    { id: "e5", name: "Jack Taylor", role: "Full Stack", base: 7.8 },
    { id: "e6", name: "Kelly Martin", role: "QA Engineer", base: 7.0 },
    { id: "e7", name: "Leo Anderson", role: "DevOps", base: 8.3 },
    { id: "e8", name: "Mia Wong", role: "Mobile Dev", base: 7.6 },
    { id: "e9", name: "Nathan Clark", role: "Data Scientist", base: 8.0 },
    { id: "e10", name: "Olivia Scott", role: "Product Owner", base: 8.8 },
];

const Analytics = () => {
    const [activeTab, setActiveTab] = useState("managers"); // managers | employees | company
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [timeRange, setTimeRange] = useState("weekly"); // daily | weekly | monthly | yearly

    // --- Data Processing ---

    // 1. Get Current List based on Tab
    const currentListBase = activeTab === "managers" ? MANAGERS_LIST : activeTab === "employees" ? EMPLOYEES_LIST : [];

    // 2. Generate Data for the Current List based on TimeRange
    const currentListWithData = useMemo(() => {
        return currentListBase.map(person => {
            const data = generateData(person.base, timeRange);
            return {
                ...person,
                data: data,
                metric: calculateMetric(data, timeRange)
            };
        });
    }, [currentListBase, timeRange]);

    // 3. Generate Company Data
    const companyData = useMemo(() => {
        const data = generateData(7.6, timeRange);
        return {
            data: data,
            metric: calculateMetric(data, timeRange)
        };
    }, [timeRange]);

    // 4. Determine Selected Person
    const selectedPerson = useMemo(() => {
        if (!selectedPersonId) return null;
        return currentListWithData.find(p => p.id === selectedPersonId);
    }, [selectedPersonId, currentListWithData]);

    // 5. Calculate Group Metric
    const groupMetric = useMemo(() => {
        if (currentListWithData.length === 0) return 0;
        const sum = currentListWithData.reduce((acc, curr) => acc + curr.metric, 0);
        return sum / currentListWithData.length;
    }, [currentListWithData]);

    // 6. Prepare Chart Data
    const chartConfig = useMemo(() => {
        const metricLabel = timeRange === 'daily' ? 'Minutes' : 'Hours';

        // Case A: Company Tab
        if (activeTab === "company") {
            return {
                type: "line",
                data: companyData.data,
                title: `Company Overall Performance (${timeRange})`,
                yLabel: metricLabel
            };
        }

        // Case B: Person Selected
        if (selectedPerson) {
            return {
                type: "line",
                data: selectedPerson.data,
                title: `${selectedPerson.name}'s Performance (${timeRange})`,
                yLabel: metricLabel
            };
        }

        // Case C: Overview (Managers/Employees)
        return {
            type: "bar",
            data: currentListWithData.map(p => ({
                label: p.name.split(" ")[0],
                value: p.metric,
                full: p
            })),
            title: `${activeTab === "managers" ? "Manager" : "Employee"} ${timeRange === 'daily' ? 'Total' : 'Avg'} Hours Comparison`,
            yLabel: 'Hours'
        };
    }, [activeTab, selectedPerson, currentListWithData, companyData, timeRange]);

    // 7. Determine Display Values for Stat Cards
    const displayValue = useMemo(() => {
        if (activeTab === "company") return companyData.metric.toFixed(1);
        if (selectedPerson) return selectedPerson.metric.toFixed(1);
        return groupMetric.toFixed(1);
    }, [activeTab, selectedPerson, groupMetric, companyData]);

    const displayLabel = useMemo(() => {
        if (activeTab === "company") return "Company Average";
        if (selectedPerson) return `${selectedPerson.name.split(' ')[0]}'s Average`;
        return `${activeTab === "managers" ? "Managers" : "Employees"} Average`;
    }, [activeTab, selectedPerson]);

    const displaySubLabel = useMemo(() => {
        if (timeRange === 'daily') return "Total Hours Today";
        return "Avg Daily Hours";
    }, [timeRange]);


    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm z-10">
                <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-500 mt-1">Real-time performance monitoring</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Time Range Selector */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {["weekly", "monthly", "yearly"].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all uppercase tracking-wider ${timeRange === range
                                        ? "bg-white text-purple-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>

                        {/* Tab Selector */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {["managers", "employees", "company"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setSelectedPersonId(null); }}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                                        ? "bg-white text-purple-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full max-w-6xl mx-auto w-full p-8 flex gap-8">

                    {/* Left Sidebar: List (Only for Managers/Employees) */}
                    {activeTab !== "company" && (
                        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">
                                    {activeTab === "managers" ? "Managers List" : "Employees List"}
                                </h3>
                                {selectedPersonId && (
                                    <button
                                        onClick={() => setSelectedPersonId(null)}
                                        className="text-xs text-purple-600 hover:underline"
                                    >
                                        View All
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {currentListWithData.map((person) => (
                                    <button
                                        key={person.id}
                                        onClick={() => setSelectedPersonId(person.id === selectedPersonId ? null : person.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${selectedPersonId === person.id
                                            ? "bg-purple-50 border-purple-200 ring-1 ring-purple-200"
                                            : "hover:bg-gray-50 border border-transparent"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedPersonId === person.id ? "bg-purple-200 text-purple-700" : "bg-gray-100 text-gray-500"
                                                }`}>
                                                <FiUser size={14} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${selectedPersonId === person.id ? "text-purple-900" : "text-gray-900"}`}>
                                                    {person.name}
                                                </p>
                                                <p className="text-xs text-gray-500">{person.metric.toFixed(1)} hrs</p>
                                            </div>
                                        </div>
                                        <FiChevronRight className={`text-gray-400 ${selectedPersonId === person.id ? "text-purple-500" : ""}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Right Content: Chart & Details */}
                    <div className={`flex-1 flex flex-col gap-6 ${activeTab === "company" ? "w-full" : ""}`}>

                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard
                                label={displayLabel}
                                value={displayValue}
                                sub={displaySubLabel}
                                icon={<FiClock />}
                                active={true}
                            />
                            <StatCard
                                label="Efficiency"
                                value="94%"
                                sub="vs Target"
                                icon={<FiActivity />}
                            />
                            <StatCard
                                label="Team Size"
                                value={activeTab === "managers" ? "5" : activeTab === "employees" ? "10" : "15"}
                                sub="Active Members"
                                icon={<FiUsers />}
                            />
                        </div>

                        {/* Chart Container */}
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[400px]">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-lg font-bold text-gray-800">{chartConfig.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                    <span>{chartConfig.yLabel || 'Work Hours'}</span>
                                </div>
                            </div>

                            <div className="flex-1 w-full relative">
                                {chartConfig.type === "bar" ? (
                                    <BarChart data={chartConfig.data} />
                                ) : (
                                    <LineChart data={chartConfig.data} />
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const StatCard = ({ label, value, sub, icon, active }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
            <p className={`text-xs mt-1 ${active ? "text-green-600" : "text-gray-400"}`}>{sub}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 text-xl">
            {icon}
        </div>
    </div>
);

const BarChart = ({ data }) => {
    // Dynamic Max Value
    const maxVal = Math.max(...data.map(d => d.value)) * 1.1 || 10;

    return (
        <div className="w-full h-full flex items-end justify-between gap-4 px-4 pb-6">
            {data.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="relative w-full flex justify-center items-end h-[85%]">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(item.value / maxVal) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                            className="w-full max-w-[40px] bg-purple-500 rounded-t-md relative group-hover:bg-purple-600 transition-colors"
                        >
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-20">
                                {item.value.toFixed(1)} hrs
                            </div>
                        </motion.div>
                    </div>
                    <span className="mt-3 text-xs font-medium text-gray-500 truncate w-full text-center">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const LineChart = ({ data }) => {
    const height = 300;
    const width = 600;
    const padding = 20;
    // Dynamic Max Value
    const maxVal = Math.max(...data.map(d => d.value)) * 1.2 || 12;

    // Calculate points with padding
    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = (height - padding) - (d.value / maxVal) * (height - padding * 2);
        return `${x},${y}`;
    }).join(" ");

    // Create area path that starts at bottom-left (with padding) and ends at bottom-right (with padding)
    const areaPath = `M${padding},${height - padding} ${points.split(" ").map(p => `L${p}`).join(" ")} L${width - padding},${height - padding} Z`;

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative w-full h-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(p => {
                        const y = padding + p * (height - padding * 2);
                        return (
                            <line
                                key={p}
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                        );
                    })}

                    {/* Area Fill */}
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        d={areaPath}
                        fill="rgb(168 85 247)"
                    />

                    {/* Line */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={`M${points.split(" ")[0]} L${points.replace(/ /g, " L")}`}
                        fill="none"
                        stroke="rgb(168 85 247)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Points */}
                    {data.map((d, i) => {
                        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
                        const y = (height - padding) - (d.value / maxVal) * (height - padding * 2);
                        return (
                            <g key={i} className="group">
                                <circle cx={x} cy={y} r="4" fill="white" stroke="rgb(168 85 247)" strokeWidth="2" className="hover:r-6 transition-all cursor-pointer" />
                                <text x={x} y={y - 15} textAnchor="middle" fontSize="12" fill="#4b5563" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
                                    {d.value.toFixed(1)}h
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>
            {/* X Axis Labels */}
            <div className="flex justify-between mt-2 px-2" style={{ paddingLeft: `${(padding / width) * 100}%`, paddingRight: `${(padding / width) * 100}%` }}>
                {data.map((d, i) => (
                    <span key={i} className="text-xs text-gray-400 text-center" style={{ width: `${100 / data.length}%` }}>{d.label}</span>
                ))}
            </div>
        </div>
    );
};

export default Analytics;
