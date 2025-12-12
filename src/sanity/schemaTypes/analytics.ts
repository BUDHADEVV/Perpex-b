import { defineField, defineType } from 'sanity'

export const analytics = defineType({
    name: 'analytics',
    title: 'Analytics Data',
    type: 'document',
    fields: [
        defineField({
            name: 'pagePath',
            title: 'Page Path',
            type: 'string',
        }),
        defineField({
            name: 'location',
            title: 'Location (District/City)',
            type: 'string',
        }),
        defineField({
            name: 'country',
            title: 'Country',
            type: 'string',
        }),
        defineField({
            name: 'duration',
            title: 'Time Spent (seconds)',
            type: 'number',
        }),
        defineField({
            name: 'visits',
            title: 'Visit Count',
            type: 'number',
            initialValue: 1,
        }),
        defineField({
            name: 'scrollDepth',
            title: 'Max Scroll Depth (%)',
            type: 'number',
        }),
        // Technical Data
        defineField({
            name: 'device',
            title: 'Device Type',
            type: 'string', // e.g., 'mobile', 'desktop'
        }),
        defineField({
            name: 'os',
            title: 'Operating System',
            type: 'string'
        }),
        defineField({
            name: 'browser',
            title: 'Browser',
            type: 'string'
        }),
        defineField({
            name: 'screenSize',
            title: 'Screen Size',
            type: 'string'
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string'
        }),
        // Marketing / Traffic Source
        defineField({
            name: 'referrer',
            title: 'Referrer',
            type: 'string'
        }),
        defineField({
            name: 'utmSource',
            title: 'UTM Source',
            type: 'string'
        }),
        defineField({
            name: 'utmMedium',
            title: 'UTM Medium',
            type: 'string'
        }),
        defineField({
            name: 'utmCampaign',
            title: 'UTM Campaign',
            type: 'string'
        }),
        // User demographics
        defineField({
            name: 'gender',
            title: 'Gender',
            type: 'string',
            options: {
                list: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Unknown'],
            },
            initialValue: 'Unknown'
        }),
        defineField({
            name: 'ageGroup',
            title: 'Age Group',
            type: 'string',
            options: {
                list: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+', 'Unknown'],
            },
            initialValue: 'Unknown'
        }),
        defineField({
            name: 'interactions',
            title: 'Interactions',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'elementId', type: 'string' },
                        { name: 'tagName', type: 'string' },
                        { name: 'innerText', type: 'string' }, // Capture button text for better CTA tracking
                        { name: 'action', type: 'string' }, // 'click', 'scroll'
                        { name: 'timestamp', type: 'string' },
                        { name: 'x', type: 'number' },
                        { name: 'y', type: 'number' }
                    ],
                },
            ],
        }),
        defineField({
            name: 'sections',
            title: 'Section Engagement',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'sectionId', type: 'string' },
                        { name: 'duration', type: 'number' }, // milliseconds or seconds
                    ],
                },
            ],
        }),
        defineField({
            name: 'timestamp',
            title: 'Recorded At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'sessionId',
            title: 'Session ID',
            type: 'string',
        }),
        defineField({
            name: 'visitorType',
            title: 'Visitor Type',
            type: 'string', // 'New' or 'Returning'
        }),
    ],
})
