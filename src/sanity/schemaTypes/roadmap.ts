import { defineField, defineType } from 'sanity'

export const roadmap = defineType({
    name: 'roadmap',
    title: 'Roadmap Milestones',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Milestone Title (e.g. INCEPTION)',
            type: 'string',
        }),
        defineField({
            name: 'badge',
            title: 'Badge Number (e.g. 01)',
            type: 'string',
        }),
        defineField({
            name: 'items',
            title: 'Checklist Items',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'hasEmoji',
            title: 'Has Rocket Emoji?',
            type: 'boolean'
        })
    ],
})
