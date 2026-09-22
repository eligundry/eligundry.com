import type { ResumeSource } from '../model'

/** A small resume for tests, shaped like getResumeSource()'s output. */
export const fixtureSource = (): ResumeSource => ({
  basics: {
    name: 'Eli Gundry',
    label: { id: 'basics:label', markdown: 'Full Stack Web Engineer' },
    tagline: { id: 'basics:tagline', markdown: 'Typescript' },
    summary: { id: 'basics:summary', markdown: '' },
    email: 'eligundry@gmail.com',
    phone: '347.523.2652',
    url: 'https://eligundry.com',
    location: { city: 'Astoria', region: 'NY', countryCode: 'US' },
    profiles: [
      {
        network: 'GitHub',
        username: 'eligundry',
        url: 'https://github.com/eligundry',
      },
    ],
  },
  sections: [
    {
      id: 'section:work',
      title: 'Work',
      printTitle: 'Selected Work History',
      items: [
        {
          id: 'chord',
          type: 'work',
          organization: 'Chord Commerce',
          position: 'Staff Software Engineer',
          url: 'https://chord.co',
          location: { city: 'New York', region: 'NY', countryCode: 'US' },
          startDate: '2022-02-07',
          endDate: '2023-11-27',
          highlights: [
            { id: 'chord:0', markdown: 'Built a [React SDK](https://x.dev).' },
            {
              id: 'chord:1',
              markdown: 'Wrote <abbr title="docs">docs</abbr> &amp; more.',
            },
          ],
        },
        {
          id: 'radioshack',
          type: 'work',
          organization: 'RadioShack',
          position: 'Sales Associate',
          url: 'https://www.radioshack.com/',
          location: { city: 'Wooster', region: 'OH', countryCode: 'US' },
          startDate: '2009-06-01',
          endDate: '2010-03-01',
          printHide: true,
          summary: { id: 'radioshack:summary', markdown: 'Sold electronics.' },
          highlights: [],
        },
      ],
    },
    {
      id: 'section:education',
      title: 'Education',
      items: [
        {
          id: 'kent-state-university',
          type: 'education',
          organization: 'Kent State University',
          position: 'Computer Science - Coursework Towards BS',
          url: 'https://www.kent.edu/',
          location: { city: 'Kent', region: 'OH', countryCode: 'US' },
          startDate: '2009-08-01',
          endDate: '2015-05-01',
          area: 'Computer Science',
          studyType: 'Coursework Towards BS',
          summary: {
            id: 'kent-state-university:summary',
            markdown: 'Studied.',
          },
          highlights: [],
        },
      ],
    },
    {
      id: 'section:skills',
      title: 'Skills & Technologies',
      items: [
        {
          id: 'skills:languages',
          name: 'Languages',
          level: 'Fluent',
          lead: 'Fluent in',
          keywords: [
            { name: 'TypeScript', url: 'https://www.typescriptlang.org/' },
            { name: 'Go', url: 'https://golang.org/' },
            { name: 'PHP', url: 'https://www.php.net/' },
          ],
        },
        {
          id: 'skills:frameworks',
          name: 'Frameworks',
          lead: 'Built apps using',
          keywords: [{ name: 'React', url: 'https://reactjs.org/' }],
        },
      ],
    },
    {
      id: 'section:activities',
      title: 'Activities & Interests',
      items: [
        {
          id: 'activities:album-mode',
          markdown: 'Created [Album Mode.party](https://album-mode.party).',
          records: [
            {
              section: 'projects',
              name: 'Album Mode.party',
              url: 'https://album-mode.party',
            },
          ],
        },
        {
          id: 'activities:talks',
          markdown: 'Presented talks.',
          records: [
            {
              section: 'publications',
              name: 'Remixing A/B Tests',
              publisher: 'Remix NYC',
              releaseDate: '2023-04-12',
              url: 'https://eligundry.com/talks/remix-ab-testing/',
            },
          ],
        },
        {
          id: 'activities:eagle-scout',
          markdown: 'Eagle Scout',
          records: [{ section: 'awards', title: 'Eagle Scout', date: '2006' }],
        },
      ],
    },
  ],
})
