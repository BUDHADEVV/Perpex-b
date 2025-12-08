interface FAQProps {
    data: {
        question: string;
        answer: string;
    }[] | null;
}

const FAQ = ({ data }: FAQProps) => {
    const defaultFAQs = [
        { question: "Do I need to be a business pro?", answer: "Nope. Curiosity is enough." },
        { question: "Is this expensive?", answer: "Think of it as your first startup investment." },
        { question: "What if I don't get in?", answer: "You'll still leave sharper." }
    ];

    const faqs = (data && data.length > 0) ? data : defaultFAQs;

    return (
        <section id="faq" className="w-full bg-black py-16 md:py-20 px-4 md:px-12">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
                <h2 className="text-white font-bold text-2xl md:text-3xl mb-8 text-center">Real Talk <span className="text-[var(--brand)]">(FAQs)</span></h2>
                <div className="w-full space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-neutral-900 rounded-xl px-6 py-5">
                            <h3 className="font-bold text-lg text-white">{faq.question}</h3>
                            <p className="text-gray-300">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
