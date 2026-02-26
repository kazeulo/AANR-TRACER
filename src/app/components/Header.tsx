"use client"

import Link from 'next/link';
import { useState } from "react";
import { usePathname } from 'next/navigation';

const links = [
  { href: "/", label: "Home" },
  { href: "/terms", label: "Terms and Definitions" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `transition-colors duration-300 ${pathname === path ? "text-[var(--primary-color)] underline" : "text-[var(--text-color)] hover:text-[var(--primary-color)]"}`;

  return (
    <nav className="bg-white py-6 sm:py-6 max-w-7xl mx-auto w-full">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-[var(--secondary-color)]">AANR</span>
          <span> TRACER</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={`mx-3 ${linkClass(href)}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none text-[var(--text-color)]">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 flex flex-col space-y-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`py-2 border-b border-gray-100 last:border-none ${linkClass(href)}`}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}