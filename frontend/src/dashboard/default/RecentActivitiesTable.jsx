import React, { useState, useMemo } from 'react';
import Card from "../card";
import { AiFillUpCircle, AiFillDownCircle } from "react-icons/ai";
import { LuCircleEqual } from "react-icons/lu";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { getIdFromToken } from "../../utils/auth";
import { useInterventionData } from "../../hooks/useInterventionData";

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
    const data = useMemo(() => {
        if (!Array.isArray(rawData)) return [];
        return [...rawData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [rawData]);

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
            cell: info => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>
        }),
        columnHelper.accessor("timestamp", {
            header: "TIMESTAMP",
            cell: info => <p className="text-sm font-bold text-navy-700">{formatDateTime(info.getValue())}</p>
        }),
        columnHelper.accessor("duration", {
            header: "DURATION",
            cell: info => <p className="text-sm font-bold text-navy-700">{formatDuration(info.getValue()) || "-"}</p>
        }),
        columnHelper.accessor("mood_rating", {
            header: "MOOD FLOW",
            cell: (info) => {
                const arr = info.getValue();
                if (!Array.isArray(arr) || arr.length < 2) return "-";
                const diff = arr[1] - arr[0];
                const cls = diff < 0 ? "text-red-500" : diff === 0 ? "text-amber-500" : "text-green-500";
                const Icon = diff > 0 ? AiFillUpCircle : diff < 0 ? AiFillDownCircle : LuCircleEqual;
                return (
                    <div className="flex items-center gap-1">
                        <Icon className={cls} />
                        <span className={`text-sm font-bold ${cls}`}>{Math.abs(diff)}</span>
                    </div>
                );
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

    // If Controlled (Dashboard Mode), show ALL rows. If Widget mode, limit to 5.
    const rowsToDisplay = isControlled ? table.getRowModel().rows : table.getRowModel().rows.slice(0, 5);

    return (
        <Card extra={"col-span-1 w-full h-full p-8 pb-6 sm:overflow-x-auto"}>
            <div className="relative flex items-center justify-between">
                <div className="text-xl font-bold text-navy-700">
                    {isControlled ? "Activity Logs" : "Recent Activities"}
                </div>
            </div>
            <div className={`${isControlled ? "max-h-[400px] overflow-y-auto" : "mt-2 overflow-x-hidden"}`}>
                {loading ?
                    <p className="text-gray-500">Loading...</p>
                    : (
                        <table className="w-full">
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} colSpan={header.colSpan} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                                <div className="items-center justify-between text-sm text-gray-500">
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
                                            <td key={cell.id} className="min-w-[180px] border-white/0 py-3 pr-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
            </div>
        </Card>
    );
};

export default RecentActivitiesTable;