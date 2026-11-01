import React from "react";
import {
  FaFacebookF,
  FaTelegram,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa6";
import logo from "../../assets/logo.jfif";

const Footer = () => {
  const socials = [
    {
      name: "Facebook",
      icon: <FaFacebookF className="w-5 h-5" />,
      url: "https://facebook.com",
      brandClass:
        "bg-[#1877F2] text-white shadow-[0_4px_10px_rgba(24,119,242,0.25)] hover:shadow-[0_6px_20px_rgba(24,119,242,0.45)]",
    },
    {
      name: "Telegram",
      icon: <FaTelegram className="w-5 h-5" />,
      url: "https://t.me",
      brandClass:
        "bg-[#26A5E4] text-white shadow-[0_4px_10px_rgba(38,165,228,0.25)] hover:shadow-[0_6px_20px_rgba(38,165,228,0.45)]",
    },
    {
      name: "TikTok",
      icon: <FaTiktok className="w-5 h-5" />,
      url: "https://tiktok.com",
      brandClass:
        "bg-[#000000] text-white shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)]",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="w-5 h-5" />,
      url: "https://instagram.com",
      brandClass:
        "bg-gradient-to-tr from-[#fdf497] via-[#fd5949] to-[#285aec] text-white shadow-[0_4px_10px_rgba(214,36,159,0.25)] hover:shadow-[0_6px_20px_rgba(214,36,159,0.45)]",
    },
  ];

  return (
    <footer className="shadow-2xl pb-2.5 shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
      <hr />
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start px-6 md:px-10 py-8 gap-8 md:gap-0">
        {/* Logo + Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={logo}
              alt="Logo for furniture"
              className="w-8 h-8 rounded-md cursor-pointer"
            />
            <span className="bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-2xl md:text-3xl font-bold text-transparent cursor-pointer tracking-tight">
              Kidus Furniture
            </span>
          </div>

          <p className="flex flex-col space-y-1 font-bold text-gray-700">
            <span>Kidus Furniture System</span>
            <span>Manufacturing and</span>
            <span>Selling Furniture products</span>
            <span>For Customers Anywhere</span>
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start font-semibold">
          <h3 className="font-bold text-xl md:text-2xl mb-4">Quick Links</h3>
          <ul className="space-y-2 text-center md:text-left">
            <li className="hover:text-blue-600 transition-colors">
              <a href="#">Products</a>
            </li>
            <li className="hover:text-blue-600 transition-colors">
              <a href="#">Orders</a>
            </li>
            <li className="hover:text-blue-600 transition-colors">
              <a href="#">About</a>
            </li>
            <li className="hover:text-blue-600 transition-colors">
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold text-xl md:text-2xl mb-4 text-center md:text-left">
            Social Links
          </h3>
          <div className="flex justify-center md:justify-start gap-4">
            {socials.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow our official page on ${item.name}`}
                className={`
                  inline-flex items-center justify-center 
                  w-11 h-11 rounded-full 
                  transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
                  hover:-translate-y-1.5
                  ${item.brandClass}
                `}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 md:px-10 border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center my-3 font-semibold text-center md:text-left gap-4">
        <p>&copy; 2026 Kidus Furniture. All rights reserved.</p>
        <p className="text-blue-600 flex flex-row justify-center md:justify-between items-center">
          <span className="mr-2 cursor-pointer hover:underline">Privacy Policy</span>
          |
          <span className="ml-2 cursor-pointer hover:underline">Terms of Use</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;