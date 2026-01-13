import React, { useState, useMemo } from 'react';
import Card from "../card";
import { AiFillUpCircle, AiFillDownCircle } from "react-icons/ai";
import { AiOutlineLoading } from "react-icons/ai";
import { LuCircleEqual } from "react-icons/lu";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { getIdFromToken } from "../../utils/auth";
import { useInterventionData } from "../../hooks/useInterventionData";
import HoverTooltip from "../../components/HoverTooltip";

const columnHelper = createColumnHelper();

const RecentActivitiesTable = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
    const userId = propUserId || getIdFromToken();
    const isControlled = propStartDate !== undefined && propEndDate !== undefined;

    // FIX: Memoize the hook arguments to prevent infinite re-renders.
    // 1. 'referenceDate' must be stable (not new Date() every render).
    // 2. 'customRange' object should be stable or its properties stable (hooks check props, but memoizing the object is safer).
    const hookConfig = useMemo(() => ({
        timeRange: isControlled ? "custom" : "all",
        referenceDate: new Date(), // Created once when component mounts
        customRange: isControlled ? { start: propStartDate, end: propEndDate } : null
    }), [isControlled, propStartDate, propEndDate]);

    const { data: rawData, loading } = useInterventionData(
        userId,
        hookConfig.timeRange,
        hookConfig.referenceDate,
        hookConfig.customRange
    );

    const [sorting, setSorting] = useState([]);

    // Sort data by timestamp descending
    // Sort data by timestamp descending
    const sortedData = useMemo(() => {
        if (!Array.isArray(rawData)) return [];
        return [...rawData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [rawData]);

    // If !isControlled (Widget Mode), only take the latest 5 records.
    // This allows sorting to operate *only* on these 5 records.
    const tableData = useMemo(() => {
        if (!isControlled) {
            return sortedData.slice(0, 5);
        }
        return sortedData;
    }, [sortedData, isControlled]);

    // Formatters
    const formatDateTime = (ts) => {
        if (!ts) return "";
        const d = new Date(ts);
        return d.toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: '2-digit' }) + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (val) => {
        if (!val) return "-";

        // Handle object format (some DB drivers return { minutes: 30 })
        if (typeof val === 'object' && val !== null) {
            const parts = [];
            if (val.hours) parts.push(`${val.hours}hr`);
            if (val.minutes) parts.push(`${val.minutes}min`);
            if (val.seconds) parts.push(`${val.seconds}s`);
            return parts.join(' ') || "0s";
        }

        const str = String(val);

        // Handle HH:MM:SS string format (standard Postgres output)
        if (str.includes(':')) {
            const parts = str.split(':');
            if (parts.length === 3) {
                const h = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10);
                const s = parseInt(parts[2], 10);

                const result = [];
                if (h > 0) result.push(`${h}hr`);
                if (m > 0) result.push(`${m}min`);
                if (s > 0) result.push(`${s}s`);

                return result.join(' ') || "0s";
            }
        }

        // Handle "X minutes" string format fallback
        return str.replace('minutes', 'min').replace('minute', 'min').replace('seconds', 's');
    };

    const columns = [
        columnHelper.accessor("intervention_type", {
            header: "ACTIVITY",
            cell: info => <p className="text-sm font-medium text-navy-700">{info.getValue()}</p>
        }),
        columnHelper.accessor("timestamp", {
            header: "TIMESTAMP",
            cell: info => <p className="text-sm font-medium text-navy-700">{formatDateTime(info.getValue())}</p>
        }),
        columnHelper.accessor("duration", {
            header: "DURATION",
            cell: info => <p className="text-sm font-medium text-navy-700">{formatDuration(info.getValue()) || "-"}</p>
        }),
        columnHelper.accessor("mood_rating", {
            header: "MOOD FLOW",
            cell: (info) => {
                const arr = info.getValue();
                let diff = 0; // Default to 0 (Equal/No Change) if null or invalid

                if (Array.isArray(arr) && arr.length >= 2) {
                    diff = arr[1] - arr[0];
                }

                const cls = diff < 0 ? "text-red-500" : diff === 0 ? "text-amber-500" : "text-green-500";
                const Icon = diff > 0 ? AiFillUpCircle : diff < 0 ? AiFillDownCircle : LuCircleEqual;
                return (
                    <div className="flex items-center gap-2">
                        <Icon size={18} className={cls} />
                        <span className={`text-sm font-bold ${cls}`}>{Math.abs(diff)}</span>
                    </div>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: tableData,
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

    // If Controlled (Dashboard Mode), use table rows (paginated). If Widget mode, limit to 5 (manual slice).
    // UPDATE: Now tableData is already limited if !isControlled, so getRowModel is correct for both.
    const rowsToDisplay = table.getRowModel().rows;

    return (
        <Card extra={"col-span-1 w-full h-full p-8 pb-6 sm:overflow-x-auto"}>
            <div className="relative flex items-center justify-between">
                <div className="text-lg font-bold text-navy-700">
                    <HoverTooltip content="Records of wellness activities engaged with Well-bot" placement="right">
                        {isControlled ? "Activity Records" : "Recent Activities"}
                    </HoverTooltip>
                </div>
            </div>
            <div className={`${isControlled ? "max-h-[400px] overflow-y-auto" : "mt-2 overflow-x-hidden"}`}>
                {loading ? (
                    <div className="flex h-[200px] w-full items-center justify-center">
                        <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
                    </div>
                ) : tableData.length === 0 ? (
                    <div className="flex h-[200px] w-full items-center justify-center">
                        <p className="text-gray-500">No records found for this period</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} colSpan={header.colSpan} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                            <div className="items-center justify-between text-sm text-gray-400">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {rowsToDisplay.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="min-w-[180px] border-white/0 py-2 pr-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Pagination Controls (Only if controlled/dashboard mode) */}
            {isControlled && tableData.length > 0 && (
                <div className="flex items-center justify-center gap-2 px-4 pt-3 border-t border-gray-200">
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
                                            ? 'bg-[#3E9389] border-brand-500 text-white hover:bg-[#88BFB9]'
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
            )
            }
        </Card >
    );
};

export default RecentActivitiesTable;