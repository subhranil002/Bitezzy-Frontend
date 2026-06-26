import {
  FaArrowRight,
  FaGithub,
  FaHeart,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import { LOGO_TEXT_URL, LOGO_URL } from "../constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-linear-to-br from-orange-50 via-white to-amber-50 border-t border-orange-100">
      {/* Top Wave/Gradient Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-linear-to-b from-orange-400/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-6 relative z-10">
        {/* 1. Header & Brand Statement */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <Link to="/" className="inline-block mb-6 group">
              <div className="w-50 h-16 rounded-4xl flex items-center justify-center gap-1 px-5 shadow-lg bg-white border border-orange-100 overflow-hidden">
                <img
                  src={LOGO_URL}
                  alt="Bitezzy Logo"
                  className="h-14 w-auto object-contain flex-shrink-0"
                />

                <img
                  src={LOGO_TEXT_URL}
                  alt="Bitezzy Logo Text"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 leading-[1.1] tracking-tight">
              Discover. Cook. <br />
              <span className="font-bold bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Impress. Repeat.
              </span>
            </h2>
          </div>

          {/* Socials - Architectural layout */}
          <div className="flex gap-3 lg:pb-2">
            {[
              { icon: FaTwitter, label: "Twitter", href: "#" },
              { icon: FaInstagram, label: "Instagram", href: "#" },
              { icon: FaGithub, label: "GitHub", href: "#" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                aria-label={social.label}
                className="group relative flex items-center justify-center w-12 h-12 rounded-full border border-orange-200 bg-white/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
              >
                <div className="absolute inset-0 bg-linear-to-tr from-orange-500 to-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <social.icon className="w-4 h-4 text-gray-600 relative z-10 group-hover:text-white transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>

        {/* 2. Navigation Grid - Clean editorial lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 border-y border-orange-900/10 py-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-4">
              Navigation
            </h3>
            <nav className="flex flex-col">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Our Team", path: "/our-team" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="group flex items-center justify-between py-2.5 border-b border-orange-900/5 hover:border-orange-500 transition-colors duration-300"
                >
                  <span className="text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {link.name}
                  </span>
                  <FaArrowRight className="text-orange-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out text-sm" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-4">
              Resources
            </h3>
            <nav className="flex flex-col">
              {[
                { name: "Documentation", path: "/docs" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Contact Us", path: "/contact" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="group flex items-center justify-between py-2.5 border-b border-orange-900/5 hover:border-orange-500 transition-colors duration-300"
                >
                  <span className="text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {link.name}
                  </span>
                  <FaArrowRight className="text-orange-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out text-sm" />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* 3. Bottom Layer - Giant Watermark & Copyright */}
        <div className="relative mt-8 flex items-center justify-center overflow-hidden h-24 md:h-32 rounded-2xl bg-white/30 backdrop-blur-md border border-white/50">
          {/* Massive Background Text */}
          <h1 className="absolute text-[14vw] md:text-[10vw] font-black leading-none text-orange-900/5 select-none pointer-events-none tracking-tighter">
            BITEZZY
          </h1>

          {/* Copyright Info overlaid */}
          <div className="absolute bottom-4 left-0 right-0 px-6 flex flex-col md:flex-row items-center justify-between gap-3 w-full">
            <p className="text-xs font-semibold text-gray-500 tracking-wide">
              © {currentYear} BITEZZY .
            </p>
            <p className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              Crafted with{" "}
              <FaHeart className="w-3 h-3 text-red-500 animate-pulse" /> for
              food lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
