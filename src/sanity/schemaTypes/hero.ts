import { defineField, defineType } from 'sanity'

export const hero = defineType({
    name: 'hero',
    title: 'Hero Section',
    type: 'document',
    fields: [
        defineField({
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'string',
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'heroTagline',
            title: 'Hero Tagline (Small text)',
            type: 'string',
        }),
        defineField({
            name: 'heroButtonText',
            title: 'Hero Button Text',
            type: 'string',
        }),
        defineField({
            name: 'videoUrl',
            title: 'Mobile Video URL',
            type: 'url',
        }),
        defineField({
            name: 'desktopImages',
            title: 'Desktop Slider Images',
            type: 'array',
            of: [{ type: 'image' }],
        })
    ],
})
