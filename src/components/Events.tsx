"use client"

import { urlFor } from '@/sanity/lib/image'
import { Calendar, MapPin, Tag } from 'lucide-react'

// Types
interface Event {
    _id: string
    title: string
    date: string
    location: string
    image: any
    description: string
    status: string
}

// Sample data for preview if CMS is empty
const PREVIEW_EVENTS: Event[] = [
    {
        _id: 'sample-1',
        title: 'Global Startup Summit 2024',
        date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
        location: 'Kochi & Online',
        image: null,
        description: 'Join the biggest gathering of student entrepreneurs. Pitch your idea, win funding, and network with industry leaders.',
        status: 'Upcoming'
    },
    {
        _id: 'sample-2',
        title: 'AI Hackathon: GenAI Edition',
        date: new Date(Date.now() + 86400000 * 25).toISOString(),
        location: 'Trivandrum',
        image: null,
        description: 'Build the next unicorn using Generative AI. 48 hours of coding, mentoring, and prizes worth 10 Lakhs.',
        status: 'Upcoming'
    },
    {
        _id: 'sample-3',
        title: 'Perpex Founder Mixer',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        location: 'Bangalore',
        image: null,
        description: 'An exclusive networking evening for Perpex program alumni and mentors.',
        status: 'Completed'
    }
]

export default function Events({ events = [] }: { events?: Event[] }) {
    // If no events from Sanity, use preview data to show the design
    const displayEvents = (!events || events.length === 0) ? PREVIEW_EVENTS : events

    return (
        <section id="events" className="w-full py-20 bg-zinc-950 text-white border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                        Community & Growth
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Events & Hackathons</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Join us at our next meetup. We host hackathons, startup summits, and workshops designed to accelerate your career and network.
                    </p>
                    {(!events || events.length === 0) && (
                        <p className="mt-4 text-xs text-orange-400 bg-orange-400/10 inline-block px-3 py-1 rounded border border-orange-400/20">
                            (Preview Mode: Add 'event' documents in Sanity to replace these samples)
                        </p>
                    )}
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {displayEvents.map((event) => (
                        <div key={event._id} className="group flex flex-col rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden hover:border-blue-500/30 hover:bg-zinc-900 transition-all duration-300">
                            {/* Image Container */}
                            <div className="relative h-52 w-full overflow-hidden">
                                {event.image ? (
                                    <img
                                        src={urlFor(event.image).url()}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                                        <span className="text-zinc-600 font-bold">No Image</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border border-white/10 ${event.status === 'Live' ? 'bg-red-500/80 text-white animate-pulse' :
                                        event.status === 'Completed' ? 'bg-zinc-800/90 text-zinc-400' :
                                            'bg-blue-600/90 text-white'
                                        }`}>
                                        {event.status || 'Upcoming'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 mb-4">
                                    <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded">
                                        <Calendar size={14} className="text-blue-400" />
                                        <span>{event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded">
                                        <MapPin size={14} className="text-purple-400" />
                                        <span>{event.location || 'Online'}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                    {event.description}
                                </p>

                                {/* Optional CTA if they want to link somewhere later, currently just visual */}
                                <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
                                    <span>Perpex Events</span>
                                    <span className="group-hover:translate-x-1 transition-transform text-blue-500 font-medium flex items-center gap-1">
                                        Details coming soon
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
