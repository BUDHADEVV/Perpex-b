import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export async function GET() {
    const token = process.env.SANITY_API_TOKEN

    if (!token) {
        return NextResponse.json({
            status: 'error',
            message: 'Missing SANITY_API_TOKEN in server environment.',
            env: { projectId, dataset }
        }, { status: 500 })
    }

    try {
        const client = createClient({
            projectId,
            dataset,
            apiVersion,
            useCdn: false,
            token: token,
        })

        // Try to create a dummy doc to verify write permissions
        const doc = await client.create({
            _type: 'analytics',
            pagePath: '/test-verification',
            timestamp: new Date().toISOString(),
            duration: 0,
            isTest: true
        })

        // Clean it up immediately
        await client.delete(doc._id)

        return NextResponse.json({
            status: 'success',
            message: 'Write permission verified. Token is valid.'
        })

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: `Sanity Write Failed: ${error.message}`
        }, { status: 500 })
    }
}
