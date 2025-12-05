import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from "../card";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { getIdFromToken } from "../../utils/auth";

const columnHelper = createColumnHelper();

const EmotionalTable = ({ startDate: propStartDate, endDate: propEndDate }) => {
    const userId = getIdFromToken();
    const isControlled = propStartDate !== undefined && propEndDate !== undefined;

    // --- State ---
    const [sorting, setSorting] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Internal Date State (Only used if not controlled)
    const [dateRange, setDateRange] = useState({
        start: isControlled ? propStartDate : null,
        end: isControlled ? propEndDate : null
    });

    // --- Sync Props to State in Controlled Mode ---
    useEffect(() => {
        if (isControlled) {
            setDateRange({ start: propStartDate, end: propEndDate });
        }
    }, [propStartDate, propEndDate, isControlled]);

    // --- Helpers ---
    const formatDateTime = (ts) => {
        if (!ts) return "";
        const d = new Date(ts);
        if (isNaN(d)) return String(ts);
        return d.toLocaleDateString("en-GB", { year: 'numeric', month: '2-digit', day: '2-digit' }) + ", " +
            d.toLocaleTimeString("en-GB", { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // FIX: Helper to format date in local YYYY-MM-DD (prevents timezone shifts)
    const formatLocalDate = (d) => {
        if (!d) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const getEmotionColor = (emotion) => {
        const lower = (emotion || "").toLowerCase();
        switch (lower) {
            case "happy": return "text-[#519AF6]";
            case "sad": return "text-[#69D5C5]";
            case "angry": return "text-[#7E6FEE]";
            case "fear": return "text-[#EA5E8F]";
            default: return "text-navy-700";
        }
    };

    // --- Fetching ---
    const fetchTable = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            let url = `/api/emotion/getLogs/${userId}`;

            // Append Query Params using the Safe Local Formatter
            if (dateRange.start && dateRange.end) {
                const startStr = formatLocalDate(dateRange.start);
                const endStr = formatLocalDate(dateRange.end);
                url += `?startDate=${startStr}&endDate=${endStr}`;
            }

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const payload = res?.data?.data || res?.data || [];
            const rows = Array.isArray(payload) ? payload : [];

            // Sort by timestamp desc
            rows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setData(rows);
        } catch (e) {
            console.error("Failed to fetch emotional logs", e);
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTable();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, dateRange.start, dateRange.end]);

    // --- Columns ---
    const columns = [
        columnHelper.accessor("timestamp", {
            id: "timestamp",
            header: () => <p className="text-sm font-bold text-gray-600">TIMESTAMP</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{formatDateTime(info.getValue())}</p>,
        }),
        columnHelper.accessor("emotion_label", {
            id: "emotion_label",
            header: () => <p className="text-sm font-bold text-gray-600">EMOTION</p>,
            cell: (info) => {
                const val = info.getValue();
                return <p className={`text-sm font-bold ${getEmotionColor(val)} capitalize`}>{val}</p>;
            },
        }),
        columnHelper.accessor("emotional_score", {
            id: "emotional_score",
            header: () => <p className="text-sm font-bold text-gray-600">MOOD SCORE</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue() != null ? `${info.getValue()}%` : "-"}</p>,
        }),
        columnHelper.accessor("confidence_score", {
            id: "confidence_score",
            header: () => <p className="text-sm font-bold text-gray-600">CONFIDENCE</p>,
            cell: (info) => {
                const val = info.getValue();
                const display = val !== null && val !== undefined ? Math.round(val * 100) + "%" : "-";
                return <p className="text-sm font-bold text-navy-700">{display}</p>;
            },
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <Card extra={"col-span-2 w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
            <div className="relative flex items-center justify-between pt-4 px-3">
                <div className="text-xl font-bold text-navy-700">
                    Emotional Logs
                </div>
            </div>

            <div className="mt-2 overflow-x-hidden px-3">
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : error ? (
                    <div className="text-center py-4">
                        <p className="text-red-500 mb-2">Failed to load logs</p>
                        <button onClick={fetchTable} className="text-xs underline text-gray-500">Retry</button>
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No records found for this period.</p>
                ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                                            >
                                                <div className="items-center justify-between text-xs text-gray-200">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: " 🔼",
                                                        desc: " 🔽",
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-100">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="min-w-[150px] border-white/0 py-3 pr-4"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default EmotionalTable;