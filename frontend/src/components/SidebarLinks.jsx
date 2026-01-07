import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import DropdownIcon from "../icons/DropdownIcon";

export function SidebarLinks(props) {
	const location = useLocation();
	const { routes } = props;
	// initialize open state so parent menus open when a child route is active
	const initialOpen = {};
	if (Array.isArray(routes)) {
		routes.forEach((r) => {
			if (Array.isArray(r.children) && r.children.length > 0) {
				initialOpen[r.activeKey] = r.children.some((c) => c.path && location.pathname.startsWith(c.path));
			}
		});
	}
	const [open, setOpen] = useState(initialOpen);

	// Determine user type based on URL
	const isGuardian = location.pathname.startsWith("/guardian");
	const isUser = location.pathname.startsWith("/user");

	// Equivalent to your original activeItem logic (for parent items)
	const getActiveFlag = () => {
		const path = location.pathname;

		if (isGuardian) {
			if (path.includes("monitoredUser")) return "Management";
			if (path.includes("report")) return "Report";
			if (path.includes("profile")) return "Profile";
			return "";
		}

		if (isUser) {
			if (path.includes("dashboard")) return "Dashboard";
			if (path.includes("accessManage")) return "Access";
			if (path.includes("report")) return "Report";
			if (path.includes("profile")) return "Profile";
			return "";
		}

		return "";
	};

	const activeItem = getActiveFlag();

	const toggleOpen = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

	// Create link items
	const createLinks = (routes) => {
		return routes
			.filter((route) => {
				// Show guardian routes ONLY for guardian URLs
				if (isGuardian && route.role === "guardian") return true;
				// Show user routes ONLY for user URLs
				if (isUser && route.role === "user") return true;
				return false;
			})
			.map((route, index) => {
				const isActive = activeItem === route.activeKey;
				const hasChildren = Array.isArray(route.children) && route.children.length > 0;
				const childActiveAny = hasChildren && route.children.some((c) => c.path && location.pathname.startsWith(c.path));
				const parentActive = isActive || childActiveAny;

				// If no children, render as before
				if (!hasChildren) {
					return (
						<Link key={index} to={route.path} style={{ textDecoration: "none" }}
							onClick={async (e) => {
								if (route.logout) {
									e.preventDefault(); // prevent navigation

									const result = await Swal.fire({
										title: "Log Out?",
										text: "Are you sure you want to log out?",
										icon: "warning",
										showCancelButton: true,
										confirmButtonText: "Yes, Log Out",
										cancelButtonText: "Cancel",
										confirmButtonColor: "var(--primary-color)",
										customClass: {
											title: 'swal-title-class-login',
											confirmButton: 'swal-confirm-button-class',
										}
									});

									if (result.isConfirmed) {
										localStorage.removeItem("token");
										window.location.href = route.path; // redirect to "/"
									}
								}
							}}
						>
							<div className="relative mb-3 flex hover:cursor-pointer">
								<li className="my-[3px] flex cursor-pointer items-center px-3">
									<span className={`${parentActive ? "font-light text-[#3E9389]" : "font-bold text-gray-300"}`}>
										{route.icon}
									</span>

									<p className={`leading-1 flex ${parentActive ? "font-light" : "text-gray-300"}`} style={{ paddingLeft: '0.8rem', fontSize: '0.92rem' }}>
										{route.name}
									</p>
								</li>

								{parentActive ? (
									<div className="absolute right-0 top-px h-8 w-1 rounded-lg bg-[#3E9389]" />
								) : null}
							</div>
						</Link>
					);
				}

				// has children: render toggle + submenu
				return (
					<div key={index} className="relative mb-3">
						<div className="w-full">
							<div className="px-3 py-1">
								<button
									type="button"
									onClick={() => toggleOpen(route.activeKey)}
									className="w-full flex items-center justify-between hover:cursor-pointer bg-transparent"
								>
									<div className="w-full flex items-center justify-between">
										<div className="flex items-center">
											<span className={`${parentActive ? "font-light text-[#3E9389]" : "font-bold text-gray-300"}`}>
												{route.icon}
											</span>
											<p className={`leading-1 flex ${parentActive ? "font-light text-500" : "text-gray-300"}`} style={{ paddingLeft: '0.8rem', fontSize: '0.92rem' }}>
												{route.name}
											</p>
										</div>
										<span className={`transform transition-transform ${open[route.activeKey] ? "rotate-180" : ""} scale-75`}>
											<DropdownIcon />
										</span>
									</div>
								</button>

								<div className={`${open[route.activeKey] ? 'block' : 'hidden'} mt-1`} style={{ paddingLeft: '1.95rem' }}>
									{route.children.map((child, ci) => {
										const childActive = child.path && location.pathname.startsWith(child.path);
										return (
											<Link key={ci} to={child.path} style={{ textDecoration: 'none' }}>
												<div className={`py-1 ${childActive ? 'font-light text-300' : 'text-gray-300'}`} style={{ fontSize: '0.85rem' }}>
													{child.name}
												</div>
											</Link>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				);
			});
	};

	return <>{createLinks(routes)}</>;
}

export default SidebarLinks;