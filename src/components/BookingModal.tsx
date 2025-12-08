"use client";

import React, { useState, useEffect } from 'react';

const BookingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Listen for clicks on elements with class 'calendly-book-btn' (which we assume triggers this, as per HTML logic)
        // But since we are in React, we should probably use a custom event or context.
        // For simplicity and to match the HTML's unstructured nature where any button with that class worked:
        const handleOpen = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.calendly-book-btn')) {
                e.preventDefault();
                setIsOpen(true);
                document.body.style.overflow = 'hidden';
            }
        };

        document.addEventListener('click', handleOpen);
        return () => document.removeEventListener('click', handleOpen);
    }, []);

    const close = () => {
        setIsOpen(false);
        document.body.style.overflow = '';
        setStatus('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('Submitting...');
        const formData = new FormData(e.currentTarget);
        const googleScriptURL = 'https://script.google.com/macros/s/AKfycbxfbgE7eZ9W0iFl9zIRQVbiBTDXreM8ZCsFjJDHI7bu3BlBfpOowIPJ8VBy6NKIxyuaaQ/exec';

        try {
            const res = await fetch(googleScriptURL, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                setStatus('Booking submitted! We will contact you soon.');
                setTimeout(() => {
                    close();
                }, 1800);
            } else {
                setStatus('Error submitting. Please try again.');
            }
        } catch {
            setStatus('Error connecting. Please try later.');
        }
    };

    if (!isOpen) return null;

    return (
        <div id="booking-modal" className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl text-black relative">
                <button onClick={close} id="close-modal" className="absolute top-3 right-3 text-xl font-bold text-gray-700 hover:text-red-600">&times;</button>
                <h2 className="text-xl font-bold mb-4 text-[#2979FF]">Book Your Interview Slot</h2>
                <form id="booking-form" className="space-y-4" onSubmit={handleSubmit}>
                    <input name="name" type="text" placeholder="Name" required className="w-full px-4 py-2 border rounded-lg focus:outline-[#2979FF]" />
                    <input name="age" type="number" placeholder="Age" required className="w-full px-4 py-2 border rounded-lg focus:outline-[#2979FF]" />
                    <input name="phone" type="tel" placeholder="Phone Number" required className="w-full px-4 py-2 border rounded-lg focus:outline-[#2979FF]" />
                    <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-lg focus:outline-[#2979FF]" />

                    <select name="program" required className="w-full px-4 py-2 border rounded-lg focus:outline-[#2979FF] bg-white">
                        <option value="" disabled selected>Select a program</option>
                        <option>Practical HR Management</option>
                        <option>BYOB - Build Your Own Business</option>
                        <option>Practical Sales Course</option>
                        <option>Startup Launch Pad Program</option>
                        <option>B2B - Sales Training</option>
                        <option>B2B - Staffing</option>
                        <option>B2B - Documentation</option>
                        <option>B2B Custom Service</option>
                    </select>

                    <button type="submit" className="btn-brand w-full py-2 rounded-lg font-bold text-white hover:bg-[#1f5fd6] transition">Submit</button>
                    <div id="form-status" className="mt-2 text-center text-sm">{status}</div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
