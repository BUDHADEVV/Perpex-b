"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

interface HeroProps {
    data: {
        heroTitle?: string;
        heroSubtitle?: string;
        heroTagline?: string;
        heroButtonText?: string;
        videoUrl?: string;
        desktopImages?: string[];
    } | null;
}

const Hero = ({ data }: HeroProps) => {
    const heroSectionRef = useRef<HTMLElement>(null);
    const heroBoxRef = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const heroBtnRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        // Mobile Hero Animation Logic
        if (typeof window === 'undefined' || window.innerWidth >= 768) return;

        let animating = false;

        const showAndAnimate = () => {
            if (animating || !heroBoxRef.current || !heroTextRef.current || !heroBtnRef.current) return;
            animating = true;

            const box = heroBoxRef.current;
            const text = heroTextRef.current;
            const btn = heroBtnRef.current;

            box.style.opacity = "1";
            box.style.pointerEvents = "auto";
            text.style.opacity = "1";
            text.style.top = "32%";
            btn.style.opacity = "1";
            btn.style.bottom = "25%";
            box.style.justifyContent = "center";

            setTimeout(() => {
                box.style.justifyContent = "flex-start";
                text.style.top = "12vh";
                btn.style.bottom = "12vh";
            }, 2000);

            setTimeout(() => {
                animating = false;
            }, 2600);
        };

        const hideHero = () => {
            if (!heroBoxRef.current || !heroTextRef.current || !heroBtnRef.current) return;
            const box = heroBoxRef.current;
            const text = heroTextRef.current;
            const btn = heroBtnRef.current;

            box.style.opacity = "0";
            box.style.pointerEvents = "none";
            text.style.opacity = "0";
            btn.style.opacity = "0";
            box.style.justifyContent = "center";
            text.style.top = "32%";
            btn.style.bottom = "25%";
            animating = false;
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    showAndAnimate();
                } else {
                    hideHero();
                }
            });
        }, { threshold: 0.65 });

        if (heroSectionRef.current) {
            observer.observe(heroSectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    // Logos for slider - fallback if Sanity empty
    const defaultLogos = ["logo1.jpg", "logo2.jpg", "logo3.jpg", "logo4.jpg", "logo5.jpg", "logo6.jpg"];
    // If data.desktopImages exists, use it, else default
    // Note: Sanity images are full URLs, local are paths.
    const sliderImages = data?.desktopImages && data.desktopImages.length > 0 ? data.desktopImages : defaultLogos.map(l => `/${l}`);

    const headline = data?.heroTitle || <>Hello <span className="text-[#2979FF]">Founder!</span></>;
    const subheadline = data?.heroSubtitle || "If walking in the right direction… dreams do come true";
    const tagline = data?.heroTagline || "And yesss — already on the right path";
    const cta = data?.heroButtonText || "Book My Interview Slot";

    // For mobile video, if we have a URL from sanity, use it, else default perpex.mp4
    // Note: Sanity files might be blobs. Assuming URL string.
    const videoSrc = data?.videoUrl || "/perpex.mp4";

    return (
        <>
            <section id="about" ref={heroSectionRef} className="w-full relative overflow-hidden bg-black min-h-[90vh] flex items-center justify-center">
                {/* MOBILE: Background video and animated hero */}
                <div className="absolute inset-0 w-full h-full mobile-hero-bgvid pointer-events-none z-0 md:hidden block">
                    <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover">
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>

                <div className="block md:hidden w-full h-full relative z-10">
                    <div
                        id="mobile-hero-box"
                        ref={heroBoxRef}
                        className="w-full h-[90vh] flex flex-col items-center justify-center relative transition-all duration-700 opacity-0 pointer-events-none"
                        style={{ position: 'relative' }}
                    >
                        <div
                            id="mobile-hero-text"
                            ref={heroTextRef}
                            className="text-center transition-all duration-500 absolute w-full left-0 opacity-0"
                        >
                            <h1 className="font-extrabold text-[2.2rem] leading-tight mb-3 tracking-tight uppercase text-white drop-shadow-lg">
                                {typeof headline === 'string' ? headline : headline}
                            </h1>
                            <p className="text-base font-bold mb-2 text-white drop-shadow">
                                {subheadline}
                            </p>
                            <p className="text-sm text-gray-100 mb-8 drop-shadow">
                                {tagline}
                            </p>
                        </div>
                        <Link
                            href="#cta"
                            id="mobile-hero-btn"
                            ref={heroBtnRef}
                            className="calendly-book-btn rounded-lg text-base shadow-lg w-max px-6 py-3 btn-brand transition-all duration-700 absolute left-1/2 -translate-x-1/2 opacity-0"
                            style={{ bottom: '25%' }}
                        >
                            {cta}
                        </Link>
                    </div>
                </div>

                {/* DESKTOP HERO: content & image slider */}
                <div className="hidden md:flex w-full relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-20 flex-row justify-center items-stretch min-h-[90vh] gap-6">
                    {/* LEFT: Desktop Hero Text */}
                    <div className="lg:w-[55%] flex flex-col justify-center md:px-6">
                        <h1 className="font-extrabold text-[3.5rem] leading-tight mb-3 tracking-tight uppercase text-white">
                            {typeof headline === 'string' && headline.includes("Founder") ? <>{headline.split("Founder")[0]} <span className="text-[#2979FF]">Founder!</span></> : headline}
                        </h1>
                        <p className="text-xl font-bold mb-2 text-white">
                            {subheadline}
                        </p>
                        <p className="text-lg text-gray-300 mb-8">
                            {tagline}
                        </p>
                        <Link href="#cta" className="calendly-book-btn inline-block rounded-lg text-lg shadow-lg w-max mt-2 px-8 py-4 btn-brand">
                            {cta}
                        </Link>
                    </div>
                    {/* RIGHT: Desktop Image Slider */}
                    <div className="lg:w-[45%] flex items-center justify-center min-h-[600px]">
                        <div className="slider-container" style={{ height: '600px', width: '360px', borderRadius: '1.1rem', overflow: 'hidden', position: 'relative' }}>
                            <div className="slider-track" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '160px', gap: '7px', animation: 'vertical-scroll 8s linear infinite' }}>
                                {[...sliderImages, ...sliderImages].map((src, index) => (
                                    <img key={index} src={src} alt={`Logo ${index}`} className="slider-img" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem', background: '#18181b' }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="block md:hidden w-full text-center mt-4 mb-2">
                <h3 className="text-lg font-extrabold tracking-tight text-white drop-shadow-md">
                    StartUps from <span className="text-[var(--brand)]" style={{ color: '#2979FF' }}>PERPEX B SCHOOL</span>
                </h3>
            </div>

            {/* MOBILE ONLY: Scrolling logos */}
            <div className="mobile-slider-row" style={{ display: 'flex' }}>
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((src, index) => (
                        <img key={index} src={src} alt="Logo" className="slider-img" />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Hero;
