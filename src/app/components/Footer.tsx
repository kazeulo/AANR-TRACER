import Link from 'next/link';

export default function Footer() {
return (
<footer className="text-white" style={{ background: 'var(--bg-gradient-darker)' }}>
  <div className="container mx-auto px-20 py-10">

    <div className="container py-5">
        <h2 className="text-4xl font-bold pb-4">
          <span className="text-[var(--tertiary-color)]">AANR</span>
          <span className="text-white"> TRACER</span>
        </h2>
        <p className="text-sm text-gray-200 max-w-md">
          Technology Readiness Assessment for Commercialization Enhancement and Roadmapping
        </p>
    </div>

    {/* Top Section */}
    <div className="flex flex-col md:flex-row justify-between gap-8 py-5">

      {/* Quick Links */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-white mb-1">Quick Links</h3>
        <Link href="/" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">Home</Link>
        <Link href="/terms" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">Terms and Definitions</Link>
        <Link href="/about" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">About</Link>
        <Link href="/faq" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">FAQ</Link>
      </div>

      {/* Resources*/}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-white mb-1">Quick Links</h3>
        <Link href="/" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">Home</Link>
        <Link href="/terms" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">Terms and Definitions</Link>
        <Link href="/about" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">About</Link>
        <Link href="/faq" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">FAQ</Link>
      </div>

        {/* Location */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-white mb-1">Location</h3>
        <Link href="/" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">Home</Link>
        <Link href="/terms" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">Terms and Definitions</Link>
        <Link href="/about" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">About</Link>
        <Link href="/faq" className="text-sm text-gray-200 hover:text-[var(--tertiary-color)] transition-colors duration-300">FAQ</Link>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-white mb-1">Contact</h3>
        <p className="text-sm text-gray-200">Email: aanrtracer@example.com</p>
        <p className="text-sm text-gray-200">Phone: +63 912 345 6789</p>
        <p className="text-sm text-gray-200">Location: Philippines</p>
      </div>

      {/* Follow */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-white mb-1">Follow</h3>
        <p className="text-sm text-gray-200">Email: aanrtracer@example.com</p>
        <p className="text-sm text-gray-200">Phone: +63 912 345 6789</p>
        <p className="text-sm text-gray-200">Location: Philippines</p>
      </div>

    </div>

    {/* Divider */}
    {/* <div className="border-t border-white my-6" /> */}

    {/* Bottom Section */}
    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 gap-2 py-5">
      <p>© {new Date().getFullYear()} AANR TRACER</p>
      {/* <p>Built for Philippine Agriculture & Natural Resources Sector</p> */}
    </div>

  </div>
</footer>
);
}