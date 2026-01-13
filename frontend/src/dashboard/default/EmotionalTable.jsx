import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineLoading } from "react-icons/ai";
import Card from "../card";
import HoverTooltip from "../../components/HoverTooltip";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { getIdFromToken } from "../../utils/auth";
import { useSocketSubscription } from "../../hooks/useSocket";

const columnHelper = createColumnHelper();

const EmotionalTable = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
    const userId = propUserId || getIdFromToken();
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
            case "happy": return "#FFD56B";
            case "angry": return "#EA5E8F";
            case "sad": return "#69D5C5";
            case "fear": return "#519AF6";
            default: return "navy-700";
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
            rows.sort((a, b) => new Date(b.ts) - new Date(a.ts));
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

    useSocketSubscription(['emotional_log'], fetchTable);

    // --- Columns ---
    const columns = [
        columnHelper.accessor("ts", {
            id: "ts",
            header: () => <p className="text-sm font-bold text-gray-400">TIMESTAMP</p>,
            cell: (info) => <p className="text-sm font-medium text-navy-700">{formatDateTime(info.getValue())}</p>,
        }),
        columnHelper.accessor("emotion_label", {
            id: "emotion_label",
            header: () => <p className="text-sm font-bold text-gray-400">EMOTION</p>,
            cell: (info) => {
                const val = info.getValue();
                return <div className="flex items-center gap-2 text-sm font-medium"><span className={`w-3 h-3 rounded-full bg-[${getEmotionColor(val)}]`}></span> {val}</div>;
            },
        }),
        columnHelper.accessor("emotional_score", {
            id: "emotional_score",
            header: () => <p className="text-sm font-bold text-gray-400">MOOD SCORE</p>,
            cell: (info) => <p className="text-sm font-medium text-navy-700">{info.getValue() != null ? `${info.getValue()}%` : "-"}</p>,
        }),
    ];

    if (propUserId) {
        columns.push(
            columnHelper.accessor("confidence_score", {
                id: "confidence_score",
                header: () => <p className="text-sm font-bold text-gray-400">CONFIDENCE</p>,
                cell: (info) => {
                    const val = info.getValue();
                    const display = val !== null && val !== undefined ? Math.round(val * 100) + "%" : "-";
                    return <p className="text-sm font-medium text-navy-700">{display}</p>;
                },
            }),
        )
    }

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    return (
        <Card extra={"col-span-2 w-full h-full p-8 pb-6 sm:overflow-x-auto"}>
            <div className="relative flex items-center justify-between">
                <div className="text-lg font-bold text-navy-700">
                    <HoverTooltip content="Detailed log of all emotional records">
                        Emotional Records
                    </HoverTooltip>
                </div>
            </div>

            <div className="mt-2 overflow-x-hidden px-3">
                {loading ? (
                    <div className="flex h-[200px] w-full items-center justify-center">
                        <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
                    </div>
                ) : error ? (
                    <div className="flex h-[200px] w-full items-center justify-center flex-col">
                        <p className="text-gray-500 mb-2">No records found for this period</p>
                        <button onClick={fetchTable} className="text-xs underline text-[#3E9389]">Retry</button>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex h-[220px] w-full items-center justify-center">
                        <p className="text-gray-500 text-center py-4">No records found for this period.</p>
                    </div>
                ) : (
                    <div className="max-h-[330px] overflow-y-auto">
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
                                                className="min-w-[150px] border-white/0 py-2 pr-4"
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
            {/* Pagination Controls */}
            {data.length > 0 && (
                <div className="flex items-center justify-center gap-2 px-4 pt-3">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className={`p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-35 disabled:hover:bg-white transition-colors ${!table.getCanPreviousPage() ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        <MdChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: table.getPageCount() }).map((_, idx) => {
                            const currentPage = table.getState().pagination.pageIndex;
                            if (
                                table.getPageCount() > 7 &&
                                idx !== 0 &&
                                idx !== table.getPageCount() - 1 &&
                                (idx < currentPage - 1 || idx > currentPage + 1)
                            ) {
                                if (idx === currentPage - 2 || idx === currentPage + 2) {
                                    return <span key={idx} className="text-gray-400">...</span>;
                                }
                                return null;
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => table.setPageIndex(idx)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm font-medium transition-colors
                                        ${currentPage === idx
                                            ? 'bg-[#3E9389] border-[#3E9389] text-white hover:bg-[#88BFB9]'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className={`p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-35 disabled:hover:bg-white transition-colors ${!table.getCanNextPage() ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        <MdChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}

        </Card >
    );
};

export default EmotionalTable;