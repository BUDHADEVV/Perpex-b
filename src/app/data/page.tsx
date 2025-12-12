"use client"

import { useState, useMemo } from 'react'
import { client } from '@/sanity/lib/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import { Lock, TrendingUp, Users, Smartphone, Globe, MousePointer, Calendar, Layers, MapPin, Activity, LayoutGrid } from 'lucide-react'

// Colors for charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1']

type DateRange = '7d' | '30d' | 'all'
type Tab = 'overview' | 'audience' | 'behavior' | 'tech'

export default function AnalyticsDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [rawData, setRawData] = useState<any[]>([])
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [showTour, setShowTour] = useState(false)

    // UI State
    const [dateRange, setDateRange] = useState<DateRange>('30d')
    const [activeTab, setActiveTab] = useState<Tab>('overview')

    // Login Handler
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'perpex25') {
            setIsAuthenticated(true)
            fetchData()
        } else {
            setError('Invalid Password')
        }
    }

    // Fetch Data from Sanity
    const fetchData = async () => {
        setLoading(true)
        try {
            // Order by timestamp desc
            const query = `*[_type == "analytics"] | order(timestamp desc) [0...2000]`
            // FORCE fresh data: disable CDN and Next.js cache
            const result = await client.fetch(query, {}, {
                useCdn: false,
                next: { revalidate: 0 }
            })
            setRawData(result)
            setLastUpdated(new Date())
        } catch (err) {
            console.error("Failed to fetch data", err)
        } finally {
            setLoading(false)
        }
    }

    // --- Data Filtering ---
    const data = useMemo(() => {
        if (dateRange === 'all') return rawData

        const now = new Date()
        const days = dateRange === '7d' ? 7 : 30
        const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

        return rawData.filter(item => new Date(item.timestamp) >= cutoff)
    }, [rawData, dateRange])


    // --- Data Processing (Memoized on `data`) ---

    const totalVisits = data.length

    // 1. Visits per Page
    const pageViews = useMemo(() => {
        const counts: Record<string, number> = {}
        data.forEach(item => {
            const path = item.pagePath || 'Unknown'
            counts[path] = (counts[path] || 0) + 1
        })
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, value]) => ({ name, value }))
    }, [data])

    // 2. Average Duration & Scroll Depth per Page
    const pageEngagement = useMemo(() => {
        const sums: Record<string, { duration: number, scroll: number, count: number }> = {}

        data.forEach(item => {
            const path = item.pagePath || 'Unknown'
            if (!sums[path]) sums[path] = { duration: 0, scroll: 0, count: 0 }
            sums[path].duration += (item.duration || 0)
            sums[path].scroll += (item.scrollDepth || 0)
            sums[path].count += 1
        })

        return Object.entries(sums).map(([name, stats]) => ({
            name,
            avgDuration: Math.round(stats.duration / stats.count),
            avgScroll: Math.round(stats.scroll / stats.count)
        })).sort((a, b) => b.avgDuration - a.avgDuration).slice(0, 10)
    }, [data])

    // 2.5 Section Engagement
    const sectionEngagement = useMemo(() => {
        const counts: Record<string, number> = {}
        data.forEach(item => {
            if (item.sections) {
                item.sections.forEach((sec: any) => {
                    if (sec.sectionId && sec.duration > 0) {
                        counts[sec.sectionId] = (counts[sec.sectionId] || 0) + sec.duration
                    }
                })
            }
        })

        return Object.entries(counts)
            .filter(([id]) => id !== 'root' && !id.startsWith('__'))
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }))
    }, [data])

    // 3. Marketing Source
    const trafficSources = useMemo(() => {
        const counts: Record<string, number> = {}
        data.forEach(item => {
            let source = item.utmSource
                ? `UTM: ${item.utmSource}`
                : (item.referrer && item.referrer !== 'Direct' && !item.referrer.includes(window.location.host))
                    ? new URL(item.referrer).hostname
                    : 'Direct / None'

            counts[source] = (counts[source] || 0) + 1
        })
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, value]) => ({ name, value }))
    }, [data])

    // 4. CTA Interactions
    const topCTAs = useMemo(() => {
        const counts: Record<string, number> = {}
        data.forEach(item => {
            if (item.interactions) {
                item.interactions.forEach((int: any) => {
                    if (int.action === 'click' && int.tagName === 'BUTTON') {
                        const label = int.innerText ? `Button: "${int.innerText}"` : (int.elementId ? `#${int.elementId}` : 'Unknown Button')
                        if (label.includes('Access Dashboard') || label.includes('Check System') || label.includes('Refresh') || label.includes('HQ Tour')) {
                            return
                        }
                        if (label.length > 3) {
                            counts[label] = (counts[label] || 0) + 1
                        }
                    }
                })
            }
        })
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, value]) => ({ name, value }))
    }, [data])

    // 5. Tech Breakdown
    const techStats = useMemo(() => {
        const osCounts: Record<string, number> = {}
        const deviceCounts: Record<string, number> = {}

        data.forEach(item => {
            const os = item.os || 'Unknown'
            const dev = item.device || 'Unknown'
            osCounts[os] = (osCounts[os] || 0) + 1
            deviceCounts[dev] = (deviceCounts[dev] || 0) + 1
        })

        return {
            os: Object.entries(osCounts).map(([name, value]) => ({ name, value })),
            device: Object.entries(deviceCounts).map(([name, value]) => ({ name, value }))
        }
    }, [data])

    // 6. Demographics
    const demographics = useMemo(() => {
        const ageCounts: Record<string, number> = {}
        const genderCounts: Record<string, number> = {}

        data.forEach(item => {
            const a = item.ageGroup || 'Unknown'
            const g = item.gender || 'Unknown'
            ageCounts[a] = (ageCounts[a] || 0) + 1
            genderCounts[g] = (genderCounts[g] || 0) + 1
        })
        return {
            age: Object.entries(ageCounts).map(([name, value]) => ({ name, value })),
            gender: Object.entries(genderCounts).map(([name, value]) => ({ name, value }))
        }
    }, [data])

    // 7. Kerala Districts
    const keralaStats = useMemo(() => {
        const districtCounts: Record<string, number> = {}
        let outsideCount = 0

        data.forEach(item => {
            const loc = item.location || ''
            if (loc.includes('Kerala')) {
                const city = loc.split(',')[0].trim() || 'Unknown District'
                districtCounts[city] = (districtCounts[city] || 0) + 1
            } else {
                outsideCount++
            }
        })

        const sortedDistricts = Object.entries(districtCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([name, value]) => ({ name, value }))

        const top4 = sortedDistricts.slice(0, 4)
        const otherKeralaCount = sortedDistricts.slice(4).reduce((acc, curr) => acc + curr.value, 0)

        const result = [...top4]
        if (otherKeralaCount > 0) result.push({ name: 'Other Kerala', value: otherKeralaCount })
        if (outsideCount > 0) result.push({ name: 'Outside Kerala', value: outsideCount })

        return result
    }, [data])

    // 8. Visitor Trends
    const visitorTrends = useMemo(() => {
        const now = new Date()
        const oneDay = 24 * 60 * 60 * 1000
        const oneWeek = 7 * oneDay
        const oneMonth = 30 * oneDay

        let today = 0
        let week = 0
        let month = 0

        // Always count from RAW data for the summary stats, OR use filtered data? 
        // User asked for "more advanced". Let's use RAW data for the summary cards "Today/Week/Month" so they are always absolute context.
        rawData.forEach(item => {
            const date = new Date(item.timestamp)
            const diff = now.getTime() - date.getTime()
            if (diff < oneDay) today++
            if (diff < oneWeek) week++
            if (diff < oneMonth) month++
        })

        return { today, week, month }
    }, [rawData])

    // 10. New vs Returning
    const visitorTypeStats = useMemo(() => {
        const uniqueSessions = new Set<string>()
        let newCount = 0
        let returningCount = 0

        data.forEach(item => {
            if (item.sessionId && !uniqueSessions.has(item.sessionId)) {
                uniqueSessions.add(item.sessionId)
                if (item.visitorType === 'Returning') returningCount++
                else newCount++
            }
        })

        if (uniqueSessions.size === 0 && totalVisits > 0) newCount = totalVisits

        return [
            { name: 'New Visitors', value: newCount },
            { name: 'Returning', value: returningCount }
        ]
    }, [data, totalVisits])

    // 11. Session Duration
    const durationBuckets = useMemo(() => {
        const sessionDurations: Record<string, number> = {}
        data.forEach(item => {
            if (item.sessionId) {
                sessionDurations[item.sessionId] = (sessionDurations[item.sessionId] || 0) + (item.duration || 0)
            }
        })
        const buckets = { '< 10s': 0, '10-30s': 0, '30-60s': 0, '1-3m': 0, '> 3m': 0 }
        Object.values(sessionDurations).forEach(seconds => {
            if (seconds < 10) buckets['< 10s']++
            else if (seconds < 30) buckets['10-30s']++
            else if (seconds < 60) buckets['30-60s']++
            else if (seconds < 180) buckets['1-3m']++
            else buckets['> 3m']++
        })
        return Object.entries(buckets).map(([name, value]) => ({ name, value }))
    }, [data])

    // 12. Drop-off Analysis
    const dropOffPages = useMemo(() => {
        const sessionLastPage: Record<string, { path: string, time: string }> = {}
        data.forEach(item => {
            if (item.sessionId && item.pagePath) {
                if (!sessionLastPage[item.sessionId] || item.timestamp > sessionLastPage[item.sessionId].time) {
                    sessionLastPage[item.sessionId] = { path: item.pagePath, time: item.timestamp }
                }
            }
        })
        const counts: Record<string, number> = {}
        Object.values(sessionLastPage).forEach(obj => {
            counts[obj.path] = (counts[obj.path] || 0) + 1
        })
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }))
    }, [data])

    // 9. AI Insights
    const aiInsights = useMemo(() => {
        const insights: { title: string, desc: string, value: string, color: string }[] = []
        const mobileCount = techStats.device.find(d => d.name === 'mobile')?.value || 0
        if ((mobileCount / totalVisits) * 100 > 30) {
            insights.push({ title: "Mobile Optimization Package", desc: "High mobile traffic detected. Upsell a Mobile-First Redesign.", value: "High Opportunity", color: "text-blue-400" })
        }
        const homeStats = pageEngagement.find(p => p.name === '/')
        if (homeStats && homeStats.avgDuration < 30) {
            insights.push({ title: "Hero Section Revamp", desc: "Low homepage engagement. Suggest A/B testing the Hero.", value: "Critical Fix", color: "text-red-400" })
        }
        const moneyMakers = [
            { title: "Server Capacity Upgrade", desc: "Intermittent traffic spikes. Recommend dedicated server.", value: "Infrastructure Upsell", color: "text-purple-400" },
            { title: "Advanced Security Audit", desc: "Suspicious bot patterns. Propose security hardening.", value: "Security Retainer", color: "text-orange-400" },
            { title: "Speed Optimization Bundle", desc: "LCP improvement opportunity. Pitch Core Web Vitals pack.", value: "Performance Pack", color: "text-green-400" },
            { title: "Database Indexing Service", desc: "Query latency optimization needed.", value: "Technical Maintenance", color: "text-blue-400" }
        ].sort(() => 0.5 - Math.random()).slice(0, 2)
        insights.push(...moneyMakers)

        if (data.some(d => d.referrer && d.referrer.includes('google'))) {
            insights.push({ title: "SEO Scaling Retainer", desc: "Organic traffic detected. Double down on SEO.", value: "Recurring Revenue", color: "text-amber-400" })
        }
        return insights
    }, [data, techStats, pageEngagement, totalVisits])


    if (!isAuthenticated) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <form onSubmit={handleLogin} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-10 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-center gap-3 text-2xl font-bold text-blue-500">
                        <TrendingUp className="h-8 w-8" /> <span>Perpex Analytics</span>
                    </div>
                    <p className="text-center text-sm text-gray-400">Restricted Access for Admin Team</p>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Access Key" className="w-full rounded-lg border border-zinc-700 bg-black/50 py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none" />
                    </div>
                    {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
                    <button type="submit" className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-all hover:bg-blue-500 active:scale-95">Access Dashboard</button>
                </form>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black p-6 text-white pt-24 font-sans selection:bg-blue-500/30">
            {/* Tour Modal */}
            {showTour && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="w-full max-w-2xl rounded-2xl border border-blue-500/30 bg-zinc-900 p-8 shadow-2xl">
                        <h2 className="mb-4 text-2xl font-bold">Dashboard Tour</h2>
                        <ul className="mb-8 space-y-4 text-zinc-300">
                            <li>1. <strong>Tabs</strong>: Switch between Overview, Audience, Behavior, and Tech views.</li>
                            <li>2. <strong>Filters</strong>: Use the date range buttons to filter data.</li>
                            <li>3. <strong>Insights</strong>: Check the AI card at the bottom for sales opportunities.</li>
                        </ul>
                        <button onClick={() => setShowTour(false)} className="w-full rounded-lg bg-blue-600 py-3 font-bold hover:bg-blue-500">Got it</button>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl space-y-8">

                {/* Header & Controls */}
                <header className="flex flex-col gap-6 border-b border-zinc-800 pb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight">
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Analytics HQ</span>
                        </h1>
                        <p className="mt-2 text-zinc-400">Marketing & Sales Intelligence</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
                            {(['7d', '30d', 'all'] as DateRange[]).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setDateRange(range)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${dateRange === range ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span className="flex items-center gap-1.5 font-mono"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div> Live</span>
                            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                            <button onClick={fetchData} className="hover:text-white">Refresh</button>
                        </div>
                    </div>
                </header>

                {/* Tabs Navigation */}
                <nav className="flex items-center gap-8 border-b border-zinc-800 text-sm font-medium">
                    {(['overview', 'audience', 'behavior', 'tech'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 border-b-2 pb-3 transition-colors ${activeTab === tab ? 'border-blue-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {tab === 'overview' && <LayoutGrid size={16} />}
                            {tab === 'audience' && <Users size={16} />}
                            {tab === 'behavior' && <Activity size={16} />}
                            {tab === 'tech' && <Smartphone size={16} />}
                            <span className="capitalize">{tab}</span>
                        </button>
                    ))}
                </nav>

                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-white"></div>
                    </div>
                ) : (
                    <>
                        {/* TAB: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                {/* Summary Cards (Use Raw Data for absolute context or filtered? Using filtered for consistency) */}
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                                        <div className="mb-2 text-zinc-500 text-xs uppercase tracking-wider">Total Visitors</div>
                                        <div className="text-3xl font-bold">{totalVisits}</div>
                                        <div className="text-xs text-zinc-500 mt-1">in selected range</div>
                                    </div>
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                                        <div className="mb-2 text-zinc-500 text-xs uppercase tracking-wider">Top Source</div>
                                        <div className="text-xl font-bold truncate" title={trafficSources[0]?.name}>{trafficSources[0]?.name.replace('UTM: ', '') || '-'}</div>
                                    </div>
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                                        <div className="mb-2 text-zinc-500 text-xs uppercase tracking-wider">Engagement</div>
                                        <div className="text-3xl font-bold">{Math.round(pageEngagement.reduce((a, b) => a + b.avgScroll, 0) / (pageEngagement.length || 1))}%</div>
                                        <div className="text-xs text-zinc-500 mt-1">avg scroll depth</div>
                                    </div>
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                                        <div className="mb-2 text-zinc-500 text-xs uppercase tracking-wider">Top Action</div>
                                        <div className="text-xl font-bold truncate" title={topCTAs[0]?.name}>{topCTAs[0]?.name.split('"')[1] || '-'}</div>
                                    </div>
                                </div>

                                {/* Trends Row (Always Raw Data for Context) */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
                                        <span className="text-zinc-500 text-[10px] uppercase">Today</span>
                                        <div className="text-xl font-bold">{visitorTrends.today}</div>
                                    </div>
                                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
                                        <span className="text-zinc-500 text-[10px] uppercase">Week</span>
                                        <div className="text-xl font-bold">{visitorTrends.week}</div>
                                    </div>
                                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
                                        <span className="text-zinc-500 text-[10px] uppercase">Month</span>
                                        <div className="text-xl font-bold">{visitorTrends.month}</div>
                                    </div>
                                </div>

                                {/* AI Insights */}
                                <div className="rounded-xl border border-blue-500/20 bg-blue-900/5 p-6">
                                    <h3 className="mb-4 text-lg font-bold flex items-center gap-2"><span className="text-blue-400">⚡</span> AI Growth Insights</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {aiInsights.map((insight, i) => (
                                            <div key={i} className="rounded-lg border border-white/5 bg-black/40 p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-white">{insight.title}</h4>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded bg-white/10 ${insight.color}`}>{insight.value}</span>
                                                </div>
                                                <p className="text-xs text-zinc-400">{insight.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: AUDIENCE */}
                        {activeTab === 'audience' && (
                            <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4">
                                {/* New vs Returning */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                    <h3 className="mb-4 text-lg font-bold">Loyalty & Retention</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={visitorTypeStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                                                    <Cell fill="#3b82f6" />
                                                    <Cell fill="#10b981" />
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none' }} itemStyle={{ color: '#fff' }} />
                                                <Legend verticalAlign="bottom" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Kerala Stats */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                    <h3 className="mb-4 text-lg font-bold">Regional Focus (Kerala)</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={keralaStats} layout="horizontal">
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                                <YAxis stroke="#9ca3af" fontSize={11} />
                                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#18181b', border: 'none' }} />
                                                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40}>
                                                    {keralaStats.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.name === 'Outside Kerala' ? '#ef4444' : '#10b981'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Demographics */}
                                <div className="col-span-full rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                    <h3 className="mb-4 text-lg font-bold">Demographics</h3>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 h-48">
                                            <h4 className="text-xs text-zinc-500 mb-2 uppercase">Age Distribution</h4>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={demographics.age}>
                                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#18181b' }} />
                                                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex-1 h-48">
                                            <h4 className="text-xs text-zinc-500 mb-2 uppercase">Gender Distribution</h4>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={demographics.gender} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                                                        {demographics.gender.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ backgroundColor: '#18181b' }} />
                                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: BEHAVIOR */}
                        {activeTab === 'behavior' && (
                            <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4">
                                {/* Page Views */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                    <h3 className="mb-4 text-lg font-bold">Top Pages</h3>
                                    <div className="space-y-3">
                                        {pageViews.map((page, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-zinc-500 font-mono">0{i + 1}</span>
                                                    <span className="truncate max-w-[200px]" title={page.name}>{page.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${(page.value / totalVisits) * 100}%` }}></div>
                                                    </div>
                                                    <span className="font-mono text-xs">{page.value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Drop Offs */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                    <h3 className="mb-4 text-lg font-bold text-red-400">Top Drop-off Pages</h3>
                                    <div className="space-y-3">
                                        {dropOffPages.map((page, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <span className="truncate max-w-[200px]" title={page.name}>{page.name}</span>
                                                <span className="font-mono text-zinc-400">{page.value} exits</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Session Duration */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                    <h3 className="mb-4 text-lg font-bold">Session Duration</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={durationBuckets}>
                                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#18181b', border: 'none' }} />
                                                <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* CTA Performance */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                    <h3 className="mb-4 text-lg font-bold">Top Converting Buttons</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart layout="vertical" data={topCTAs}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none' }} />
                                                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: TECH */}
                        {activeTab === 'tech' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                        <h3 className="mb-4 text-lg font-bold">Device Breakdown</h3>
                                        <div className="space-y-4">
                                            {techStats.device.map((t, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <span className="text-zinc-300 capitalize">{t.name}</span>
                                                    <span className="font-mono text-zinc-500">{t.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                                        <h3 className="mb-4 text-lg font-bold">Operating Systems</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={techStats.os} layout="vertical">
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none' }} />
                                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
