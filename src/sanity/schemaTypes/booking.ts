import { defineField, defineType } from 'sanity'

export const booking = defineType({
    name: 'booking',
    title: 'Event Bookings',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Student Name',
            type: 'string',
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
        }),
        defineField({
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        }),
        defineField({
            name: 'event',
            title: 'Event',
            type: 'reference',
            to: [{ type: 'event' }],
        }),
        defineField({
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: ['New', 'Contacted', 'Confirmed'],
                layout: 'radio'
            },
            initialValue: 'New'
        }),
    ],
})
