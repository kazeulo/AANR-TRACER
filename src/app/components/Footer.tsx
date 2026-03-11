import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      {/* Wave from page into footer */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block w-full bg-[var(--color-bg)] -mb-px"
      >
        <path fill="var(--color-primary)" d="M0,30 C360,0 1080,60 1440,20 L1440,60 L0,60 Z" />
      </svg>

      <footer className="bg-[var(--color-primary)] text-white font-[var(--font-body)]">
        <div className="max-w-[1370px] mx-auto px-6 lg:px-[6vw]">

          {/* Brand + socials */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 py-12 border-b border-white/[0.07]">

            <div className="max-w-sm">
              <div className="font-['DM_Serif_Display'] text-[32px] leading-none tracking-tight mb-3">
                AANR-<span className="text-[var(--color-accent)] italic">TRACER</span>
              </div>
              <p className="text-[13px] text-[var(--color-text-muted)] font-light leading-relaxed max-w-xs">
                Technology Readiness Assessment for Commercialization Enhancement and Roadmapping — supporting AANR innovations from research to market.
              </p>
              <div className="inline-flex items-center gap-1.5 mt-5 text-[10px] font-bold tracking-[2px] uppercase text-[var(--color-accent)] px-3 py-1.5 border border-[#4aa35a]/25 rounded-full bg-[var(--color-accent)]/[0.07]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                PCAARRD · DOST
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5 items-center">
              {[
                { href: "https://facebook.com",  Icon: Facebook,  label: "Facebook"  },
                { href: "https://twitter.com",   Icon: Twitter,   label: "Twitter"   },
                { href: "https://instagram.com", Icon: Instagram, label: "Instagram" },
                { href: "https://linkedin.com",  Icon: Linkedin,  label: "LinkedIn"  },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-[38px] h-[38px] rounded-[10px] bg-[var(--color-bg-card)]/[0.05] border border-white/[0.07] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-accent)]/15 hover:border-[#4aa35a]/30 hover:text-[var(--color-accent)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-12 border-b border-white/[0.07]">

            {/* Quick Links */}
            <div>
              <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--color-accent)] mb-5 pb-3 border-b border-[#4aa35a]/20">
                Quick Links
              </div>
              {[
                { href: "/",      label: "Home" },
                { href: "/about", label: "About" },
                { href: "/terms", label: "Terms and Definitions" },
                { href: "/faq",   label: "FAQ" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="block text-[13px] text-[var(--color-text-muted)] font-light mb-2.5 hover:text-white transition-colors w-fit">
                  {label}
                </Link>
              ))}
            </div>

            {/* Resources */}
            <div>
              <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--color-accent)] mb-5 pb-3 border-b border-[#4aa35a]/20">
                Resources
              </div>
              <a
                href="https://drive.google.com/file/d/1baQGFaAyWe0yONORw3aArAEctstu1kHi/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-[var(--color-text-muted)] font-light mb-2.5 hover:text-white transition-colors w-fit"
              >
                User Guide
              </a>
              <Link href="/privacy" className="block text-[13px] text-[var(--color-text-muted)] font-light mb-2.5 hover:text-white transition-colors w-fit">
                Data Privacy Statement
              </Link>
              <Link href="/support" className="block text-[13px] text-[var(--color-text-muted)] font-light mb-2.5 hover:text-white transition-colors w-fit">
                Support
              </Link>
            </div>

            {/* Contact */}
            <div>
              <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--color-accent)] mb-5 pb-3 border-b border-[#4aa35a]/20">
                Contact
              </div>

              <a href="ttbdo.upvisayas@up.edu.ph" className="flex items-start gap-2.5 text-[13px] text-[var(--color-text-muted)] font-light mb-3.5 hover:text-white transition-colors">
                <span className="w-[30px] h-[30px] bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center text-[var(--color-accent)] flex-shrink-0">
                  <Mail size={14} />
                </span>
                ttbdo.upvisayas@up.edu.ph
              </a>

              <a className="flex items-start gap-2.5 text-[13px] text-[var(--color-text-muted)] font-light mb-3.5 hover:text-white transition-colors">
                <span className="w-[30px] h-[30px] bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center text-[var(--color-accent)] flex-shrink-0">
                  <Phone size={14} />
                </span>
                09054439916
              </a>

              {/* <a
                href="https://www.google.com/maps/place/DOST+PCAARRD"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-[13px] text-[var(--color-text-muted)] font-light hover:text-white transition-colors"
              >
                <span className="w-[30px] h-[30px] bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center text-[var(--color-accent)] flex-shrink-0 mt-0.5">
                  <MapPin size={14} />
                </span>
                <span>DOST PCAARRD<br />Jamboree Rd, Los Baños, Laguna</span>
              </a> */}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 py-6">
            <p className="text-[12px] text-[#3d5c47] font-light">
              © {new Date().getFullYear()} AANR-TRACER 
            </p>
            <div className="flex gap-5">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms",   label: "Terms" },
                { href: "/support", label: "Support" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-[12px] text-[#3d5c47] hover:text-[var(--color-text-muted)] transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}