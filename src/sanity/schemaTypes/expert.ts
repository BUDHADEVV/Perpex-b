import { defineField, defineType } from 'sanity'

export const expert = defineType({
    name: 'expert',
    title: 'Expert Session',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Expert Name (Internal)',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Expert Image',
            type: 'image',
            options: {
                hotspot: true
            }
        }),
        defineField({
            name: 'link',
            title: 'Link (Instagram/Reel)',
            type: 'url',
        })
    ],
})
