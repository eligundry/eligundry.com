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
  printHide?: boolean
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
  keywords: { [keyword: string]: string }
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
      highlights: [
        'Completely rebuilt fulfillment platform using React & Go.',
        'Implemented single sign on through OpenID Connect across all internal applications company wide.',
        'Architected dynamic payment inititiaves that decreased cost of fulfillment by $3 and time to delivery by a day.',
      ],
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
        Instilled a culture of 
        <a href="https://en.wikipedia.org/wiki/Software_testing">software testing</a>
        into a company that previously had none, reducing the amount of time
        spent testing regressions manually across the company.
        `,
        `
        Developed large portions and was the principal engineer of
        <a href="http://www.webershandwick.com/">Weber Shandwick's</a>
        MobileCommand, a public relations crisis management web
        application, and <a href="https://www.gemsafe.com">GemSafe</a>, an
        insurance platform, using <a href="https://www.python.org/">Python</a>
        and <a href="http://flask.pocoo.org/">Flask</a>.
        `,
        `
        Co-authored <a href="https://github.com/croscon/fleaker">Fleaker</a>,
        which is a collection of sensible defaults and extensions for the
        <a href="http://flask.pocoo.org/">Flask</a> web framework.
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
        Architected <a href="https://landscape.itreetools.org">iTree Landscape</a>
        using <a href="https://www.djangoproject.com">Django</a> and
        <a href="https://en.wikipedia.org/wiki/JavaScript">JavaScript</a>, which
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
        customers' networks using <a href="https://en.wikipedia.org/wiki/Linux">Linux</a>
        and <a href="https://en.wikipedia.org/wiki/Microsoft_Windows">Windows</a>.
      `,
      highlights: [],
      printHide: true,
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
        <a href="http://www.kent.edu/CAS/">Kent State's College of Arts and Sciences</a>.
      `,
      highlights: [],
      printHide: true,
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
      printHide: true,
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
      keywords: {
        Python: 'https://www.python.org/',
        Typescript: 'https://www.typescriptlang.org/',
        JavaScript: 'https://en.wikipedia.org/wiki/JavaScript',
        PHP: 'https://www.php.net/',
        Go: 'https://golang.org/',
        SQL: 'https://en.wikipedia.org/wiki/SQL',
        HTML5: 'https://en.wikipedia.org/wiki/HTML5',
      },
    },
    {
      name: 'Frameworks',
      level: 'Master',
      keywords: {
        React: 'https://reactjs.org/',
        Flask: 'https://www.palletsprojects.com/p/flask/',
        Django: 'https://www.djangoproject.com/',
        Gin: 'https://gin-gonic.com/',
        'Gatsby.js': 'https://www.gatsbyjs.org/',
        WordPress: 'https://wordpress.org/',
      },
    },
    {
      name: 'Tools',
      level: 'Master',
      keywords: {
        Vim: 'https://www.vim.org/',
        Docker: 'https://www.docker.com/',
        Git: 'https://git-scm.com/',
        SaltStack: 'https://www.saltstack.com/',
        'GitHub Actions': 'https://github.com/features/actions',
        Serverless: 'https://serverless.com/',
      },
    },
    {
      name: 'Love Hate',
      level: 'Master',
      keywords: {
        Ansible: 'https://www.ansible.com/',
        SQLAlchemy: 'https://www.sqlalchemy.org/',
        jQuery: 'https://jquery.com/',
        Okta: 'https://www.okta.com/',
        Jenkins: 'https://jenkins.io/',
      },
    },
  ],
}

export default resume
