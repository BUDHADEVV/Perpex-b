import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-black via-neutral-900 to-black pt-14 pb-6 mt-16 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    {/* Brand & CTA */}
                    <div className="flex flex-col gap-5">
                        <Link href="#" className="flex items-center gap-2">
                            <img src="/logo.png" alt="PerpeX Logo" className="h-10 w-auto object-contain" />
                        </Link>

                        <p className="text-neutral-300 text-sm max-w-xs">
                            Learning for a new era.<br />
                            Build your career, gain real-world startup experience, and join a vibrant founder community.
                        </p>
                        <Link href="#cta"
                            className="calendly-book-btn mt-2 inline-block rounded-lg font-bold text-lg shadow-xl text-white ring-2 ring-inset px-7 py-3 btn-brand ring-[var(--brand)]/40 hover:ring-0 hover:scale-105 transition-all duration-150">
                            Book Now
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <div className="flex md:justify-center">
                        <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-base">
                            <Link href="#about" className="text-neutral-300 transition hover:text-[var(--brand)]">About</Link>
                            <Link href="#brochure" className="text-neutral-300 transition hover:text-[var(--brand)]">Brochure</Link>
                            <Link href="#bschool" className="text-neutral-300 transition hover:text-[var(--brand)]">B School</Link>
                            <Link href="#experts" className="text-neutral-300 transition hover:text-[var(--brand)]">Experts</Link>
                            <Link href="#pitch" className="text-neutral-300 transition hover:text-[var(--brand)]">Pitch</Link>
                            <Link href="#faq" className="text-neutral-300 transition hover:text-[var(--brand)]">FAQs</Link>
                        </nav>
                    </div>

                    {/* Socials & Contact */}
                    <div className="flex flex-col items-start md:items-end gap-4">
                        <p className="uppercase text-xs tracking-widest text-neutral-400">Connect</p>
                        <div className="flex gap-5">
                            <a href="https://www.instagram.com/perpexbschool/" className="hover:text-[var(--brand)]" aria-label="Instagram">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17" cy="7" r="1.5" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/company/perpex-insights?originalSubdomain=in" className="hover:text-[var(--brand)]" aria-label="LinkedIn">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.98 3.5A2.5 2.5 0 002.5 6v12A2.5 2.5 0 005 20.5h14a2.5 2.5 0 002.5-2.5V6a2.5 2.5 0 00-2.5-2.5H5zm1.87 6.33v8.17H5.13V9.83h1.72zm-.86-.25a1 1 0 110-2 1 1 0 010 2zm6.07 2.03c1.47 0 2.33.97 2.33 2.42v4.22h-1.68v-3.81c0-.91-.33-1.53-1.16-1.53-.63 0-1 .43-1.16.84-.06.14-.08.33-.08.53v3.98h-1.67s.02-6.46 0-7.13h1.67v1.01a1.78 1.78 0 011.63-.89z" />
                                </svg>
                            </a>
                            <a href="mailto:hello@perpex.com" className="hover:text-[var(--brand)]" aria-label="Email">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect width="20" height="16" x="2" y="4" rx="4" /><path d="M22 6L12 13 2 6" />
                                </svg>
                            </a>
                        </div>
                        <span className="text-xs text-neutral-400 mt-2">info@perpex.in</span>
                    </div>
                </div>

                <div className="mt-10 border-t border-neutral-800 pt-6 text-xs text-center tracking-wide text-neutral-500">
                    © 2025 PerpeX. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
