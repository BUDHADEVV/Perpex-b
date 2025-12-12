"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, Suspense } from 'react'

// Helper to get OS
const getOS = () => {
    if (typeof window === 'undefined') return 'Unknown'
    const ua = window.navigator.userAgent
    if (ua.indexOf("Win") !== -1) return "Windows"
    if (ua.indexOf("Mac") !== -1) return "MacOS"
    if (ua.indexOf("Linux") !== -1) return "Linux"
    if (ua.indexOf("Android") !== -1) return "Android"
    if (ua.indexOf("like Mac") !== -1) return "iOS"
    return "Unknown"
}

// Helper for Browser
const getBrowser = () => {
    if (typeof window === 'undefined') return 'Unknown'
    const ua = navigator.userAgent
    if (ua.indexOf("Chrome") !== -1) return "Chrome"
    if (ua.indexOf("Firefox") !== -1) return "Firefox"
    if (ua.indexOf("Safari") !== -1) return "Safari"
    if (ua.indexOf("Edge") !== -1) return "Edge"
    return "Other"
}

function TrackerContent() {
    const pathname = usePathname()
    const searchParams = useSearchParams() // For UTM tags

    const startTime = useRef<number>(Date.now())
    const interactions = useRef<any[]>([])
    const maxScroll = useRef(0)
    const hasTrackedInitial = useRef(false)
    const prevPathRef = useRef(pathname)

    // Section Tracking Refs
    const sectionTimes = useRef<Record<string, number>>({})
    const activeSections = useRef<Record<string, number>>({}) // Stores start timestamp for currently visible sections

    // Demographics State
    const [showSurvey, setShowSurvey] = useState(false)
    const [demographics, setDemographics] = useState({ age: 'Unknown', gender: 'Unknown' })
    const [surveySubmitted, setSurveySubmitted] = useState(false)
    const [sessionInfo, setSessionInfo] = useState({ sessionId: '', visitorType: 'New' })

    useEffect(() => {
        // 1. Session Management
        let sId = sessionStorage.getItem('perpex_analytics_sid')
        if (!sId) {
            sId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36)
            sessionStorage.setItem('perpex_analytics_sid', sId)
        }

        // 2. Visitor Management
        const isReturning = localStorage.getItem('perpex_analytics_returning')
        const vType = isReturning ? 'Returning' : 'New'

        if (!isReturning) {
            localStorage.setItem('perpex_analytics_returning', 'true')
        }

        setSessionInfo({ sessionId: sId, visitorType: vType })

        // 3. Survey Status
        const savedDemo = localStorage.getItem('perpex_analytics_demo')
        if (savedDemo) {
            setDemographics(JSON.parse(savedDemo))
            setSurveySubmitted(true)
        } else {
            const timer = setTimeout(() => setShowSurvey(true), 5000) // 5s delay
            return () => clearTimeout(timer)
        }
    }, [])

    const handleSurveySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        localStorage.setItem('perpex_analytics_demo', JSON.stringify(demographics))
        setSurveySubmitted(true)
        setShowSurvey(false)
    }

    // Track Clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Capture detailed info for Marketing CTAs
            const isButtonOrLink = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')

            interactions.current.push({
                elementId: target.id || '',
                tagName: target.tagName,
                innerText: isButtonOrLink ? (target.innerText || '').slice(0, 50) : '', // Track text like "Apply Now"
                action: 'click',
                timestamp: new Date().toISOString(),
                x: e.clientX,
                y: e.clientY
            })
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    // Track Scroll Depth
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY + window.innerHeight
            const total = document.documentElement.scrollHeight
            const percentage = Math.round((scrolled / total) * 100)
            if (percentage > maxScroll.current) {
                maxScroll.current = percentage
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [pathname])

    // Track Time on Sections (IntersectionObserver)
    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined' || !window.IntersectionObserver) return

        const observer = new IntersectionObserver((entries) => {
            const now = Date.now()
            entries.forEach(entry => {
                const id = entry.target.id
                if (!id) return

                if (entry.isIntersecting) {
                    // Entered viewport: record start time
                    activeSections.current[id] = now
                } else {
                    // Left viewport: calculate duration and add to total
                    const start = activeSections.current[id]
                    if (start) {
                        const duration = now - start
                        sectionTimes.current[id] = (sectionTimes.current[id] || 0) + duration
                        delete activeSections.current[id]
                    }
                }
            })
        }, { threshold: 0.5 }) // 50% visibility required to count as "viewing"

        // Observe all elements with an ID (assuming sections have IDs like 'hero', 'features')
        // We wait a bit for DOM to load
        const timeout = setTimeout(() => {
            const elements = document.querySelectorAll('section[id], div[id]')
            elements.forEach(el => observer.observe(el))
        }, 1000)

        return () => {
            observer.disconnect()
            clearTimeout(timeout)
        }
    }, [pathname])

    // Send Data Function
    const sendData = async (currentPath: string, duration: number) => {
        try {
            // Get location 
            let locationData = 'Unknown'
            let countryData = 'Unknown'
            try {
                const res = await fetch('https://ipapi.co/json/')
                if (res.ok) {
                    const data = await res.json()
                    locationData = `${data.city}, ${data.region}`
                    countryData = data.country_name
                }
            } catch (err) { }

            const payload = {
                pagePath: currentPath,
                location: locationData,
                country: countryData,
                duration: Math.floor(duration / 1000),
                scrollDepth: maxScroll.current,
                device: window.innerWidth > 768 ? 'desktop' : 'mobile',
                os: getOS(),
                browser: getBrowser(),
                screenSize: `${window.screen.width}x${window.screen.height}`,
                language: navigator.language,
                referrer: document.referrer || 'Direct',
                // UTM Parameters
                utmSource: searchParams.get('utm_source') || '',
                utmMedium: searchParams.get('utm_medium') || '',
                utmCampaign: searchParams.get('utm_campaign') || '',

                interactions: interactions.current,

                // Convert section times map to array
                sections: Object.entries(sectionTimes.current).map(([id, duration]) => ({
                    sectionId: id,
                    duration: Math.round(duration / 1000) // Convert to seconds
                })),

                timestamp: new Date().toISOString(),

                gender: demographics.gender,
                ageGroup: demographics.age,

                sessionId: sessionInfo.sessionId,
                visitorType: sessionInfo.visitorType
            }

            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            interactions.current = []
            maxScroll.current = 0
            sectionTimes.current = {}
            activeSections.current = {}
        } catch (error) {
            console.error('Analytics Error:', error)
        }
    }

    // Handle Path Changes
    useEffect(() => {
        if (!hasTrackedInitial.current) {
            hasTrackedInitial.current = true
            return
        }

        if (prevPathRef.current !== pathname) {
            const duration = Date.now() - startTime.current
            sendData(prevPathRef.current, duration)

            startTime.current = Date.now()
            prevPathRef.current = pathname
            maxScroll.current = 0 // Reset scroll for new page
        }
    }, [pathname, searchParams]) // Add searchParams dependency if URL params change

    // Handle Tab Close / Unload
    useEffect(() => {
        const handleUnload = () => {
            const duration = Date.now() - startTime.current
            sendData(pathname, duration)
        }
        window.addEventListener('beforeunload', handleUnload)
        return () => window.removeEventListener('beforeunload', handleUnload)
    }, [pathname, demographics])

    // Survey UI
    if (showSurvey && !surveySubmitted) {
        return (
            <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl border border-blue-500/30 bg-black/90 p-6 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-white">Quick Question?</h3>
                    <button onClick={() => setShowSurvey(false)} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <p className="mb-4 text-sm text-gray-400">Help us tailor your experience. (Optional)</p>
                <form onSubmit={handleSurveySubmit} className="flex flex-col gap-3">
                    <select
                        className="rounded border border-zinc-700 bg-zinc-800 p-2 text-sm text-white focus:border-blue-500 outline-none"
                        value={demographics.age}
                        onChange={(e) => setDemographics(prev => ({ ...prev, age: e.target.value }))}
                    >
                        <option value="Unknown">Select Age Group</option>
                        <option value="Under 18">Under 18</option>
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45-54">45-54</option>
                        <option value="55+">55+</option>
                    </select>
                    <select
                        className="rounded border border-zinc-700 bg-zinc-800 p-2 text-sm text-white focus:border-blue-500 outline-none"
                        value={demographics.gender}
                        onChange={(e) => setDemographics(prev => ({ ...prev, gender: e.target.value }))}
                    >
                        <option value="Unknown">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    <button type="submit" className="mt-2 w-full rounded bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-500 transition-colors">
                        Submit
                    </button>
                </form>
            </div>
        )
    }

    return null
}

export default function AnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerContent />
        </Suspense>
    )
}
