"use client";

import Link from 'next/link';

interface ProgramFeaturesProps {
    data: {
        text: string;
        icon?: string;
    }[] | null;
}

const ProgramFeatures = ({ data }: ProgramFeaturesProps) => {
    // Default data fallback if Sanity is empty/not connected
    const defaultPrograms = [
        { text: "Practical Human Resource Management" },
        { text: "BYOB - Build Your Own Business" },
        { text: "Practical Sales Course" },
        { text: "Startup Launch Pad Program" },
        { text: "B2B - Sales Training" },
        { text: "B2B - Staffing" },
        { text: "B2B - Documentation" },
        { text: "B2B Custom Service" }
    ];

    const programs = (data && data.length > 0) ? data : defaultPrograms;

    return (
        <section id="program-features" className="w-full bg-black py-16 px-4 md:px-0 flex justify-center">
            <div className="max-w-4xl w-full text-center">
                <h2 className="text-white font-bold text-2xl md:text-3xl mb-8">
                    What's in every <span className="text-[var(--brand)]">PerpeX B-School</span> program?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {programs.map((item, index) => (
                        <div key={index} className="flex items-center bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-[var(--brand)] transition-colors">
                            <span className="text-2xl mr-4">{item.icon || "✅"}</span>
                            <span className="text-white font-medium text-left">{item.text}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-10">
                    <Link href="#cta" className="calendly-book-btn inline-block px-8 py-3 rounded-full btn-brand text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform">
                        View Programs
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProgramFeatures;
