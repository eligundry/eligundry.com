interface Location {
  address: string
  postalCode: string
  city: string
  countryCode: string
  region: string
}

interface Experience {
  position: string
  website: string
  startDate: string
  endDate: string | null
  summary: string
  highlights: string[]
  location: Partial<Location>
}

interface Work extends Experience {
  company: string
}

interface Volunteer extends Experience {
  organization: string
}

interface Profile {
  network: string
  username: string
  url: string
}

interface Basics {
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

interface Resume {
  basics: Basics
  work: Work[]
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
      startDate: '2018-01-03',
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
      startDate: '2015-04-01',
      endDate: '2017-10-26',
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
      startDate: '2014-11-01',
      endDate: '2015-04-01',
      summary: '',
      highlights: [
        `
        Architected [iTree Landscape](https://landscape.itreetools.org)
        using [Django](https://www.djangoproject.com) and
        [JavaScript](https://en.wikipedia.org/wiki/JavaScript), which
        uses satellite images and various data sources to determine where trees
        should be planted.
        `,
      ],
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
      startDate: '2013-10-01',
      endDate: '2014-12-01',
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
      startDate: '2013-05-01',
      endDate: '2013-08-01',
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
      startDate: '2012-08-01',
      endDate: '2013-01-01',
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
      startDate: '2011-05-01',
      endDate: '2012-06-01',
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
      startDate: '2010-09-01',
      endDate: '2011-05-01',
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
      startDate: '2010-03-01',
      endDate: '2010-09-01',
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
      startDate: '2009-06-01',
      endDate: '2010-03-01',
      summary:
        'Sold consumer electronics and cell phones in a retail environment.',
      highlights: [],
    },
  ],
}

export default resume
