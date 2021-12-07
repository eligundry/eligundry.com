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
  website: string
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
  activitesInterests: string[]
}

const resume: Resume = {
  basics: {
    name: 'Eli Gundry',
    label: 'Software Engineer',
    email: 'eligundry@gmail.com',
    phone: '347.523.2652',
    website: 'https://eligundry.com',
    location: {
      city: 'Astoria',
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
        `
        Tech lead for moving <a href="https://www.zipjob.com">ZipJob</a>
        to a statically compiled <a href="https://www.gatsbyjs.com/">Gatsby</a> 
        site backed by <a href="https://www.contentful.com/">Contentful CMS</a>, increasing the 
        <a href="https://developers.google.com/web/tools/lighthouse">Lighthouse</a> 
        score from 30 to 85 & enabling our marketing team to control all copy on the website.
        `,
        `
        Frontend tech lead for a Customer Portal that raised 
        <a href="https://en.wikipedia.org/wiki/Net_promoter_score"><abbr title="Net Promoter Score">NPS</abbr></a> 
        25 points & average customer revenue by $8.
        `,
        `
        Frontend tech lead for our rewritten Expert Hub, decreasing our average 
        time to order completion by 36 hours.
        `,
        `
        Tech lead for a dynamic payment & order offering system for contractors 
        which decreased our average cost to fulfill an order by $10 & increased 
        our average payout to contractors by $7.
        `,
        `
        Implemented single sign on through <a href="https://oauth.net/2/">OAuth</a> 
        across all internal applications company wide.
        `,
      ],
    },
    {
      company: 'Croscon',
      position: 'Principal Engineer',
      website: 'https://croscon.com',
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
      website: 'https://www.davey.com',
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
      website: 'https://www.kent.edu',
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
      website: 'https://mindboxstudios.com',
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
      website: 'https://gomedia.us',
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
      website: 'https://www.glpublishing.com',
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
      printHide: true,
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
      printHide: true,
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
      website: 'https://www.kent.edu/',
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
      website: 'http://www.wayne-jvs.k12.oh.us/',
      location: {
        city: 'Smithville',
        countryCode: 'US',
        region: 'OH',
      },
      summary: `
        High school vocational program where I learned the basics of
        <a href="https://en.wikipedia.org/wiki/HTML5">HTML</a>,
        <a href="https://en.wikipedia.org/wiki/Cascading_Style_Sheets">CSS</a>,
        <a href="https://en.wikipedia.org/wiki/JavaScript">JavaScript</a>,
        <a href="https://php.net/">PHP</a>,
        <a href="http://wordpress.org/">WordPress</a>,
        <a href="https://en.wikipedia.org/wiki/Adobe_Photoshop">Photoshop</a>,
        <a href="https://en.wikipedia.org/wiki/Adobe_Illustrator">Illustrator</a>,
        <a href="https://en.wikipedia.org/wiki/Adobe_Premiere_Pro">Premiere Pro</a>
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
        TypeScript: 'https://www.typescriptlang.org/',
        JavaScript: 'https://en.wikipedia.org/wiki/JavaScript',
        Go: 'https://golang.org/',
        PHP: 'https://www.php.net/',
        Python: 'https://www.python.org/',
        SQL: 'https://en.wikipedia.org/wiki/SQL',
        HTML: 'https://en.wikipedia.org/wiki/HTML5',
        CSS: 'https://www.w3.org/Style/CSS/Overview.en.html',
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
        'Google Tag Manager': 'https://tagmanager.google.com/',
      },
    },
  ],
  activitesInterests: [
    `
    Presented <a href="/talks">talks</a> at <a href="/talks/dots">The New York City Vim Meetup</a> 
    and <a href="/talks/redux-hooks">QueensJS</a>.`,
    `
    Former member of <a href="http://hacksu.cs.kent.edu/">HacKSU</a>, Kent State's hacker community and 
    <a href="https://devpost.com/eligundry">competed in numerous hackathons</a> including:
    <ul class="hackathons">
      <li><a href="https://khe.io/">KHE</a> 2013 (2nd place), 2014, 2015</li>
      <li><a href="https://mhacks.org/">MHacks</a> 2013, 2014, 2015</li>
      <li><a href="http://pennapps.com/">PennApps</a> 2014 (1st place Intel XDK App)</li>
      <li><a href="http://hackillinois.org/">HackIllinois</a> 2014</a></li>
      <li>Fashion/Tech 2015</li>
    </ul>
    `,
    `Earned the rank of <a href="https://en.wikipedia.org/wiki/Eagle_Scout" itemprop="award">Eagle Scout</a> in 2006.`,
  ],
}

export default resume
