import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from "../card";
import { AiFillUpCircle, AiFillDownCircle } from "react-icons/ai";
import EqualIcon from "../../icons/EqualIcon";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { getIdFromToken } from "../../utils/auth";

const columnHelper = createColumnHelper();

export default function RecentActivitiesTable() {
	const userId = getIdFromToken();
	const [sorting, setSorting] = useState([]);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// --- 1. UPDATED DATE FORMATTING ---
	const formatDateTime = (ts) => {
		if (!ts) return "";
		const d = new Date(ts);
		if (isNaN(d)) return String(ts);

		// Get Date parts: YYYY-MM-DD
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');

		// Get Time parts: h.mm am/pm
		let hours = d.getHours();
		const minutes = String(d.getMinutes()).padStart(2, '0');
		const ampm = hours >= 12 ? 'pm' : 'am';

		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'

		return `${month}/${day}, ${hours}:${minutes} ${ampm}`;
	};

	const formatDuration = (val) => {
		if (!val) return "-";

		// Handle object format (some DB drivers return { minutes: 30 })
		if (typeof val === 'object' && val !== null) {
			const parts = [];
			if (val.hours) parts.push(`${val.hours}hr`);
			if (val.minutes) parts.push(`${val.minutes}mins`);
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
				if (m > 0) result.push(`${m}mins`);
				if (s > 0) result.push(`${s}s`);

				return result.join(' ') || "0s";
			}
		}

		// Handle "X minutes" string format fallback
		return str.replace('minutes', 'mins').replace('minute', 'min').replace('seconds', 's');
	};

	// compute mood flow and color class
	const moodFlowInfo = (arr) => {
		if (!Array.isArray(arr) || arr.length < 2) return { value: null, cls: "text-gray-500" };
		const diff = arr[1] - arr[0];
		const cls = diff < 0 ? "text-red-500" : diff === 0 ? "text-amber-500" : "text-green-500";
		return { value: diff, cls };
	};

	const fetchTable = async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem('token');
			const res = await axios.get(`/api/intervention/${userId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			const payload = res?.data ?? [];
			const rows = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
			rows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
			setData(rows);
		} catch (e) {
			console.error("Failed to fetch intervention logs", e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTable();
	}, [userId]);

	const columns = [
		columnHelper.accessor("intervention_type", {
			id: "intervention_type",
			header: () => <p className="text-sm font-bold text-gray-600">ACTIVITY</p>,
			cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
		}),
		columnHelper.accessor("timestamp", {
			id: "timestamp",
			header: () => <p className="text-sm font-bold text-gray-600">TIMESTAMP</p>,
			cell: (info) => <p className="text-sm font-bold text-navy-700">{formatDateTime(info.getValue())}</p>,
		}),
		columnHelper.accessor("duration", {
			id: "duration",
			header: () => <p className="text-sm font-bold text-gray-600">DURATION</p>,
			cell: (info) => <p className="text-sm font-bold text-navy-700">{formatDuration(info.getValue())}</p>,
		}),
		columnHelper.accessor("mood_rating", {
			id: "mood_flow",
			header: () => <p className="text-sm font-bold text-gray-600">MOOD FLOW</p>,
			cell: (info) => {
				const arr = info.getValue();
				const { value, cls } = moodFlowInfo(arr);
				return (
					<div className="flex items-center">
						{/* Icons use original value to determine direction */}
						{value > 0 ? (
							<AiFillUpCircle className={"me-1 " + cls} />
						) : value < 0 ? (
							<AiFillDownCircle className={"me-1 " + cls} />
						) : (
							<div className="me-1">
								<EqualIcon />
							</div>
						)}

						{/* --- 2. UPDATED TEXT DISPLAY (Math.abs) --- */}
						<p className={`text-sm font-bold ${cls}`}>
							{value !== null ? Math.abs(value) : "-"}
						</p>
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

	return (
		<Card extra="col-span-2 rounded-[20px] p-3 sm:overflow-x-auto">
			<div className="flex flex-row justify-between px-3 pt-2">
				<div>
					<h4 className="text-lg font-bold text-navy-700">
						My Recent Activities
					</h4>
				</div>
			</div>

			<div className="mt-8 overflow-x-hidden px-3">
				{loading ? (
					<p className="text-gray-500">Loading...</p>
				) : error ? (
					<p className="text-red-500">Failed to load activities</p>
				) : (
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
						<tbody className="overflow-y-auto">
							{table.getRowModel().rows.slice(0, 6).map((row) => (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="min-w-[130px] border-white/0 py-3 pr-4">
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
}