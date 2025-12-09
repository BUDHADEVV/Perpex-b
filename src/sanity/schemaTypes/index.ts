import { type SchemaTypeDefinition } from 'sanity'
import { hero } from './hero'
import { expert } from './expert'
import { roadmap } from './roadmap'
import { faq } from './faq'
import { program } from './program'
import { analytics } from './analytics'

import { event } from './event'
import { booking } from './booking'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [hero, expert, roadmap, faq, program, analytics, event, booking],
}
