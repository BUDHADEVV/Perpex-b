"use client";

import React, { useState } from 'react';

const Pitch = () => {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <section id="pitch" className="w-full flex justify-center items-center bg-black py-10 px-1 md:py-14 md:px-0">
            <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-white via-gray-50 to-white rounded-2xl border border-neutral-200 shadow-lg flex flex-col md:flex-row items-center overflow-hidden">
                {/* Left: Video */}
                <div className="w-full md:w-2/5 flex justify-center items-center px-4 py-6 bg-neutral-100">
                    <div className="relative aspect-[9/16] w-full max-w-[340px] md:max-w-[300px] md:min-h-[470px] rounded-xl overflow-hidden border border-neutral-300 bg-black shadow-sm">
                        {!showVideo ? (
                            <div
                                id="videoPlaceholder"
                                className="absolute inset-0 cursor-pointer group"
                                onClick={() => setShowVideo(true)}
                            >
                                <img
                                    src="/pitch.png"
                                    alt="Student Pitch Thumbnail"
                                    className="w-full h-full object-cover rounded-xl"
                                    loading="lazy"
                                />
                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 md:w-8 md:h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <iframe
                                id="videoIframe"
                                className="w-full h-full rounded-xl"
                                src="https://www.youtube.com/embed/gbZs2-T3djE?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=0&playlist=gbZs2-T3djE&playsinline=1"
                                allow="autoplay; encrypted-media; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ aspectRatio: '9/16', background: '#000', border: 'none', outline: 'none' }}
                                title="Student Pitch"
                            ></iframe>
                        )}
                    </div>
                </div>

                {/* Right: Detail and stats */}
                <div className="w-full md:w-3/5 flex flex-col justify-center items-center md:items-start px-4 py-8 md:px-10 md:py-12 bg-white">
                    <span className="inline-block bg-black text-white text-xs font-bold px-4 py-1 rounded-full mb-3">Student Pitch</span>
                    <h2 className="text-xl md:text-3xl font-bold text-center md:text-left leading-tight mb-2 text-black">
                        Build in Public.<br />
                        <span className="italic text-[var(--brand)]">Pitch with no filters.</span>
                    </h2>
                    <p className="text-gray-700 text-sm md:text-base text-center md:text-left mb-5 md:mb-6 max-w-[400px]">
                        Watch founders bring ideas to life — see the pitch room up close.
                    </p>
                    <div className="flex flex-row gap-4 justify-around w-full md:w-auto mb-4">
                        <div className="flex-1 bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col items-center py-2 px-2">
                            <span className="text-lg md:text-2xl font-bold text-black mb-0">15+</span>
                            <span className="text-xs md:text-sm text-gray-500 uppercase text-center">Startups</span>
                        </div>
                        <div className="flex-1 bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col items-center py-2 px-2">
                            <span className="text-lg md:text-2xl font-bold text-[var(--brand)] mb-0">₹3 Crore+</span>
                            <span className="text-xs md:text-sm text-gray-500 uppercase text-center">Funding</span>
                        </div>
                    </div>
                    <button className="calendly-book-btn w-full md:w-auto mt-1 px-6 py-3 rounded-full btn-brand text-white font-bold text-base shadow transition hover:scale-105">
                        Apply for First Round Interview
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Pitch;
