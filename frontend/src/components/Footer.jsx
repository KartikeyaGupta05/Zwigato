import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaGithub,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#fff3ee] border-t border-[#ff4d2d]/20 mt-10 pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <h1 className="text-3xl font-bold text-[#ff4d2d]">Zwigato</h1>
          <p className="mt-2 text-gray-600 text-sm leading-relaxed">
            Your favorite food delivered fresh, fast & with love.  
            Experience a modern way of taste.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <a
    href="https://github.com/KartikeyaGupta05/Zwigato"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaFacebook className="text-[#ff4d2d] text-xl cursor-pointer hover:scale-110 transition" />
  </a>

  <a
    href="https://github.com/KartikeyaGupta05/Zwigato"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaInstagram className="text-[#ff4d2d] text-xl cursor-pointer hover:scale-110 transition" />
  </a>

  <a
    href="https://github.com/KartikeyaGupta05/Zwigato"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaTwitter className="text-[#ff4d2d] text-xl cursor-pointer hover:scale-110 transition" />
  </a>

  <a
    href="https://github.com/KartikeyaGupta05/Zwigato"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaYoutube className="text-[#ff4d2d] text-xl cursor-pointer hover:scale-110 transition" />
  </a>

  <a
    href="https://github.com/KartikeyaGupta05/Zwigato"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaGithub className="text-[#ff4d2d] text-xl cursor-pointer hover:scale-110 transition" />
  </a>
  </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Quick Links
          </h2>
          <ul className="text-gray-600 text-sm space-y-2">
            <li onClick={() => navigate("/")} className="cursor-pointer hover:text-[#ff4d2d] transition">Home</li>
            <li onClick={() => navigate("/my-orders")} className="cursor-pointer hover:text-[#ff4d2d] transition">My Orders</li>
            <li onClick={() => navigate("/cart")} className="cursor-pointer hover:text-[#ff4d2d] transition">Cart</li>
            <li className="cursor-pointer hover:text-[#ff4d2d] transition">Offers</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Services</h2>
          <ul className="text-gray-600 text-sm space-y-2">
  <a 
    href="https://github.com/KartikeyaGupta05/Zwigato" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <li>Food Delivery</li>
  </a>

  <a 
    href="https://github.com/KartikeyaGupta05/Zwigato" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <li>Restaurant Partnering</li>
  </a>

  <a 
    href="https://github.com/KartikeyaGupta05/Zwigato" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <li>Delivery Partner Jobs</li>
  </a>

  <a 
    href="https://github.com/KartikeyaGupta05/Zwigato" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <li>Customer Support</li>
  </a>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Contact Us
          </h2>
          <ul className="text-gray-600 text-sm space-y-3">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#ff4d2d]" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="text-[#ff4d2d]" /> support@zwigato.com
            </li>
            <li className="flex items-center gap-2">
              <FaLocationDot className="text-[#ff4d2d]" /> Mathura, Uttar Pradesh, India
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-300 pt-4">
        © {new Date().getFullYear()} <span className="text-[#ff4d2d] font-semibold">Zwigato</span>.  
        All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
