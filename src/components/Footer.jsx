import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#F5F7FA] text-[#333] text-[AlibabaSans] mt-10 border-t border-[#e4e7ee]">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 ">

        {/* Brand Column */}
        <div>
          <h2 className="text-[36px] font-bold text-[#0099CC]">LinkSpark</h2>
          <p className="text-[18px] mt-3 leading-relaxed">
            Connect, collaborate, and grow with real-time chat, video calls, and networking tools.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[24px] font-medium mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/feed" className="hover:text-[#0099CC] transition">Feed</Link></li>
            <li><Link to="/connections" className="hover:text-[#0099CC] transition">Connections</Link></li>
            <li><Link to="/requests" className="hover:text-[#0099CC] transition">Requests</Link></li>
            <li><Link to="/search" className="hover:text-[#0099CC] transition">Search</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[24px] font-medium mb-4">Stay Updated</h3>
          <div className="flex gap-4 mt-4 text-[24px]">
            <a href="#" className="text-[#0099CC] hover:text-[#FF6B6B] transition"><FaGithub /></a>
            <a href="#" className="text-[#0099CC] hover:text-[#FF6B6B] transition"><FaLinkedin /></a>
            <a href="#" className="text-[#0099CC] hover:text-[#FF6B6B] transition"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#FFF] border-t border-[#e4e7ee] py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-[14px]">&copy; {new Date().getFullYear()} LinkSpark. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
