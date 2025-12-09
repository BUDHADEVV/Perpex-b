import { client } from "@/sanity/lib/client"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, phone, eventId } = body

        if (!name || !email || !eventId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify API Token presence
        if (!process.env.SANITY_API_TOKEN) {
            console.error('SANITY_API_TOKEN is missing')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        await client.create({
            _type: 'booking',
            name,
            email,
            phone,
            event: {
                _type: 'reference',
                _ref: eventId
            },
            status: 'New',
            submittedAt: new Date().toISOString()
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Booking Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
