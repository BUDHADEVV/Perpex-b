import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // We need a WRITE token. 
        // Start with process.env.SANITY_API_TOKEN
        const token = process.env.SANITY_API_TOKEN

        if (!token) {
            console.error("Missing SANITY_API_TOKEN. Cannot write analytics data.")
            return NextResponse.json({ error: 'Configuration Error: Missing API Token' }, { status: 500 })
        }

        const client = createClient({
            projectId,
            dataset,
            apiVersion,
            useCdn: false,
            token: token,
        })

        await client.create({
            _type: 'analytics',
            ...body
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Analytics API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
