import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="text-white"
      style={{ background: "var(--bg-gradient-darker)" }}
    >
      <div className="max-w-8xl mx-auto px-6 lg:px-20 py-12">

        {/* Brand Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold pb-4">
            <span className="text-[var(--tertiary-color)]">AANR</span>
            <span className="text-white"> TRACER</span>
          </h2>
          <p className="text-sm text-gray-200 max-w-md">
            Technology Readiness Assessment for Commercialization Enhancement
            and Roadmapping
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <Link href="/" className="footer-link">Home</Link>
            <Link href="/terms" className="footer-link">
              Terms and Definitions
            </Link>
            <Link href="/about" className="footer-link">About</Link>
            <Link href="/faq" className="footer-link">FAQ</Link>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Resources</h3>
            <Link 
              href="https://drive.google.com/file/d/1baQGFaAyWe0yONORw3aArAEctstu1kHi/view?usp=drive_link" 
              className="footer-link">
                User Guide
              </Link>
            <Link href="/documentation" className="footer-link">
              Documentation
            </Link>
            <Link href="/support" className="footer-link">Support</Link>
          </div>

          {/* Contact / Location */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold mb-2">Contact</h3>

            <a
              href="mailto:aanrtracer@example.com"
              className="flex items-center gap-2 footer-link"
            >
              <Mail size={16} />
              aanrtracer@example.com
            </a>

            <a
              href="tel:+639123456789"
              className="flex items-center gap-2 footer-link"
            >
              <Phone size={16} />
              +63 912 345 6789
            </a>

            <a
              href="https://www.google.com/maps/place/DOST+PCAARRD,+Jamboree+Rd,+Los+Ba%C3%B1os,+Laguna"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm text-gray-300 hover:text-[var(--tertiary-color)] transition-colors duration-300"
            >
              <MapPin size={16} className="mt-1" />
              <span>
                DOST PCAARRD <br />
                Jamboree Rd, Los Baños, Laguna
              </span>
            </a>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold mb-2">Follow Us</h3>

            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon hover:text-blue-500"
              >
                <Facebook size={20} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon hover:text-sky-400"
              >
                <Twitter size={20} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon hover:text-pink-500"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon hover:text-blue-400"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 gap-2">
          <p>© {new Date().getFullYear()} AANR TRACER</p>
        </div>
      </div>
    </footer>
  );
}