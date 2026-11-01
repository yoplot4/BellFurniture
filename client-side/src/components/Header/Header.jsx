import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Imports modern hamburger and close icons
import logo from "../../assets/logo.jfif";

const Header = () => {
	// State to track if mobile menu is open
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="w-full bg-white shadow-sm font-arial relative">
			{/* Desktop & Main Bar Container */}
			<div className="max-w-7xl mx-auto px-6 py-4 flex flex-row justify-between items-center">
				{/* Left Side: Logo */}
				<div className="flex items-center">
					<img
						src={logo}
						alt="logo"
						className="w-12 h-12 object-contain rounded-lg"
					/>
					<span className="bg-linear-to-r from-pink-500 to-indigo-500 bg-clip-text text-4xl font-bold text-transparent">
						Kidus Furniture
					</span>
				</div>
				<div className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
					<a
						href="#"
						className="relative py-2 hover:text-blue-600 transition duration-300 group text-2xl"
					>
						Home
						{/* 💡 Hover line overlay */}
						<span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
					</a>

					<a
						href="#"
						className="relative py-2 hover:text-blue-600 transition duration-300 group"
					>
						Products
						<span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
					</a>

					<a
						href="#"
						className="relative py-2 hover:text-blue-600 transition duration-300 group"
					>
						About Us
						<span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
				</div>

				{/* Right Side: Auth buttons (Desktop Only) */}
				<div className="hidden md:flex items-center space-x-4">
					<button className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer">
						Login
					</button>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition cursor-pointer">
						Sign Up
					</button>
				</div>

				{/* Hamburger Toggle Button (Visible only on mobile screens 'md:hidden') */}
				<div className="md:hidden flex items-center">
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="text-gray-600 hover:text-blue-600 focus:outline-none"
						aria-label="Toggle Menu"
					>
						{/* If isOpen is true, show X (Close icon), else show Menu (Hamburger icon) */}
						{isOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>
			</div>

			{/* Mobile-Only Dropdown Drawer (Controlled by state) */}
			{isOpen && (
				<div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50 md:hidden animate-fadeIn">
					<div className="flex flex-col p-6 space-y-4 font-medium text-gray-600">
						<a
							href="#"
							className="hover:text-blue-600 py-2 border-b border-gray-50"
						>
							Home
						</a>
						<a
							href="#"
							className="hover:text-blue-600 py-2 border-b border-gray-50"
						>
							Products
						</a>
						<a
							href="#"
							className="hover:text-blue-600 py-2 border-b border-gray-50"
						>
							About Us
						</a>

						{/* Mobile Auth Buttons */}
						<div className="flex flex-col space-y-2 pt-4">
							<button className="w-full text-center py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-50">
								Login
							</button>
							<button className="w-full text-center py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
								Sign Up
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Header;
