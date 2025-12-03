import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardMenu from "../card/CardMenu";
import Card from "../card";
import Progress from "../progress";
import { MdCancel, MdCheckCircle, MdOutlineError } from "react-icons/md";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { getIdFromToken } from "../../utils/auth";

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ComplexTable() {
	const userId = getIdFromToken();
	const [sorting, setSorting] = useState([]);
	// single array state for rows
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// helper to format timestamp
	const formatDateTime = (ts) => {
		if (!ts) return "";
		const d = new Date(ts);
		if (isNaN(d)) return String(ts);
		return d.toLocaleString();
	};

	// compute mood flow and color class
	const moodFlowInfo = (arr) => {
		if (!Array.isArray(arr) || arr.length < 2) return { value: null, cls: "text-gray-500" };
		const diff = arr[1] - arr[0];
		const cls = diff < 0 ? "text-red-500" : diff === 0 ? "text-amber-500" : "text-green-500";
		return { value: diff, cls };
	};

	// fetch intervention logs for the current user, sort by timestamp desc
	const fetchTable = async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem('token');
			// backend route is defined as /api/intervention_logs/:userId
			const res = await axios.get(`/api/intervention_logs/${encodeURIComponent(userId)}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			// support either { data: [...] } or [...] shape
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
		// 1) intervention type
		columnHelper.accessor("intervention_type", {
			id: "intervention_type",
			header: () => <p className="text-sm font-bold text-gray-600">ACTIVITY</p>,
			cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
		}),
		// 2) timestamp formatted
		columnHelper.accessor("timestamp", {
			id: "timestamp",
			header: () => <p className="text-sm font-bold text-gray-600">TIMESTAMP</p>,
			cell: (info) => <p className="text-sm font-bold text-navy-700">{formatDateTime(info.getValue())}</p>,
		}),
		// 3) duration
		columnHelper.accessor("duration", {
			id: "duration",
			header: () => <p className="text-sm font-bold text-gray-600">DURATION</p>,
			cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue() ? String(info.getValue()) : "-"}</p>,
		}),
		// 4) mood flow computed from mood_rating array [a, b] => b - a
		columnHelper.accessor("mood_rating", {
			id: "mood_flow",
			header: () => <p className="text-sm font-bold text-gray-600">MOOD FLOW</p>,
			cell: (info) => {
				const arr = info.getValue();
				const { value, cls } = moodFlowInfo(arr);
				return (
					<div className="flex items-center">
						{value > 0 ? <MdCheckCircle className={"me-1 " + cls} /> : value < 0 ? <MdCancel className={"me-1 " + cls} /> : <MdOutlineError className={"me-1 " + cls} />}
						<p className={`text-sm font-bold ${cls}`}>{value !== null ? value : "-"}</p>
					</div>
				);
			},
		}),
	]; // eslint-disable-next-line
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		// debugTable: true,
	});
	return (
		<Card extra={"col-span-2 w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
			<div className="relative flex items-center justify-between pt-4">
				<div className="text-xl font-bold text-navy-700">
					My Recent Activities
				</div>
			</div>

			<div className="mt-8 doverflow-x-hidden">
				{loading ? (
					<p className="text-gray-500">Loading...</p>
				) : error ? (
					<p className="text-red-500">Failed to load activities</p>
				) : (
					<>
						<table className="w-full">
							<thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id} className="!border-px !border-gray-400">
										{headerGroup.headers.map((header) => {
											return (
												<th
													key={header.id}
													colSpan={header.colSpan}
													onClick={header.column.getToggleSortingHandler()}
													className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
												>
													<div className="items-center justify-between text-xs text-gray-200">
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{{
															asc: "",
															desc: "",
														}[header.column.getIsSorted()] ?? null}
													</div>
												</th>
											);
										})}
									</tr>
								))}
							</thead>
							<tbody>
								{table
									.getRowModel()
									.rows.slice(0, 5)
									.map((row) => {
										return (
											<tr key={row.id}>
												{row.getVisibleCells().map((cell) => {
													return (
														<td
															key={cell.id}
															className="min-w-[150px] border-white/0 py-3  pr-4"
														>
															{flexRender(
																cell.column.columnDef.cell,
																cell.getContext()
															)}
														</td>
													);
												})}
											</tr>
										);
									})}
							</tbody>
						</table>
					</>
				)}
			</div>
		</Card>
	);
}
