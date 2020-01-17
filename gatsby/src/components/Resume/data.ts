export interface Location {
  address: string
  postalCode: string
  city: string
  countryCode: string
  region: string
}

export interface Experience {
  position: string
  website: string
  startDate: Date
  endDate: Date | null
  summary: string
  highlights: string[]
  location: Partial<Location>
}

export interface Work extends Experience {
  company: string
}

export interface Volunteer extends Experience {
  organization: string
}

export interface Profile {
  network: string
  username: string
  url: string
}

export interface Basics {
  name: string
  label: string
  picture?: string
  email: string
  phone: string
  website: string
  summary?: string
  location: Partial<Location>
  profiles?: Profile[]
}

export interface Education {
  institution: string
  area: string
  studyType?: string
  startDate: Date
  endDate: Date
  completed: boolean
  gpa?: number
  location: Partial<Location>
  summary: string
}

export interface Skills {
  name: string
  level: string
  keywords: string[]
}

export interface Resume {
  basics: Basics
  work: Work[]
  education: Education[]
  skills: Skills[]
  volunteer?: Volunteer[]
}

const resume: Resume = {
  basics: {
    name: 'Eli Gundry',
    label: 'Software Engineer',
    email: 'eligundry@gmail.com',
    phone: '3308286147',
    website: 'https://eligundry.com',
    location: {
      city: 'Long Island City',
      countryCode: 'US',
      region: 'NY',
    },
  },
  work: [
    {
      company: 'Talent Inc.',
      position: 'Senior Software Engineer',
      website: 'https://www.talentinc.com/',
      location: {
        city: 'New York',
        countryCode: 'US',
        region: 'NY',
      },
      startDate: new Date('2018-01-03'),
      endDate: null,
      summary: '',
      highlights: [],
    },
    {
      company: 'Croscon',
      position: 'Principal Engineer',
      website: 'http://croscon.com',
      location: {
        city: 'New York',
        countryCode: 'US',
        region: 'NY',
      },
      startDate: new Date('2015-04-01'),
      endDate: new Date('2017-10-26'),
      summary: '',
      highlights: [
        `
        Instilled a culture of [software testing](https://en.wikipedia.org/wiki/Software_testing)
        into a company that previously had none, reducing the amount of time
        spent testing regressions manually across the company.
        `,
        `
        Developed large portions and was the principal engineer of
        [Weber Shandwick's](http://www.webershandwick.com/)
        MobileCommand, a public relations crisis management web
        application, and [GemSafe](https://www.gemsafe.com), an
        insurance platform, using [Python](https://www.python.org/)
        and [Flask](http://flask.pocoo.org/).
        `,
        `
        Co-authored [Fleaker](https://github.com/croscon/fleaker),
        which is a collection of sensible defaults and extensions for the
        [Flask](http://flask.pocoo.org/) web framework.
        `,
      ],
    },
    {
      company: 'Davey Tree',
      position: 'Web Development Consultant',
      website: 'http://www.davey.com',
      location: {
        city: 'Kent',
        countryCode: 'US',
        region: 'OH',
      },
      startDate: new Date('2014-11-01'),
      endDate: new Date('2015-04-01'),
      summary: `
        Architected [iTree Landscape](https://landscape.itreetools.org)
        using [Django](https://www.djangoproject.com) and
        [JavaScript](https://en.wikipedia.org/wiki/JavaScript), which
        uses satellite images and various data sources to determine where trees
        should be planted.
      `,
      highlights: [],
    },
    {
      company: 'PC Surgeons',
      position: 'Computer Technician',
      website: 'http://pcsurgeons.net',
      location: {
        city: 'Kent',
        countryCode: 'US',
        region: 'OH',
      },
      startDate: new Date('2013-10-01'),
      endDate: new Date('2014-12-01'),
      summary: `
        Repaired computers in a retail environment and provided support for
        customers' networks using [Linux](https://en.wikipedia.org/wiki/Linux)
        and [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows).
      `,
      highlights: [],
    },
    {
      company: 'Kent State University',
      position: 'Student IT Worker',
      website: 'http://www.kent.edu',
      location: {
        city: 'Kent',
        countryCode: 'US',
        region: 'OH',
      },
      startDate: new Date('2013-05-01'),
      endDate: new Date('2013-08-01'),
      summary: `
        Helped provide help desk support for
        [Kent State's College of Arts and Sciences](http://www.kent.edu/CAS/).
      `,
      highlights: [],
    },
    {
      company: 'Mindbox Studios',
      position: 'Web Developer',
      website: 'http://mindboxstudios.com',
      location: {
        city: 'Cincinnati',
        countryCode: 'US',
        region: 'OH',
      },
      startDate: new Date('2012-08-01'),
      endDate: new Date('2013-01-01'),
      summary: '',
      highlights: [
        `
        Used <a href="http://php.net">PHP</a> with the
        <a href="http://www.yiiframework.com">Yii Framework</a>
        to develop web applications and
        <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">RESTful APIs</a>.
        `,
        `
        Worked in a remote environment using agile development practices
        using <a href="http://www.redmine.org">RedMine</a>.
        `,
      ],
    },
    {
      company: 'Go Media',
      position: 'Web Developer',
      website: 'http://gomedia.us',
      location: {
        city: 'Cleveland',
        countryCode: 'US',
        region: 'OH',
      },
      startDate: new Date('2011-05-01'),
      endDate: new Date('2012-06-01'),
      summary: '',
      highlights: [
        `
        Used <a href="http://php.net">PHP</a> with the
        <a href="http://framework.zend.com">Zend Framework</a>
        to contribute to <a href="https://prooflab.us">Prooflab</a>,
        <a href="http://gomedia.us">Go Media's</a> project management web
        application.
        `,
        `
        Developed the <a href="http://2012.wmcfest.com">Weapons of Mass
        Creation Festival 2012</a>
        website using <a href="http://wordpress.org">WordPress</a>.
        `,
      ],
    },
    {
      company: 'Great Lakes Publishing',
      position: 'Web Development Intern',
      website: 'http://www.glpublishing.com',
      location: {
        city: 'Cleveland',
        countryCode: 'US',
        region: 'OH',
      },
      startDate: new Date('2010-09-01'),
      endDate: new Date('2011-05-01'),
      summary: '',
      highlights: [
        `
        Updated content for <a href="http://www.clevelandmagazine.com">
        Cleveland Magazine</a>, <a href="http://www.ohiomagazine.com">Ohio
        Magazine</a>, and other <a href="http://glpublishing.com">Great
        Lakes Publishing</a> entities.
        `,
        `
        Implemented websites for <a href="http://www.guesthouseclevelandclinic.com/CCGH/ClevelandClinicGuesthouse.aspx">Cleveland Clinic Guesthouse</a>
        and <a href="http://www.intercontinentalsuitescleveland.com/ISC/InterContinentalSuitesCleveland.aspx">InterContinental Suites Cleveland</a>.
        `,
      ],
    },
    {
      company: 'eTek United',
      position: 'Traveling IT Support',
      website: 'https://www.linkedin.com/company/etek-united',
      location: {
        city: 'Canton',
        countryCode: 'US',
        region: 'OH',
      },
      startDate: new Date('2010-03-01'),
      endDate: new Date('2010-09-01'),
      summary: `
      Provided IT support for customers in their homes and setup various internet cafés around Ohio.
      `,
      highlights: [],
    },
    {
      company: 'RadioShack',
      position: 'Sales Associate',
      website: 'https://www.radioshack.com/',
      location: {
        city: 'Wooster',
        countryCode: 'US',
        region: 'OH',
      },
      startDate: new Date('2009-06-01'),
      endDate: new Date('2010-03-01'),
      summary:
        'Sold consumer electronics and cell phones in a retail environment.',
      highlights: [],
    },
  ],
  education: [
    {
      institution: 'Kent State University',
      area: 'Computer Science',
      studyType: 'Bachelor of Science',
      startDate: new Date('2009-08-01'),
      endDate: new Date('2015-05-01'),
      completed: false,
      location: {
        city: 'Kent',
        countryCode: 'US',
        region: 'OH',
      },
      summary: `
        Studied computer science, completed several internships &amp; attended
        numerous hackathons. Accepted full time offer from Croscon before
        completion.
      `,
    },
    {
      institution: 'Wayne County Schools Career Center',
      area: 'Interactive Media Cohort',
      startDate: new Date('2007-08-01'),
      endDate: new Date('2009-05-01'),
      completed: true,
      gpa: 3.3,
      location: {
        city: 'Smithville',
        countryCode: 'US',
        region: 'OH',
      },
      summary: `
        High school vocational program in which I learned the basics of
        <a href="https://en.wikipedia.org/wiki/HTML5">HTML</a>,
        <a href="https://en.wikipedia.org/wiki/Cascading_Style_Sheets">CSS</a>,
        <a href="https://en.wikipedia.org/wiki/JavaScript">JavaScript</a>,
        <a href="https://php.net/">PHP</a>,
        <a href="http://wordpress.org/">WordPress</a>,
        <a href="https://en.wikipedia.org/wiki/Adobe_Photoshop">Photoshop</a>,
        <a href="https://en.wikipedia.org/wiki/Adobe_Illustrator">Illustrator</a>,
        <a href="https://en.wikipedia.org/wiki/Adobe_Premiere_Pro">Premiere Pro</a>,
        &amp;
        <a href="https://en.wikipedia.org/wiki/Adobe_Flash">Flash</a>.
        Using these skills, I created websites used by classes and external clients.
      `,
    },
  ],
  skills: [
    {
      name: 'Languages',
      level: 'Master',
      keywords: [
        'Python',
        'Typescript',
        'JavaScript',
        'PHP',
        'Go',
        'SQL',
        'HTML5',
      ],
    },
    {
      name: 'Frameworks',
      level: 'Master',
      keywords: ['React', 'Flask', 'Django', 'Gin', 'Gatsby', 'WordPress'],
    },
    {
      name: 'Tools',
      level: 'Master',
      keywords: [
        'Vim',
        'Docker',
        'Git',
        'SaltStack',
        'GitHub Actions',
        'AWS Lambda',
      ],
    },
    {
      name: 'Love Hate',
      level: 'Master',
      keywords: ['Ansible', 'SQLAlchemy', 'jQuery', 'C#'],
    },
  ],
}

export default resume
