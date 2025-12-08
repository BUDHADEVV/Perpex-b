import Link from 'next/link';

const CTA = () => {
    return (
        <section id="cta" className="w-full bg-black py-14 md:py-16 px-4 md:px-12 flex justify-center">
            <div className="max-w-xl w-full mx-auto text-center flex flex-col items-center">
                <h2 className="text-white font-bold text-2xl md:text-3xl mb-6">
                    Your story could be the next highlight.<br />
                    So tell me Founder — ready to make it <span className="text-[var(--brand)]">real?</span>
                </h2>
                <Link href="#" className="calendly-book-btn inline-block rounded-lg text-lg shadow-lg mt-3 px-8 py-3 btn-brand">
                    Yes, Book My Interview
                </Link>
            </div>
        </section>
    );
};

export default CTA;
