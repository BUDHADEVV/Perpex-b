"use client";

import React, { useEffect, useRef, useState } from 'react';

interface RoadmapProps {
    data: {
        title: string;
        badge: string;
        items: string[];
        hasEmoji?: boolean;
        content?: string[]; // Handle legacy name mapping if needed, or map in parent
    }[] | null;
}

const Roadmap = ({ data }: RoadmapProps) => {
    // Desktop Logic
    // Fallback data
    const defaultMilestones = [
        {
            title: "INCEPTION",
            badge: "01",
            items: [
                "Startup science & business basics",
                "User persona, customer problems",
                "Core value proposition & use cases",
                "Validate market gaps, idea mapping"
            ],
            content: [ // For desktop mapping
                "Startup science & business basics",
                "User persona, customer problems",
                "Core value proposition & use cases",
                "Validate market gaps, idea mapping"
            ]
        },
        {
            title: "REVELATION",
            badge: "02",
            items: [
                "Validate ideas, market need",
                "User interviews, product designs",
                "Lean startup, sales & marketing",
                "MVP creation, pivot decisions"
            ],
            content: [
                "Validate ideas, market need",
                "User interviews, product designs",
                "Lean startup, sales & marketing",
                "MVP creation, pivot decisions"
            ]
        },
        {
            title: "TRANSITION",
            badge: "03",
            items: [
                "Legal basics, GST/tax",
                "Building your team, first revenue",
                "Growth metrics, workshops"
            ],
            content: [
                "Legal basics, GST/tax",
                "Building your team, first revenue",
                "Growth metrics, workshops"
            ]
        },
        {
            title: "IMPLEMENTATION",
            badge: "04",
            items: [
                "Build product & investor pitch",
                "User onboarding, sales",
                "Operations & launch",
                "Revenue simulation, Showcase Day"
            ],
            content: [
                "Build product, investor pitch",
                "User onboarding, sales",
                "Operations & launch",
                "Revenue simulation, Showcase Day"
            ]
        },
        {
            title: "REVOLUTION",
            badge: "05",
            items: [
                "Seed funding & business growth",
                "Pitching to investors",
                "Advanced fundraising",
                "Going public",
                "Growth hacking & strategy"
            ],
            hasEmoji: true,
            content: [
                "Seed funding & business growth",
                "Pitch to investors, fundraising",
                "Going public & growth hacking"
            ]
        }
    ];

    // Resolve milestones: Use Sanity data if available (and has items), else default.
    // We need to ensure 'content' field exists for desktop if it comes from Sanity (sanity has 'items', we can reuse 'items' for content)
    const milestones = (data && data.length > 0)
        ? data.map(m => ({ ...m, content: m.items }))
        : defaultMilestones;

    // We are assuming 'items' and 'content' are same for now. In original, desktop list was slightly shorter text perhaps? 
    // But for cloning, we can use same.

    const [activeDesktopIndex, setActiveDesktopIndex] = useState(0);

    // Mobile Logic
    const mobileRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Mobile scroll logic
        const updateTimeline = () => {
            if (!mobileRef.current || typeof window === 'undefined' || window.innerWidth >= 768) return;

            const milestoneElements = Array.from(mobileRef.current.querySelectorAll('.timeline-card'));
            if (milestoneElements.length === 0) return;

            let nearest: Element | null = null;
            let minDist = 99999;
            let lastActiveIndex = 0;

            milestoneElements.forEach((card, i) => {
                const box = card.getBoundingClientRect();
                const y = box.top + box.height / 2;
                const dist = Math.abs(y - window.innerHeight / 2);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = card;
                    lastActiveIndex = i;
                }
            });

            milestoneElements.forEach((card) => {
                if (card === nearest) {
                    card.classList.add('active');
                    const title = card.querySelector('.timeline-title');
                    if (title) title.classList.add('active');
                    const badge = card.querySelector('.timeline-badge');
                    if (badge) badge.classList.add('active');
                    const detail = card.querySelector('.timeline-detail');
                    if (detail) detail.classList.remove('hidden');
                } else {
                    card.classList.remove('active');
                    const title = card.querySelector('.timeline-title');
                    if (title) title.classList.remove('active');
                    const badge = card.querySelector('.timeline-badge');
                    if (badge) badge.classList.remove('active');
                    const detail = card.querySelector('.timeline-detail');
                    if (detail) detail.classList.add('hidden');
                }
            });

            // Progress bar
            let progress = 0;
            if (nearest && progressBarRef.current) {
                if (lastActiveIndex === milestoneElements.length - 1) {
                    progress = 1;
                } else {
                    // @ts-ignore
                    const containerTop = nearest.parentElement.getBoundingClientRect().top;
                    const nearestTop = nearest.getBoundingClientRect().top;
                    // @ts-ignore
                    const nearestHeight = nearest.offsetHeight;
                    const scrollPositionInContainer = (nearestTop - containerTop) + (nearestHeight / 2);
                    // @ts-ignore
                    progress = scrollPositionInContainer / nearest.parentElement.offsetHeight;
                }

                const containerHeight = mobileRef.current.querySelector('.relative')?.clientHeight || 0;
                progressBarRef.current.style.height = `${progress * containerHeight}px`;
            }
        };

        window.addEventListener('scroll', updateTimeline);
        window.addEventListener('resize', updateTimeline);
        updateTimeline();

        return () => {
            window.removeEventListener('scroll', updateTimeline);
            window.removeEventListener('resize', updateTimeline);
        };
    }, []);

    return (
        <>
            {/* MOBILE TIMELINE */}
            <section id="journey-timeline" ref={mobileRef} className="block md:hidden w-full px-4 py-20 bg-black">
                <h2 className="text-2xl text-center font-extrabold text-white mb-12 tracking-tight drop-shadow">
                    Your Journey to <span className="text-[var(--brand)]">PerpeX</span> Perpetual Excellence
                </h2>

                <div className="relative flex flex-col gap-11 max-w-lg mx-auto pl-[54px]">
                    {/* Progress Bar */}
                    <div id="timeline-progress" className="absolute left-[16px] top-0 w-5 h-full z-[0] rounded-full overflow-hidden bg-zinc-800">
                        <div id="progress-bar" ref={progressBarRef} className="absolute left-0 top-0 w-5 rounded-full transition-all duration-400 z-[1] bg-[var(--brand)] shadow-[0_0_10px_var(--brand)]"></div>
                    </div>

                    {milestones.map((m, idx) => (
                        <div key={idx} className="timeline-milestone timeline-card" id={`m${idx + 1}`} onClick={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" })}>
                            <div className="flex items-center gap-4 mb-1">
                                <div className="timeline-badge">{m.badge || `0${idx + 1}`}</div>
                                <div className="timeline-title font-extrabold text-lg flex items-center">
                                    {m.title} {m.hasEmoji && <span className="text-2xl ml-1 animate-bounce inline-block">🚀</span>}
                                </div>
                            </div>
                            <div className="timeline-detail hidden mt-3 rounded-2xl p-5 text-base font-medium border border-[var(--brand)] bg-zinc-900/50 shadow-[0_0_15px_rgba(41,121,255,0.2)]">
                                <ul className="list-disc pl-3 space-y-1">
                                    {m.items && m.items.map((it, i) => <li key={i}>{it}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* DESKTOP TIMELINE */}
            <section id="journey-timeline-desktop" className="hidden md:block w-full px-0 py-20 bg-black">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white text-center mb-14 tracking-tight drop-shadow">
                        Your Journey to <span className="text-[var(--brand)]">PerpeX</span> Perpetual Excellence
                    </h2>
                    <div className="relative flex flex-row items-center justify-center gap-0 mb-6">
                        <div className="flex w-full items-center justify-between px-4">
                            <div className="flex flex-row items-center w-full gap-0">
                                {milestones.map((m, i) => (
                                    <React.Fragment key={i}>
                                        <div
                                            className={`milestone-badge w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow cursor-pointer transition-all duration-200
                          ${i === activeDesktopIndex ? 'bg-zinc-900 border-2 border-[var(--brand)] active-milestone scale-110 shadow-[0_0_15px_var(--brand)]' : 'bg-zinc-900 border-2 border-[var(--brand)] hover:bg-[#2979FF33] hover:scale-105'}
                          ${i === 4 && i !== activeDesktopIndex ? 'bg-[var(--brand)]' : ''}
                      `}
                                            onMouseEnter={() => setActiveDesktopIndex(i)}
                                            onClick={() => setActiveDesktopIndex(i)}
                                        >
                                            {i + 1}
                                        </div>
                                        {i < milestones.length - 1 && (
                                            <div className="flex-1 h-1 bg-gradient-to-r from-[var(--brand)] via-blue-400 to-[var(--brand)]"></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div
                        id="timeline-card-content"
                        className="mt-8 transition-all duration-300"
                        key={activeDesktopIndex}
                        style={{ animation: 'fadein-card 0.5s' }}
                    >
                        <div className="timeline-card px-8 py-7 rounded-xl bg-zinc-900 border border-[var(--brand)] shadow-[0_0_20px_rgba(41,121,255,0.2)] animate-[fadein_0.3s_ease-out]">
                            <h3 className="text-lg font-bold text-white mb-3">{milestones[activeDesktopIndex].title}</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {/* @ts-ignore */}
                                {milestones[activeDesktopIndex].content && milestones[activeDesktopIndex].content.map((item, idx) => (
                                    <li key={idx} className="text-white font-bold">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Roadmap;
