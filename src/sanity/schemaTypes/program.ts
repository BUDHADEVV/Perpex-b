import { defineField, defineType } from 'sanity'

export const program = defineType({
    name: 'program',
    title: 'Program Feature',
    type: 'document',
    fields: [
        defineField({
            name: 'text',
            title: 'Feature Text',
            type: 'string',
        }),
        defineField({
            name: 'icon',
            title: 'Emoji Icon',
            type: 'string',
        }),
    ],
})
