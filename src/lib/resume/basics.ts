import config from '../../config'

// Contact details shared by the resume's print header/footer and
// /resume.json. Maps onto JSON Resume `basics`.
export const resumeBasics = {
  name: 'Eli Gundry',
  label: 'Full Stack Web Engineer',
  tagline: '❤️ Typescript, AI and everything inbetween',
  email: 'eligundry@gmail.com',
  phone: '347.523.2652',
  url: config.url,
  location: {
    city: 'Astoria',
    region: 'NY',
    countryCode: 'US',
  },
  profiles: [
    {
      network: 'GitHub',
      username: 'eligundry',
      url: 'https://github.com/eligundry',
    },
  ],
}

export type ResumeBasics = typeof resumeBasics
