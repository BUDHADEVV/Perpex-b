import Link from 'next/link';

const Brochure = () => {
    return (
        <section id="brochure" className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
                <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-12 md:mb-16">
                    Learn <span className="italic text-[#2979FF]">'Practically'</span> by Building<br className="hidden sm:block" />Real Businesses
                </h2>
                <div className="bg-white rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl max-w-5xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="lg:w-[45%] w-full">
                            <div className="relative">
                                <img src="/students.jpg" alt="PerpeX B-School Students" className="w-full object-cover rounded-2xl bg-gray-200 h-56 md:h-60" />
                            </div>
                        </div>
                        <div className="lg:w-[55%] w-full text-left">
                            <div className="inline-block bg-black text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold mb-4">
                                BYOB Challenge
                            </div>
                            <h3 className="text-black font-bold text-xl md:text-3xl leading-tight mb-4">
                                Start the journey by building a<br /><span className="italic">profitable startup business</span>
                            </h3>
                            <p className="text-gray-700 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed">
                                Build a real business, master entrepreneurship, sales & digital marketing, and generate sustainable revenue in just 4 months
                            </p>
                            <a
                                href="/PerpeX-Brochure.pdf"
                                download
                                className="inline-flex items-center rounded-lg shadow px-6 py-3 btn-brand font-bold text-white transition hover:bg-[var(--brand-600)]"
                                style={{ marginTop: '12px' }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5 5-5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3" />
                                </svg>
                                Download Brochure
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Brochure;
