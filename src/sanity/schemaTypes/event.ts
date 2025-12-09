import { defineField, defineType } from 'sanity'

export const event = defineType({
    name: 'event',
    title: 'Events & Hackathons',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Event Title',
            type: 'string',
        }),
        defineField({
            name: 'date',
            title: 'Event Date',
            type: 'datetime',
        }),
        defineField({
            name: 'location',
            title: 'Location / Venue',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: ['Upcoming', 'Completed', 'Live'],
                layout: 'radio'
            },
            initialValue: 'Upcoming'
        }),
    ],
})
