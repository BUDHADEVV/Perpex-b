"use client";

import React, { useState } from 'react';

const ExpertTalk = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleVideo = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <section className="w-full bg-black">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
                {/* Content Info */}
                <div className="w-full md:w-2/5 flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-none">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
                        <span className="block mb-1">🎙️ Expert Talk at</span>
                        <span className="block text-[var(--brand)]">PerpeX B‑School</span>
                    </h2>
                    <p className="text-gray-300 font-medium text-sm md:text-lg mb-6">
                        Hear insights from industry leaders on building, scaling, and leading in real markets.
                    </p>
                    <ul className="flex space-x-2 justify-center md:justify-start mb-6">
                        {/* Placeholders for avatars */}
                        <li><img src="/logo1.jpg" className="w-9 h-9 rounded-full border-2 border-white shadow" alt="Mentor" /></li>
                        <li><img src="/logo2.jpg" className="w-9 h-9 rounded-full border-2 border-white shadow" alt="Peer" /></li>
                        <li><img src="/logo3.jpg" className="w-9 h-9 rounded-full border-2 border-white shadow" alt="Student Life" /></li>
                        <li><img src="/logo5.jpg" className="w-9 h-9 rounded-full border-2 border-white shadow" alt="Peer" /></li>
                        <li className="flex items-center text-xs text-gray-400 font-semibold ml-1">+ More</li>
                    </ul>
                    <button
                        className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition btn-brand"
                        onClick={toggleVideo}
                    >
                        <svg width="20" height="20" fill="currentColor"><path d="M6 4v12l10-6-10-6z" /></svg>
                        Watch Expert Talk
                    </button>
                </div>

                {/* Video Portal Card */}
                <div className="w-full md:w-3/5 flex flex-col items-center justify-center order-2">
                    <div className="relative rounded-2xl aspect-[9/16] max-w-xs w-full mx-auto overflow-hidden group shadow-2xl ring-2 ring-[var(--brand)]/10 ring-offset-4 ring-offset-black mb-6 md:mb-0">
                        {/* Placeholder/Player toggle */}
                        {!isPlaying && (
                            <div
                                className="relative w-full h-full cursor-pointer flex"
                                onClick={toggleVideo}
                            >
                                <img src="/expert2.jpg" alt="Expert Talk" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                                    <div className="hover:scale-105 transition w-14 h-14 flex items-center justify-center rounded-full shadow-lg border-4 border-white"
                                        style={{ background: 'var(--brand)' }}>
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Video Container */}
                        {isPlaying && (
                            <div className="absolute inset-0 z-10 w-full h-full bg-black/95 flex items-center justify-center">
                                <div className="relative w-full h-full flex flex-col">
                                    <div className="flex-1 flex items-center justify-center">
                                        {/* Vimeo Iframe as per HTML source */}
                                        <iframe
                                            className="rounded-lg aspect-[9/16] w-full h-full"
                                            src="https://player.vimeo.com/video/1122636889?autoplay=1&color=ffffff&title=0&byline=0&portrait=0&badge=0"
                                            frameBorder="0"
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            allowFullScreen
                                            title="Expert Talk"
                                        ></iframe>
                                    </div>
                                    <button
                                        onClick={toggleVideo}
                                        className="absolute top-3 right-3 w-9 h-9 text-white rounded-full flex items-center justify-center z-20"
                                        style={{ background: 'rgba(0,0,0,.7)' }}>
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l6 6m0-6l-6 6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-[var(--brand)] opacity-80 tracking-wide mt-2 md:mt-5">
                        "Actionable wisdom from those who've built and led"
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpertTalk;
