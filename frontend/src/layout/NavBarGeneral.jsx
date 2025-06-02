import "bootstrap/dist/js/bootstrap.bundle";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navBar.css";

const NavBarGeneral = () => {
	const location = useLocation();
	// const [activeItem, setActiveItem] = useState("Rent");
	const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

	// useEffect(() => {
	// 	const determineActiveItem = () => {
	// 		const path = location.pathname;
	// 		if (path.includes("/condo")) {
	// 			return "Condo";
	// 		} else if (path.includes("/commercial")) {
	// 			return "Commercial";
	// 		} else {
	// 			return "Rent";
	// 		}
	// 	};

	// 	setActiveItem(determineActiveItem());
	// }, [location]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 992);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// const handleItemClick = (itemName) => {
	// 	setActiveItem(itemName);
	// };

	return (
		<div className="navbarContainer">
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<Link to="/" className="navbar-logo-container text-decoration-none">
						<img
							src="/Images/logo.png"
							alt="Logo"
							height="60"
						/>
						{!isMobile && <span className="nav-title">Well-Bot</span>}
					</Link>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
						<ul className="navbar-nav">
							<li className="nav-item">
								<Link className="nav-link" to="/login">
									Login
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/registerRole">
									Register
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default NavBarGeneral;