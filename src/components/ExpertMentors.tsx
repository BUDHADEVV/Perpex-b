"use client";

import React, { useRef } from 'react';

interface ExpertMentorsProps {
    data: {
        name?: string;
        imageUrl?: string;
        link?: string;
    }[] | null;
}

const ExpertMentors = ({ data }: ExpertMentorsProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    const scrollSlider = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const cardWidth = 272; // Approximate width including gap
            const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const defaultExperts: NonNullable<ExpertMentorsProps['data']> = [
        { imageUrl: "/expert1.jpg", link: "https://www.instagram.com/reel/DLz1h8PTF9u/?igsh=QkFOWDcwTHBwYQ%3D%3D" },
        { imageUrl: "/ff.jpg", link: "https://www.instagram.com/reel/DL7QoI3TtPs/?igsh=X2U5WWsyOUxE" },
        { imageUrl: "/ff6.jpg", link: "https://www.instagram.com/p/DNHrW6lzP0Y/" },
        { imageUrl: "/expert22.png", link: "https://www.instagram.com/reel/DOqcQX1Dd2c/?igsh=X3JPOWF5b1ZM" },
        { imageUrl: "/expert3.jpg", link: "https://www.instagram.com/reel/DMdOp3hTLig/?igsh=QkFaYUYzclkwWQ%3D%3D" },
        { imageUrl: "/ff5.jpg", link: "https://www.instagram.com/reel/DNBXpqmTVRG/?igsh=QkFDZG83aDZhUg%3D%3D" },
        { imageUrl: "/expert4.jpg", link: "https://www.instagram.com/reel/DMP7Ybgzzgw/?igsh=X2JNNGFZcHNT" },
        { imageUrl: "/expert6.jpg", link: "https://www.instagram.com/reel/DMSkaPkTGei/?igsh=QkJSZ3dodzJPcg%3D%3D" },
        { imageUrl: "/expert5.jpg", link: "#" },
        { imageUrl: "/ff4.jpg", link: "https://www.instagram.com/reel/DMaEAsbTWN7/?utm_source=ig_web_button_share_sheet" },
        { imageUrl: "/ff3.jpg", link: "https://www.instagram.com/reel/DNN4ZDKtsSv/?igsh=MzhsZXhpbDN1ZnRh" },
        { imageUrl: "/ff2.jpg", link: "#" },
    ];

    const experts = (data && data.length > 0) ? data : defaultExperts;

    return (
        <section id="experts" className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl mb-2">
                            Popular <span className="text-[var(--brand)]">Expert</span> Sessions
                        </h2>
                    </div>
                    <div className="block md:hidden">
                        <svg className="w-5 h-5 ml-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scrollSlider('left')}
                            className="nav-button w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[var(--brand)] transition"
                            aria-label="Scroll left"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button
                            onClick={() => scrollSlider('right')}
                            className="nav-button w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[var(--brand)] transition"
                            aria-label="Scroll right"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div id="expert-slider" ref={sliderRef} className="expert-slider flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-4">
                        {experts.map((exp, i) => (
                            <div key={i} className="expert-card flex-none w-44 sm:w-56 md:w-64 bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden relative group cursor-pointer">
                                <div className="relative h-64 sm:h-72 md:h-80">
                                    <a href={exp.link || '#'} target="_blank" rel="noopener noreferrer">
                                        <img src={exp.imageUrl || '/placeholder.jpg'} alt={exp.name || "Expert Session"} className="w-full h-full object-cover" />
                                        <span className="absolute top-2 right-2 bg-black/70 rounded-full p-1 z-10 flex items-center justify-center">
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <rect width="18" height="18" x="3" y="3" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
                                                <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2" />
                                                <circle cx="17" cy="7" r="1.25" fill="#fff" />
                                            </svg>
                                        </span>
                                    </a>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpertMentors;
