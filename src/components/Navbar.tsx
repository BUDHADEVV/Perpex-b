"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "";
    };

    return (
        <nav className="w-full sticky top-0 z-50 border-b border-neutral-900 bg-black/95">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
                <Link href="#" className="flex items-center gap-2">
                    {/* Logo - assuming public/logo.png exists or will exist */}
                    <img src="/logo.png" alt="PerpeX Logo" className="h-10 w-auto object-contain" />
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center gap-5 text-base font-medium" id="navbar-desktop">
                    <li><Link href="#about" className="transition hover:text-[var(--brand)]">About</Link></li>
                    <li><Link href="#bschool" className="transition hover:text-[var(--brand)]">B School</Link></li>
                    <li><Link href="#brochure" className="transition hover:text-[var(--brand)]">Brochure</Link></li>
                    <li><Link href="#experts" className="transition hover:text-[var(--brand)]">Experts</Link></li>
                    <li><Link href="#pitch" className="transition hover:text-[var(--brand)]">Pitch</Link></li>
                    <li><Link href="#faq" className="transition hover:text-[var(--brand)]">FAQs</Link></li>
                    <li>
                        <Link href="#cta" className="ml-2 inline-flex items-center rounded-lg shadow px-4 py-2 font-bold btn-brand">
                            Book Now
                        </Link>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex items-center text-white"
                    id="mobile-menu-btn"
                    aria-label="Open menu"
                    onClick={toggleMenu}
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div id="mobile-menu" className="fixed inset-0 w-full h-full bg-black bg-opacity-95 z-50 p-8 flex flex-col justify-center items-center space-y-6 transition duration-200">
                    <button
                        className="absolute top-4 right-5 text-white"
                        id="mobile-menu-close"
                        aria-label="Close menu"
                        onClick={closeMenu}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <Link href="#about" className="text-lg font-semibold transition hover:text-[var(--brand)]" onClick={closeMenu}>About</Link>
                    <Link href="#bschool" className="text-lg font-semibold transition hover:text-[var(--brand)]" onClick={closeMenu}>B School </Link>
                    <Link href="#brochure" className="text-lg font-semibold transition hover:text-[var(--brand)]" onClick={closeMenu}>Brochure</Link>

                    <Link href="#experts" className="text-lg font-semibold transition hover:text-[var(--brand)]" onClick={closeMenu}>Expert Talks</Link>
                    <Link href="#pitch" className="text-lg font-semibold transition hover:text-[var(--brand)]" onClick={closeMenu}>Pitch Session</Link>
                    <Link href="#faq" className="text-lg font-semibold transition hover:text-[var(--brand)]" onClick={closeMenu}>FAQs</Link>
                    <Link href="#cta" className="mt-4 inline-block rounded-lg shadow font-bold py-3 px-8 btn-brand" onClick={closeMenu}>Book Now</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
